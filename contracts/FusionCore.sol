//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./FusionToken.sol";

contract FusionCore {

    ///@notice staking events emitted after each action.
    event Lend(address indexed lender, uint amount);
    event WithdrawLend(address indexed lender, uint amount);
    event ClaimYield(address indexed lender, uint amount);
    event Collateralize(address indexed borrower, uint amount);
    event WithdrawCollateral(address indexed borrower, uint amount);
    event Borrow(address indexed borrower, uint amount);
    event Repay(address indexed borrower, uint amount);

    ///@notice mappings needed to keep track of lending
    mapping(address => uint) public lendingBalance;
    mapping(address => uint) public fusionBalance;
    mapping(address => uint) public startTime;
    mapping(address => bool) public isStaking;

    ///@notice mappings needed to keep track of collateral and borrowing
    mapping(address => uint) public collateralBalance;
    mapping(address => uint) public borrowBalance;
    mapping(address => uint) public borrowLimit;
    mapping(address => bool) public isBorrowing;

    ///@notice declaring chainlink's price aggregator.
    AggregatorV3Interface internal priceFeed;
    address public constant baseAsset = 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e;

    ///@notice declaring token variables.
    IERC20 public immutable usdcToken;
    FusionToken public immutable fusionToken;

    ///@notice initiating tokens
    ///@param _usdcAddress address of USDC token
    ///@param _fusionAddress address of $FUSN token
    constructor(IERC20 _usdcAddress, FusionToken _fusionAddress) {
        usdcToken = _usdcAddress;
        fusionToken = _fusionAddress;
        priceFeed = AggregatorV3Interface(baseAsset);
    } 

    ///@notice calculates amount of time the lender has been lending since the last update.
    ///@param _lender address of lender
    ///@return stakingTime amount of time staked by lender
    function calculateYieldTime(address _lender) public view returns(uint stakingTime) {
        stakingTime = block.timestamp - startTime[_lender];
    }

    ///@notice calculates amount of $FUSN tokens the lender has earned since the last update.
    ///@dev rate = timeStaked / amount of time needed to earn 100% of $FUSN tokens. 31536000 = number of seconds in a year.
    ///@param _lender address of lender
    ///@return yield amount of $FUSN tokens earned by lender
    function calculateYieldTotal(address _lender) public view returns(uint yield) {
        uint timeStaked = calculateYieldTime(_lender) * 10**18;
        uint rate = timeStaked / 31536000; 
        yield = (lendingBalance[_lender] * rate) / 10**18;
    }

    ///@notice calculates the borrow limit depending on the price of ETH and borrow limit rate.
    ///@return limit current borrow limit for user
    function calculateBorrowLimit(address _lender) public view returns(uint limit) {
        (,int price,,,) = priceFeed.latestRoundData();
        uint ethPrice = uint(price) / 10**8;
        limit = (((ethPrice * collateralBalance[_lender]) / 100) * 70) / 10**18;
    }

    ///@notice lends usdc.
    ///@param _amount amount of tokens to lend
    function lend(uint _amount) public {
        require(_amount > 0, "Canno lend amount: 0!");
        require(usdcToken.balanceOf(msg.sender) >= _amount, "Insufficient balance!");

        if(isStaking[msg.sender]) {
            uint yield = calculateYieldTotal(msg.sender);
            fusionBalance[msg.sender] += yield; 
        }

        lendingBalance[msg.sender] += _amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;

        require(usdcToken.transferFrom(msg.sender, address(this), _amount), "Transaction failed!");

        emit Lend(msg.sender, _amount);
    }

    ///@notice withdraw usdc.
    ///@param _amount amount of tokens to withdraw
    function withdrawLend(uint _amount) public {
        require(isStaking[msg.sender], "Can't withdraw before lending!");
        require(lendingBalance[msg.sender] >= _amount, "Insufficient lending balance!");

        uint yield = calculateYieldTotal(msg.sender);
        startTime[msg.sender] = block.timestamp;
        uint withdrawAmount = _amount;
        _amount = 0;
        lendingBalance[msg.sender] -= withdrawAmount;

        require(usdcToken.transfer(msg.sender, withdrawAmount), "Transaction failed!");
        fusionBalance[msg.sender] += yield;

        if(lendingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }

        emit WithdrawLend(msg.sender, withdrawAmount);
    }
    
    ///@notice claims all yield earned by lender.
    function claimYield() public {
        uint yield = calculateYieldTotal(msg.sender);

        require(yield > 0 || fusionBalance[msg.sender] > 0, "No, $FUSN tokens earned!");

        if(fusionBalance[msg.sender] != 0) {
            uint oldYield = fusionBalance[msg.sender];
            fusionBalance[msg.sender] = 0;
            yield += oldYield;
        }

        startTime[msg.sender] = block.timestamp;
        fusionToken.mint(msg.sender, yield);

        emit ClaimYield(msg.sender, yield);
    }

    ///@notice collateralizes user's ETH and sets borrow limit
    function collateralize() public payable {
        require(msg.value > 0, "Can't collaterlize ETH amount: 0!");

        collateralBalance[msg.sender] += msg.value;

        if(isBorrowing[msg.sender]){
            borrowLimit[msg.sender] = calculateBorrowLimit(msg.sender) - borrowBalance[msg.sender];
        } else {
            borrowLimit[msg.sender] = calculateBorrowLimit(msg.sender);
        }

        emit Collateralize(msg.sender, msg.value);
    } 

    ///@notice withdraw user's collateral ETH and recalculates the borrow limit
    ///@param _amount amount of ETH the user wants to withdraw
    function withdrawCollateral(uint _amount) public {
        require(collateralBalance[msg.sender] >= _amount, "Not enough collateral to withdraw!");
        require(!isBorrowing[msg.sender], "Can't withdraw collateral while borrowing!");

        collateralBalance[msg.sender] -= _amount;
        borrowLimit[msg.sender] = calculateBorrowLimit(msg.sender);

        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transaction Failed!");

        emit WithdrawCollateral(msg.sender, _amount);
    }

    ///@notice borrows usdc
    ///@param _amount amount of usdc to borrow
    function borrow(uint _amount) public {
        require(collateralBalance[msg.sender] > 0, "No ETH collateralized!");
        require(borrowLimit[msg.sender] >= _amount, "Borrow amount exceeds borrow limit!");

        isBorrowing[msg.sender] = true;
        borrowBalance[msg.sender] += _amount;
        borrowLimit[msg.sender] -= _amount;

        require(usdcToken.transfer(msg.sender, _amount), "Transaction failed!");

        emit Borrow(msg.sender, _amount);
    }
    
    ///@notice repays usdc debt
    ///@param _amount amount of usdc to repay
    function repay(uint _amount) public {
        require(isBorrowing[msg.sender], "Can't repay before borrowing!");
        require(usdcToken.balanceOf(msg.sender) >= _amount, "Insufficient funds!");
        require(_amount > 0 && _amount <= borrowBalance[msg.sender], "Can't repay amount: 0 or more than amount borrowed!");

        if(_amount == borrowBalance[msg.sender]){ 
            isBorrowing[msg.sender] = false;
        }

        borrowLimit[msg.sender] += _amount;
        borrowBalance[msg.sender] -= _amount;

        require(usdcToken.transferFrom(msg.sender, address(this), _amount), "Transaction Failed!");

        emit Repay(msg.sender, _amount);
    }
}
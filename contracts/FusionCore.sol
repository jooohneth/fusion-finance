//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FusionToken.sol";

contract FusionCore {

    IERC20 public usdcToken;
    FusionToken public fusionToken;

    mapping(address => uint) public lendingBalance;
    mapping(address => uint) public fusionBalance;
    mapping(address => uint) public startTime;
    mapping(address => bool) public isStaking;
    
    constructor(IERC20 _usdcAddress, FusionToken _fusionAddress) {
        usdcToken = _usdcAddress;
        fusionToken = _fusionAddress;
    } 
}
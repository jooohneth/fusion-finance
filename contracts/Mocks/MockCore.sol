//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../FusionCore.sol";

contract MockCore is FusionCore {

    constructor(IERC20 _baseAssetAddress, FusionToken _fusionAddress) FusionCore(_baseAssetAddress, _fusionAddress){}

    modifier passedLiquidation(address _borrower) override {
        uint ethPrice = 1;
        require((ethPrice * collateralBalance[_borrower]) <= calculateLiquidationPoint(_borrower), "Position can't be liquidated!");
        _;
    }

}
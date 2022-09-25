// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

///@notice Mock of Base Asset ERC20 contract
contract MockERC20 is ERC20 {

    constructor() ERC20("Mock Base Asset", "MOCK") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
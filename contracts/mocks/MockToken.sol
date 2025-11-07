// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../core/ERC20Base.sol";

/**
 * @title MockToken
 * @dev Test-only ERC-20 implementation for testing purposes
 */
contract MockToken is ERC20Base {
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply
    ) ERC20Base(name_, symbol_, decimals_) {
        _mint(_msgSender(), initialSupply);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}
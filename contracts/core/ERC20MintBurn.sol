// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC20Pausable.sol";

/**
 * @title ERC20MintBurn
 * @dev ERC-20 token with mint and burn functionality
 */
contract ERC20MintBurn is ERC20Pausable {
    uint256 public maxSupply;

    event MaxSupplyUpdated(uint256 oldMaxSupply, uint256 newMaxSupply);

    constructor(
        string memory name_, 
        string memory symbol_, 
        uint8 decimals_,
        uint256 maxSupply_
    ) ERC20Pausable(name_, symbol_, decimals_) {
        maxSupply = maxSupply_;
    }

    function mint(address to, uint256 amount) public virtual onlyRole(MINTER_ROLE) {
        require(to != address(0), "ERC20MintBurn: mint to zero address");
        require(totalSupply() + amount <= maxSupply, "ERC20MintBurn: exceeds max supply");
        
        _mint(to, amount);
    }

    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public virtual onlyRole(BURNER_ROLE) {
        require(account != address(0), "ERC20MintBurn: burn from zero address");
        
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20MintBurn: burn amount exceeds allowance");
        
        _approve(account, _msgSender(), currentAllowance - amount);
        _burn(account, amount);
    }

    function setMaxSupply(uint256 newMaxSupply) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newMaxSupply >= totalSupply(), "ERC20MintBurn: max supply below current supply");
        
        uint256 oldMaxSupply = maxSupply;
        maxSupply = newMaxSupply;
        
        emit MaxSupplyUpdated(oldMaxSupply, newMaxSupply);
    }
}
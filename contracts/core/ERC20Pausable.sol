// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC20Base.sol";
import "./ERC20Roles.sol";

/**
 * @title ERC20Pausable
 * @dev ERC-20 token with pausable transfers
 */
contract ERC20Pausable is ERC20Base, ERC20Roles {
    bool private _paused;

    event Paused(address account);
    event Unpaused(address account);

    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    modifier whenPaused() {
        _requirePaused();
        _;
    }

    constructor(string memory name_, string memory symbol_, uint8 decimals_) 
        ERC20Base(name_, symbol_, decimals_) 
        ERC20Roles() 
    {
        _paused = false;
    }

    function paused() public view virtual returns (bool) {
        return _paused;
    }

    function _requireNotPaused() internal view virtual {
        require(!paused(), "Pausable: paused");
    }

    function _requirePaused() internal view virtual {
        require(paused(), "Pausable: not paused");
    }

    function pause() public virtual onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public virtual onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override whenNotPaused {
        super._transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal virtual override whenNotPaused {
        super._mint(to, amount);
    }

    function _burn(address from, uint256 amount) internal virtual override whenNotPaused {
        super._burn(from, amount);
    }
}
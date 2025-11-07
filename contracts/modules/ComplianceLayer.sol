// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./FeeMechanism.sol";
import "../interfaces/ICompliance.sol";
import "../utils/Events.sol";

/**
 * @title ComplianceLayer
 * @dev Blacklist, transaction limits, and address validation
 */
contract ComplianceLayer is FeeMechanism, ICompliance {
    mapping(address => bool) private _blacklisted;
    uint256 private _transferLimit;

    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 maxSupply_,
        uint256 transferFee_,
        address treasury_,
        uint256 burnRate_,
        uint256 transferLimit_
    ) FeeMechanism(name_, symbol_, decimals_, maxSupply_, transferFee_, treasury_, burnRate_) {
        _transferLimit = transferLimit_;
        _setupRole(COMPLIANCE_ROLE, _msgSender());
    }

    function isBlacklisted(address account) public view override returns (bool) {
        return _blacklisted[account];
    }

    function transferLimit() public view override returns (uint256) {
        return _transferLimit;
    }

    function blacklistAddress(address account) external override onlyRole(COMPLIANCE_ROLE) {
        require(account != address(0), "ComplianceLayer: cannot blacklist zero address");
        require(!_blacklisted[account], "ComplianceLayer: already blacklisted");
        
        _blacklisted[account] = true;
        emit AddressBlacklisted(account);
    }

    function whitelistAddress(address account) external override onlyRole(COMPLIANCE_ROLE) {
        require(_blacklisted[account], "ComplianceLayer: not blacklisted");
        
        _blacklisted[account] = false;
        emit AddressWhitelisted(account);
    }

    function setTransferLimit(uint256 newLimit) external override onlyRole(COMPLIANCE_ROLE) {
        uint256 oldLimit = _transferLimit;
        _transferLimit = newLimit;
        emit TransferLimitUpdated(oldLimit, newLimit);
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        // Check blacklist
        if (_blacklisted[from]) {
            Events.TransferBlocked(from, to, amount, "Sender blacklisted");
            revert("ComplianceLayer: sender is blacklisted");
        }
        
        if (_blacklisted[to]) {
            Events.TransferBlocked(from, to, amount, "Recipient blacklisted");
            revert("ComplianceLayer: recipient is blacklisted");
        }

        // Check transfer limits
        if (_transferLimit > 0 && amount > _transferLimit) {
            Events.TransferBlocked(from, to, amount, "Amount exceeds limit");
            revert("ComplianceLayer: transfer amount exceeds limit");
        }

        super._transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal virtual override {
        require(!_blacklisted[to], "ComplianceLayer: cannot mint to blacklisted address");
        super._mint(to, amount);
    }
}
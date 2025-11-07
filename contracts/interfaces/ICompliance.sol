// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @dev Interface for compliance functionality
 */
interface ICompliance {
    event AddressBlacklisted(address indexed account);
    event AddressWhitelisted(address indexed account);
    event TransferLimitUpdated(uint256 oldLimit, uint256 newLimit);

    function isBlacklisted(address account) external view returns (bool);
    function transferLimit() external view returns (uint256);
    
    function blacklistAddress(address account) external;
    function whitelistAddress(address account) external;
    function setTransferLimit(uint256 newLimit) external;
}
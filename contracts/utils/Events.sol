// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Events
 * @dev Common events used across the token ecosystem
 */
library Events {
    // Fee mechanism events
    event FeeCollected(address indexed from, address indexed to, uint256 amount, uint256 fee);
    event TokensBurned(address indexed account, uint256 amount, string reason);
    
    // Compliance events
    event ComplianceViolation(address indexed account, string reason);
    event TransferBlocked(address indexed from, address indexed to, uint256 amount, string reason);
    
    // Governance events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event ProposalExecuted(uint256 indexed proposalId, bool success);
    
    // Analytics events
    event TransferAnalytics(
        address indexed from, 
        address indexed to, 
        uint256 amount, 
        uint256 timestamp,
        bytes32 indexed category
    );
    
    event UserActivity(
        address indexed user,
        string action,
        uint256 value,
        uint256 timestamp
    );
}
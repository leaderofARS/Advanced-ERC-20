// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Governance.sol";
import "../utils/Events.sol";

/**
 * @title AnalyticsHooks
 * @dev Event-based tracking and monitoring hooks
 */
contract AnalyticsHooks is Governance {
    struct TransferMetrics {
        uint256 totalTransfers;
        uint256 totalVolume;
        uint256 uniqueUsers;
        mapping(address => bool) hasTransferred;
    }

    TransferMetrics public metrics;
    mapping(bytes32 => uint256) public categoryVolume;
    
    bytes32 public constant ANALYTICS_ROLE = keccak256("ANALYTICS_ROLE");
    bytes32 public constant CATEGORY_STANDARD = keccak256("STANDARD");
    bytes32 public constant CATEGORY_FEE = keccak256("FEE");
    bytes32 public constant CATEGORY_MINT = keccak256("MINT");
    bytes32 public constant CATEGORY_BURN = keccak256("BURN");

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 maxSupply_,
        uint256 transferFee_,
        address treasury_,
        uint256 burnRate_,
        uint256 transferLimit_
    ) Governance(name_, symbol_, decimals_, maxSupply_, transferFee_, treasury_, burnRate_, transferLimit_) {
        _setupRole(ANALYTICS_ROLE, _msgSender());
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        _recordTransfer(from, to, amount, CATEGORY_STANDARD);
        super._transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal virtual override {
        _recordTransfer(address(0), to, amount, CATEGORY_MINT);
        super._mint(to, amount);
    }

    function _burn(address from, uint256 amount) internal virtual override {
        _recordTransfer(from, address(0), amount, CATEGORY_BURN);
        super._burn(from, amount);
    }

    function _recordTransfer(address from, address to, uint256 amount, bytes32 category) private {
        // Update metrics
        metrics.totalTransfers++;
        metrics.totalVolume += amount;
        
        // Track unique users
        if (from != address(0) && !metrics.hasTransferred[from]) {
            metrics.hasTransferred[from] = true;
            metrics.uniqueUsers++;
        }
        if (to != address(0) && !metrics.hasTransferred[to]) {
            metrics.hasTransferred[to] = true;
            metrics.uniqueUsers++;
        }

        // Update category volume
        categoryVolume[category] += amount;

        // Emit analytics events
        Events.TransferAnalytics(from, to, amount, block.timestamp, category);
        
        if (from != address(0)) {
            Events.UserActivity(from, "transfer_out", amount, block.timestamp);
        }
        if (to != address(0)) {
            Events.UserActivity(to, "transfer_in", amount, block.timestamp);
        }
    }

    function getMetrics() external view returns (
        uint256 totalTransfers,
        uint256 totalVolume,
        uint256 uniqueUsers
    ) {
        return (
            metrics.totalTransfers,
            metrics.totalVolume,
            metrics.uniqueUsers
        );
    }

    function getCategoryVolume(bytes32 category) external view returns (uint256) {
        return categoryVolume[category];
    }

    function resetMetrics() external onlyRole(ANALYTICS_ROLE) {
        metrics.totalTransfers = 0;
        metrics.totalVolume = 0;
        metrics.uniqueUsers = 0;
    }
}
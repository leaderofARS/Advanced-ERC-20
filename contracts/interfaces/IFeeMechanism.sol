// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @dev Interface for fee mechanism functionality
 */
interface IFeeMechanism {
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event BurnRateUpdated(uint256 oldRate, uint256 newRate);

    function transferFee() external view returns (uint256);
    function treasury() external view returns (address);
    function burnRate() external view returns (uint256);
    
    function setTransferFee(uint256 newFee) external;
    function setTreasury(address newTreasury) external;
    function setBurnRate(uint256 newRate) external;
}
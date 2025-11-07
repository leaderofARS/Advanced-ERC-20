// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../core/ERC20MintBurn.sol";
import "../interfaces/IFeeMechanism.sol";
import "../utils/Events.sol";

/**
 * @title FeeMechanism
 * @dev Fee on transfer with burn and treasury routing
 */
contract FeeMechanism is ERC20MintBurn, IFeeMechanism {
    uint256 private _transferFee; // Fee in basis points (100 = 1%)
    address private _treasury;
    uint256 private _burnRate; // Percentage of fee to burn (100 = 100%)

    uint256 public constant MAX_FEE = 1000; // 10% max fee
    uint256 public constant BASIS_POINTS = 10000;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 maxSupply_,
        uint256 transferFee_,
        address treasury_,
        uint256 burnRate_
    ) ERC20MintBurn(name_, symbol_, decimals_, maxSupply_) {
        require(transferFee_ <= MAX_FEE, "FeeMechanism: fee too high");
        require(treasury_ != address(0), "FeeMechanism: treasury is zero address");
        require(burnRate_ <= 100, "FeeMechanism: burn rate too high");

        _transferFee = transferFee_;
        _treasury = treasury_;
        _burnRate = burnRate_;
    }

    function transferFee() public view override returns (uint256) {
        return _transferFee;
    }

    function treasury() public view override returns (address) {
        return _treasury;
    }

    function burnRate() public view override returns (uint256) {
        return _burnRate;
    }

    function setTransferFee(uint256 newFee) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFee <= MAX_FEE, "FeeMechanism: fee too high");
        uint256 oldFee = _transferFee;
        _transferFee = newFee;
        emit FeeUpdated(oldFee, newFee);
    }

    function setTreasury(address newTreasury) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "FeeMechanism: treasury is zero address");
        address oldTreasury = _treasury;
        _treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    function setBurnRate(uint256 newRate) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRate <= 100, "FeeMechanism: burn rate too high");
        uint256 oldRate = _burnRate;
        _burnRate = newRate;
        emit BurnRateUpdated(oldRate, newRate);
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        if (_transferFee == 0 || from == _treasury || to == _treasury) {
            super._transfer(from, to, amount);
            return;
        }

        uint256 feeAmount = (amount * _transferFee) / BASIS_POINTS;
        uint256 transferAmount = amount - feeAmount;

        if (feeAmount > 0) {
            uint256 burnAmount = (feeAmount * _burnRate) / 100;
            uint256 treasuryAmount = feeAmount - burnAmount;

            if (burnAmount > 0) {
                super._transfer(from, address(0), burnAmount);
                Events.TokensBurned(from, burnAmount, "Transfer fee burn");
            }

            if (treasuryAmount > 0) {
                super._transfer(from, _treasury, treasuryAmount);
            }

            Events.FeeCollected(from, to, amount, feeAmount);
        }

        super._transfer(from, to, transferAmount);
    }
}
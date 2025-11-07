// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../utils/Address.sol";

/**
 * @title UpgradeableProxy
 * @dev UUPS (Universal Upgradeable Proxy Standard) implementation
 */
contract UpgradeableProxy {
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    event Upgraded(address indexed implementation);
    event AdminChanged(address previousAdmin, address newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == _getAdmin(), "UpgradeableProxy: caller is not admin");
        _;
    }

    constructor(address implementation, address admin, bytes memory data) {
        _setImplementation(implementation);
        _setAdmin(admin);
        
        if (data.length > 0) {
            Address.functionCall(implementation, data);
        }
    }

    function implementation() external view returns (address) {
        return _getImplementation();
    }

    function admin() external view returns (address) {
        return _getAdmin();
    }

    function upgradeTo(address newImplementation) external onlyAdmin {
        _upgradeTo(newImplementation);
    }

    function upgradeToAndCall(address newImplementation, bytes calldata data) external payable onlyAdmin {
        _upgradeTo(newImplementation);
        Address.functionCallWithValue(newImplementation, data, msg.value);
    }

    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "UpgradeableProxy: new admin is zero address");
        emit AdminChanged(_getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    function _getImplementation() internal view returns (address) {
        return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }

    function _setImplementation(address newImplementation) private {
        require(Address.isContract(newImplementation), "UpgradeableProxy: implementation is not contract");
        StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
    }

    function _getAdmin() internal view returns (address) {
        return StorageSlot.getAddressSlot(_ADMIN_SLOT).value;
    }

    function _setAdmin(address newAdmin) private {
        StorageSlot.getAddressSlot(_ADMIN_SLOT).value = newAdmin;
    }

    function _upgradeTo(address newImplementation) internal {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    fallback() external payable {
        _delegate(_getImplementation());
    }

    receive() external payable {
        _delegate(_getImplementation());
    }

    function _delegate(address implementation) internal {
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}

library StorageSlot {
    struct AddressSlot {
        address value;
    }

    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
    }
}
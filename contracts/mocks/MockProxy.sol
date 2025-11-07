// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MockProxy
 * @dev Mock proxy contract for testing upgrade functionality
 */
contract MockProxy {
    address public implementation;
    address public admin;
    
    mapping(bytes4 => address) public implementations;

    event Upgraded(address indexed implementation);
    event AdminChanged(address previousAdmin, address newAdmin);

    constructor(address _implementation, address _admin) {
        implementation = _implementation;
        admin = _admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "MockProxy: caller is not admin");
        _;
    }

    function upgrade(address newImplementation) external onlyAdmin {
        implementation = newImplementation;
        emit Upgraded(newImplementation);
    }

    function changeAdmin(address newAdmin) external onlyAdmin {
        address previousAdmin = admin;
        admin = newAdmin;
        emit AdminChanged(previousAdmin, newAdmin);
    }

    fallback() external payable {
        _delegate(implementation);
    }

    receive() external payable {
        _delegate(implementation);
    }

    function _delegate(address _implementation) internal {
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)
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
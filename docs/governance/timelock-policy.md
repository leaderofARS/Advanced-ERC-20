# Timelock Policy

## Overview
This document establishes the timelock policy for the Advanced ERC-20 token system, ensuring that critical system changes undergo appropriate delay periods for community review and security validation.

## Timelock Principles

### Security Through Delay
- **Transparency**: All changes are visible before execution
- **Community Review**: Stakeholders can analyze proposed changes
- **Emergency Response**: Time to react to malicious proposals
- **Mistake Prevention**: Opportunity to catch and correct errors

### Graduated Delays
Different types of changes require different delay periods based on their impact and risk level.

## Timelock Categories

### Category 1: Critical System Changes (7 Days)
**Delay Period**: 7 days (604,800 seconds)

**Affected Operations**:
- Role admin changes for critical roles
- Upgrade implementation changes
- Emergency pause mechanism modifications
- Core contract logic updates

**Rationale**: These changes affect the fundamental security and operation of the system.

```solidity
// Example: Critical role changes
function setRoleAdmin(bytes32 role, bytes32 adminRole) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Unauthorized");
    require(block.timestamp >= timelockExpiry[msg.sig], "Timelock not expired");
    
    _setRoleAdmin(role, adminRole);
    
    // Reset timelock for next change
    timelockExpiry[msg.sig] = block.timestamp + 7 days;
}
```

### Category 2: Economic Parameters (3 Days)
**Delay Period**: 3 days (259,200 seconds)

**Affected Operations**:
- Transfer fee adjustments
- Burn rate modifications
- Treasury address changes
- Maximum supply changes

**Rationale**: Economic changes impact token value and holder interests.

```solidity
// Example: Fee changes with timelock
function setTransferFee(uint256 newFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(block.timestamp >= feeChangeTimelock, "Fee change timelock active");
    require(newFee <= MAX_FEE, "Fee too high");
    
    uint256 oldFee = _transferFee;
    _transferFee = newFee;
    
    emit FeeUpdated(oldFee, newFee);
    
    // Set timelock for next change
    feeChangeTimelock = block.timestamp + 3 days;
}
```

### Category 3: Compliance Parameters (1 Day)
**Delay Period**: 1 day (86,400 seconds)

**Affected Operations**:
- Transfer limit adjustments
- Blacklist policy changes
- KYC requirement modifications
- Compliance role assignments

**Rationale**: Compliance changes may be needed for regulatory response but still require review.

```solidity
// Example: Transfer limit changes
function setTransferLimit(uint256 newLimit) external onlyRole(COMPLIANCE_ROLE) {
    require(block.timestamp >= transferLimitTimelock, "Transfer limit timelock active");
    
    uint256 oldLimit = _transferLimit;
    _transferLimit = newLimit;
    
    emit TransferLimitUpdated(oldLimit, newLimit);
    
    // Set timelock for next change
    transferLimitTimelock = block.timestamp + 1 days;
}
```

### Category 4: Governance Parameters (2 Days)
**Delay Period**: 2 days (172,800 seconds)

**Affected Operations**:
- Voting period changes
- Quorum adjustments
- Proposal threshold modifications
- Governor role changes

**Rationale**: Governance changes affect the democratic process and require community input.

### Category 5: Emergency Operations (Immediate)
**Delay Period**: 0 seconds (immediate execution)

**Affected Operations**:
- Emergency pause activation
- Security incident response
- Blacklisting malicious addresses
- Emergency role revocation

**Rationale**: Security threats require immediate response capability.

```solidity
// Example: Emergency pause (no timelock)
function emergencyPause() external onlyRole(PAUSER_ROLE) {
    _pause();
    emit EmergencyPauseActivated(_msgSender(), block.timestamp);
}
```

## Implementation Architecture

### Timelock Storage
```solidity
contract TimelockController {
    // Timelock storage for different operation types
    mapping(bytes4 => uint256) public timelockExpiry;
    mapping(address => mapping(bytes4 => uint256)) public userTimelocks;
    
    // Timelock durations for different categories
    uint256 public constant CRITICAL_TIMELOCK = 7 days;
    uint256 public constant ECONOMIC_TIMELOCK = 3 days;
    uint256 public constant COMPLIANCE_TIMELOCK = 1 days;
    uint256 public constant GOVERNANCE_TIMELOCK = 2 days;
    
    // Pending operations
    struct PendingOperation {
        bytes32 id;
        address target;
        bytes data;
        uint256 executeAfter;
        bool executed;
        bool cancelled;
    }
    
    mapping(bytes32 => PendingOperation) public pendingOperations;
}
```

### Timelock Modifiers
```solidity
modifier timelocked(uint256 delay) {
    bytes4 selector = msg.sig;
    require(
        block.timestamp >= timelockExpiry[selector],
        "Timelock: operation is timelocked"
    );
    _;
    
    // Reset timelock for next operation
    timelockExpiry[selector] = block.timestamp + delay;
}

modifier criticalTimelock() {
    _;
    timelockExpiry[msg.sig] = block.timestamp + CRITICAL_TIMELOCK;
}

modifier economicTimelock() {
    _;
    timelockExpiry[msg.sig] = block.timestamp + ECONOMIC_TIMELOCK;
}
```

## Timelock Workflow

### 1. Operation Scheduling
```solidity
function scheduleOperation(
    address target,
    bytes calldata data,
    uint256 delay
) external onlyRole(TIMELOCK_ADMIN_ROLE) returns (bytes32) {
    bytes32 id = keccak256(abi.encode(target, data, block.timestamp));
    
    require(delay >= getMinDelay(data), "Delay too short");
    
    pendingOperations[id] = PendingOperation({
        id: id,
        target: target,
        data: data,
        executeAfter: block.timestamp + delay,
        executed: false,
        cancelled: false
    });
    
    emit OperationScheduled(id, target, data, block.timestamp + delay);
    return id;
}
```

### 2. Operation Execution
```solidity
function executeOperation(bytes32 id) external {
    PendingOperation storage op = pendingOperations[id];
    
    require(op.id != 0, "Operation does not exist");
    require(!op.executed, "Operation already executed");
    require(!op.cancelled, "Operation was cancelled");
    require(block.timestamp >= op.executeAfter, "Timelock not expired");
    
    op.executed = true;
    
    (bool success, bytes memory returnData) = op.target.call(op.data);
    require(success, "Operation execution failed");
    
    emit OperationExecuted(id, op.target, op.data);
}
```

### 3. Operation Cancellation
```solidity
function cancelOperation(bytes32 id) external onlyRole(TIMELOCK_ADMIN_ROLE) {
    PendingOperation storage op = pendingOperations[id];
    
    require(op.id != 0, "Operation does not exist");
    require(!op.executed, "Cannot cancel executed operation");
    
    op.cancelled = true;
    
    emit OperationCancelled(id);
}
```

## Emergency Override Mechanisms

### Guardian Role
```solidity
bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

function emergencyOverride(bytes32 operationId) external onlyRole(GUARDIAN_ROLE) {
    require(isEmergencyCondition(), "No emergency condition");
    
    PendingOperation storage op = pendingOperations[operationId];
    op.executeAfter = block.timestamp; // Allow immediate execution
    
    emit EmergencyOverride(operationId, _msgSender());
}
```

### Multi-Signature Requirements
```solidity
mapping(bytes32 => mapping(address => bool)) public guardianApprovals;
mapping(bytes32 => uint256) public approvalCount;

function approveEmergencyOverride(bytes32 operationId) external onlyRole(GUARDIAN_ROLE) {
    require(!guardianApprovals[operationId][_msgSender()], "Already approved");
    
    guardianApprovals[operationId][_msgSender()] = true;
    approvalCount[operationId]++;
    
    if (approvalCount[operationId] >= REQUIRED_GUARDIAN_APPROVALS) {
        pendingOperations[operationId].executeAfter = block.timestamp;
        emit EmergencyOverrideApproved(operationId);
    }
}
```

## Timelock Bypass Conditions

### Verified Emergency Conditions
1. **Security Exploit**: Active attack on the protocol
2. **Regulatory Mandate**: Legal requirement for immediate action
3. **Critical Bug**: Severe vulnerability requiring immediate patch
4. **Market Emergency**: Extreme market conditions threatening stability

### Bypass Authorization
- Requires 3 of 5 Guardian signatures
- Must provide detailed justification
- Subject to post-action review and audit
- Automatic governance proposal for ratification

## Monitoring and Alerts

### Automated Monitoring
```solidity
event OperationScheduled(bytes32 indexed id, address target, bytes data, uint256 executeAfter);
event OperationExecuted(bytes32 indexed id, address target, bytes data);
event OperationCancelled(bytes32 indexed id);
event EmergencyOverride(bytes32 indexed id, address guardian);
event TimelockViolationAttempt(address user, bytes4 selector, uint256 attemptTime);
```

### Community Alerts
- Discord/Telegram notifications for scheduled operations
- Email alerts for critical changes
- Dashboard warnings for pending operations
- Mobile app push notifications

## Governance Integration

### Proposal-Based Timelocks
```solidity
function executeProposal(uint256 proposalId) external onlyRole(GOVERNOR_ROLE) {
    Proposal storage proposal = proposals[proposalId];
    
    require(proposal.executed == false, "Already executed");
    require(block.timestamp > proposal.endTime, "Voting not ended");
    require(proposal.votesFor > proposal.votesAgainst, "Proposal failed");
    
    // Apply timelock based on proposal type
    uint256 delay = getProposalTimelock(proposal.proposalType);
    
    if (delay > 0) {
        scheduleOperation(proposal.target, proposal.data, delay);
    } else {
        // Execute immediately for emergency proposals
        (bool success,) = proposal.target.call(proposal.data);
        require(success, "Execution failed");
    }
    
    proposal.executed = true;
}
```

### Community Veto Power
```solidity
function communityVeto(bytes32 operationId) external {
    require(balanceOf(_msgSender()) >= VETO_THRESHOLD, "Insufficient tokens for veto");
    
    PendingOperation storage op = pendingOperations[operationId];
    require(block.timestamp < op.executeAfter, "Too late to veto");
    
    // Cancel operation and require new governance proposal
    op.cancelled = true;
    
    emit CommunityVeto(operationId, _msgSender());
}
```

## Best Practices

### For Administrators
1. **Plan Ahead**: Schedule non-urgent changes well in advance
2. **Communicate**: Announce planned changes to the community
3. **Document**: Provide clear rationale for all changes
4. **Test**: Validate changes on testnets before mainnet execution

### For Community
1. **Monitor**: Watch for scheduled operations
2. **Review**: Analyze proposed changes for impact
3. **Participate**: Engage in governance discussions
4. **Alert**: Report suspicious or concerning operations

### For Developers
1. **Categorize**: Properly classify operations by risk level
2. **Validate**: Implement proper timelock checks
3. **Audit**: Regular review of timelock implementations
4. **Update**: Keep timelock periods aligned with community needs

## Timelock Configuration Management

### Dynamic Timelock Adjustment
```solidity
function updateTimelockDelay(
    bytes4 selector,
    uint256 newDelay
) external onlyRole(TIMELOCK_ADMIN_ROLE) timelocked(GOVERNANCE_TIMELOCK) {
    require(newDelay >= MIN_DELAY && newDelay <= MAX_DELAY, "Invalid delay");
    
    uint256 oldDelay = timelockDelays[selector];
    timelockDelays[selector] = newDelay;
    
    emit TimelockDelayUpdated(selector, oldDelay, newDelay);
}
```

### Batch Operations
```solidity
function scheduleBatch(
    address[] calldata targets,
    bytes[] calldata datas,
    uint256 delay
) external onlyRole(TIMELOCK_ADMIN_ROLE) returns (bytes32) {
    require(targets.length == datas.length, "Array length mismatch");
    
    bytes32 batchId = keccak256(abi.encode(targets, datas, block.timestamp));
    
    // Schedule all operations with the same delay
    for (uint i = 0; i < targets.length; i++) {
        scheduleOperation(targets[i], datas[i], delay);
    }
    
    emit BatchScheduled(batchId, targets.length, delay);
    return batchId;
}
```

This timelock policy ensures that the Advanced ERC-20 system maintains security and transparency while allowing for necessary operational flexibility and emergency response capabilities.
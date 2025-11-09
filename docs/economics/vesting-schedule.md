# Vesting Schedule

## Overview
This document outlines the comprehensive vesting schedule for the Advanced ERC-20 token, ensuring fair distribution, long-term alignment, and sustainable token economics through controlled release mechanisms.

## Vesting Architecture

### Smart Contract Implementation
```solidity
contract TokenVesting {
    struct VestingSchedule {
        uint256 id;
        address beneficiary;
        uint256 totalAmount;
        uint256 startTime;
        uint256 duration;
        uint256 cliffDuration;
        uint256 released;
        bool revocable;
        bool revoked;
        VestingType vestingType;
    }
    
    enum VestingType {
        LINEAR,
        CLIFF_THEN_LINEAR,
        MILESTONE_BASED,
        PERFORMANCE_BASED
    }
    
    mapping(uint256 => VestingSchedule) public vestingSchedules;
    mapping(address => uint256[]) public beneficiarySchedules;
    uint256 public nextScheduleId;
}
```

## Vesting Categories

### 1. Team and Advisors Vesting
**Total Allocation**: 40,000 tokens (20% of initial supply)
**Vesting Period**: 24 months
**Cliff Period**: 6 months
**Release Schedule**: Linear after cliff

```
Team Vesting Timeline:
Month 0-6:   0% (Cliff period)
Month 7:     25% (Cliff release)
Month 8-24:  Linear release of remaining 75%
```

**Implementation**:
```solidity
function createTeamVesting(
    address beneficiary,
    uint256 amount
) external onlyRole(VESTING_ADMIN_ROLE) {
    require(amount <= teamAllocation, "Exceeds team allocation");
    
    uint256 scheduleId = nextScheduleId++;
    
    vestingSchedules[scheduleId] = VestingSchedule({
        id: scheduleId,
        beneficiary: beneficiary,
        totalAmount: amount,
        startTime: block.timestamp,
        duration: 24 * 30 days, // 24 months
        cliffDuration: 6 * 30 days, // 6 months
        released: 0,
        revocable: true,
        revoked: false,
        vestingType: VestingType.CLIFF_THEN_LINEAR
    });
    
    beneficiarySchedules[beneficiary].push(scheduleId);
    teamAllocation -= amount;
    
    emit VestingScheduleCreated(scheduleId, beneficiary, amount, VestingType.CLIFF_THEN_LINEAR);
}
```

### 2. Community Incentives Vesting
**Total Allocation**: 50,000 tokens (25% of initial supply)
**Vesting Period**: Variable based on program
**Release Schedule**: Performance and milestone-based

```
Community Programs:
├── Liquidity Mining: 20,000 tokens
│   ├── 12-month program
│   └── Weekly releases based on participation
│
├── Governance Rewards: 15,000 tokens
│   ├── 18-month program
│   └── Monthly releases for active participation
│
├── Bug Bounties: 10,000 tokens
│   ├── Immediate release for critical bugs
│   └── 3-month vesting for major bugs
│
└── Community Building: 5,000 tokens
    ├── 6-month programs
    └── Milestone-based releases
```

**Liquidity Mining Implementation**:
```solidity
struct LiquidityMiningSchedule {
    address provider;
    uint256 totalRewards;
    uint256 startTime;
    uint256 duration;
    uint256 lastClaimTime;
    uint256 claimed;
    uint256 stakingAmount;
}

function claimLiquidityRewards(uint256 scheduleId) external {
    LiquidityMiningSchedule storage schedule = liquiditySchedules[scheduleId];
    require(schedule.provider == _msgSender(), "Not authorized");
    
    uint256 claimable = calculateLiquidityRewards(scheduleId);
    require(claimable > 0, "No rewards to claim");
    
    schedule.claimed += claimable;
    schedule.lastClaimTime = block.timestamp;
    
    _mint(_msgSender(), claimable);
    
    emit LiquidityRewardsClaimed(scheduleId, _msgSender(), claimable);
}
```

### 3. Treasury Reserve Vesting
**Total Allocation**: 60,000 tokens (30% of initial supply)
**Vesting Period**: 36 months
**Release Schedule**: Quarterly releases with governance approval

```
Treasury Release Schedule:
Quarter 1-4:   5,000 tokens per quarter (33% in Year 1)
Quarter 5-8:   4,000 tokens per quarter (27% in Year 2)
Quarter 9-12:  3,000 tokens per quarter (20% in Year 3)
Remaining:     20,000 tokens (20% for future use)
```

**Implementation**:
```solidity
struct TreasuryRelease {
    uint256 quarter;
    uint256 amount;
    uint256 releaseTime;
    bool approved;
    bool released;
    string purpose;
}

mapping(uint256 => TreasuryRelease) public treasuryReleases;

function approveTreasuryRelease(
    uint256 quarter,
    uint256 amount,
    string calldata purpose
) external onlyRole(GOVERNANCE_ROLE) {
    require(quarter <= 12, "Invalid quarter");
    require(amount <= getQuarterlyLimit(quarter), "Exceeds quarterly limit");
    
    treasuryReleases[quarter] = TreasuryRelease({
        quarter: quarter,
        amount: amount,
        releaseTime: getQuarterStartTime(quarter),
        approved: true,
        released: false,
        purpose: purpose
    });
    
    emit TreasuryReleaseApproved(quarter, amount, purpose);
}
```

### 4. Investor Vesting (Future Rounds)
**Vesting Structure**: Varies by investment round
**Standard Terms**: 12-month cliff, 36-month total vesting

```
Seed Round (Future):
├── Cliff: 12 months
├── Total Vesting: 36 months
└── Linear release after cliff

Series A (Future):
├── Cliff: 6 months
├── Total Vesting: 24 months
└── Linear release after cliff

Strategic Partners:
├── Cliff: 3 months
├── Total Vesting: 18 months
└── Milestone-based releases
```

## Vesting Calculation Methods

### Linear Vesting
```solidity
function calculateLinearVesting(uint256 scheduleId) public view returns (uint256) {
    VestingSchedule storage schedule = vestingSchedules[scheduleId];
    
    if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
        return 0;
    }
    
    if (block.timestamp >= schedule.startTime + schedule.duration) {
        return schedule.totalAmount - schedule.released;
    }
    
    uint256 timeVested = block.timestamp - schedule.startTime - schedule.cliffDuration;
    uint256 vestingDuration = schedule.duration - schedule.cliffDuration;
    
    uint256 cliffAmount = (schedule.totalAmount * 25) / 100; // 25% at cliff
    uint256 linearAmount = schedule.totalAmount - cliffAmount;
    
    uint256 vestedAmount = cliffAmount + (linearAmount * timeVested) / vestingDuration;
    
    return vestedAmount - schedule.released;
}
```

### Milestone-Based Vesting
```solidity
struct Milestone {
    string description;
    uint256 percentage;
    bool completed;
    uint256 completionTime;
}

mapping(uint256 => Milestone[]) public scheduleMilestones;

function completeMilestone(
    uint256 scheduleId,
    uint256 milestoneIndex
) external onlyRole(MILESTONE_VALIDATOR_ROLE) {
    require(milestoneIndex < scheduleMilestones[scheduleId].length, "Invalid milestone");
    
    Milestone storage milestone = scheduleMilestones[scheduleId][milestoneIndex];
    require(!milestone.completed, "Milestone already completed");
    
    milestone.completed = true;
    milestone.completionTime = block.timestamp;
    
    emit MilestoneCompleted(scheduleId, milestoneIndex, milestone.description);
}

function calculateMilestoneVesting(uint256 scheduleId) public view returns (uint256) {
    VestingSchedule storage schedule = vestingSchedules[scheduleId];
    Milestone[] storage milestones = scheduleMilestones[scheduleId];
    
    uint256 totalPercentage = 0;
    
    for (uint256 i = 0; i < milestones.length; i++) {
        if (milestones[i].completed) {
            totalPercentage += milestones[i].percentage;
        }
    }
    
    uint256 vestedAmount = (schedule.totalAmount * totalPercentage) / 100;
    return vestedAmount - schedule.released;
}
```

### Performance-Based Vesting
```solidity
struct PerformanceMetrics {
    uint256 targetValue;
    uint256 currentValue;
    uint256 percentage;
    bool achieved;
}

mapping(uint256 => PerformanceMetrics[]) public performanceSchedules;

function updatePerformanceMetric(
    uint256 scheduleId,
    uint256 metricIndex,
    uint256 currentValue
) external onlyRole(PERFORMANCE_VALIDATOR_ROLE) {
    PerformanceMetrics storage metric = performanceSchedules[scheduleId][metricIndex];
    
    metric.currentValue = currentValue;
    
    if (currentValue >= metric.targetValue && !metric.achieved) {
        metric.achieved = true;
        emit PerformanceTargetAchieved(scheduleId, metricIndex, currentValue);
    }
}
```

## Vesting Management

### Release Functions
```solidity
function releaseVestedTokens(uint256 scheduleId) external {
    VestingSchedule storage schedule = vestingSchedules[scheduleId];
    require(schedule.beneficiary == _msgSender(), "Not authorized");
    require(!schedule.revoked, "Schedule revoked");
    
    uint256 releasable = getReleasableAmount(scheduleId);
    require(releasable > 0, "No tokens to release");
    
    schedule.released += releasable;
    
    _mint(schedule.beneficiary, releasable);
    
    emit VestedTokensReleased(scheduleId, schedule.beneficiary, releasable);
}

function getReleasableAmount(uint256 scheduleId) public view returns (uint256) {
    VestingSchedule storage schedule = vestingSchedules[scheduleId];
    
    if (schedule.vestingType == VestingType.LINEAR) {
        return calculateLinearVesting(scheduleId);
    } else if (schedule.vestingType == VestingType.MILESTONE_BASED) {
        return calculateMilestoneVesting(scheduleId);
    } else if (schedule.vestingType == VestingType.PERFORMANCE_BASED) {
        return calculatePerformanceVesting(scheduleId);
    }
    
    return 0;
}
```

### Revocation Mechanisms
```solidity
function revokeVestingSchedule(
    uint256 scheduleId,
    string calldata reason
) external onlyRole(VESTING_ADMIN_ROLE) {
    VestingSchedule storage schedule = vestingSchedules[scheduleId];
    require(schedule.revocable, "Schedule not revocable");
    require(!schedule.revoked, "Already revoked");
    
    // Release any currently vested tokens
    uint256 releasable = getReleasableAmount(scheduleId);
    if (releasable > 0) {
        schedule.released += releasable;
        _mint(schedule.beneficiary, releasable);
    }
    
    schedule.revoked = true;
    
    emit VestingScheduleRevoked(scheduleId, reason, releasable);
}
```

## Governance Integration

### Community-Controlled Vesting
```solidity
function proposeVestingChange(
    uint256 scheduleId,
    VestingChangeType changeType,
    uint256 newValue,
    string calldata justification
) external returns (uint256) {
    require(hasRole(GOVERNANCE_ROLE, _msgSender()), "Not authorized");
    
    uint256 proposalId = createGovernanceProposal(
        "Vesting Schedule Change",
        abi.encodeWithSelector(
            this.executeVestingChange.selector,
            scheduleId,
            changeType,
            newValue
        ),
        justification
    );
    
    emit VestingChangeProposed(proposalId, scheduleId, changeType, newValue);
    return proposalId;
}
```

### Emergency Vesting Controls
```solidity
function emergencyPauseVesting(uint256 scheduleId) external onlyRole(EMERGENCY_ROLE) {
    VestingSchedule storage schedule = vestingSchedules[scheduleId];
    schedule.paused = true;
    schedule.pauseTime = block.timestamp;
    
    emit VestingPaused(scheduleId, block.timestamp);
}

function emergencyResumeVesting(uint256 scheduleId) external onlyRole(EMERGENCY_ROLE) {
    VestingSchedule storage schedule = vestingSchedules[scheduleId];
    require(schedule.paused, "Not paused");
    
    // Extend vesting duration by pause time
    uint256 pauseDuration = block.timestamp - schedule.pauseTime;
    schedule.duration += pauseDuration;
    schedule.paused = false;
    
    emit VestingResumed(scheduleId, pauseDuration);
}
```

## Analytics and Reporting

### Vesting Analytics
```solidity
function getVestingAnalytics() external view returns (
    uint256 totalVestingSchedules,
    uint256 activeSchedules,
    uint256 totalVestedAmount,
    uint256 totalReleasedAmount,
    uint256 pendingVestingAmount
) {
    totalVestingSchedules = nextScheduleId;
    
    for (uint256 i = 0; i < nextScheduleId; i++) {
        VestingSchedule storage schedule = vestingSchedules[i];
        
        if (!schedule.revoked) {
            activeSchedules++;
            totalVestedAmount += schedule.totalAmount;
            totalReleasedAmount += schedule.released;
            
            uint256 releasable = getReleasableAmount(i);
            pendingVestingAmount += releasable;
        }
    }
}
```

### Beneficiary Dashboard
```solidity
function getBeneficiaryInfo(address beneficiary) external view returns (
    uint256[] memory scheduleIds,
    uint256[] memory totalAmounts,
    uint256[] memory releasedAmounts,
    uint256[] memory releasableAmounts,
    VestingType[] memory vestingTypes
) {
    uint256[] storage schedules = beneficiarySchedules[beneficiary];
    uint256 length = schedules.length;
    
    scheduleIds = new uint256[](length);
    totalAmounts = new uint256[](length);
    releasedAmounts = new uint256[](length);
    releasableAmounts = new uint256[](length);
    vestingTypes = new VestingType[](length);
    
    for (uint256 i = 0; i < length; i++) {
        uint256 scheduleId = schedules[i];
        VestingSchedule storage schedule = vestingSchedules[scheduleId];
        
        scheduleIds[i] = scheduleId;
        totalAmounts[i] = schedule.totalAmount;
        releasedAmounts[i] = schedule.released;
        releasableAmounts[i] = getReleasableAmount(scheduleId);
        vestingTypes[i] = schedule.vestingType;
    }
}
```

## Security Measures

### Access Controls
```solidity
bytes32 public constant VESTING_ADMIN_ROLE = keccak256("VESTING_ADMIN_ROLE");
bytes32 public constant MILESTONE_VALIDATOR_ROLE = keccak256("MILESTONE_VALIDATOR_ROLE");
bytes32 public constant PERFORMANCE_VALIDATOR_ROLE = keccak256("PERFORMANCE_VALIDATOR_ROLE");

modifier onlyBeneficiary(uint256 scheduleId) {
    require(vestingSchedules[scheduleId].beneficiary == _msgSender(), "Not beneficiary");
    _;
}

modifier scheduleExists(uint256 scheduleId) {
    require(scheduleId < nextScheduleId, "Schedule does not exist");
    _;
}
```

### Audit Trail
```solidity
event VestingScheduleCreated(uint256 indexed scheduleId, address beneficiary, uint256 amount, VestingType vestingType);
event VestedTokensReleased(uint256 indexed scheduleId, address beneficiary, uint256 amount);
event VestingScheduleRevoked(uint256 indexed scheduleId, string reason, uint256 releasedAmount);
event MilestoneCompleted(uint256 indexed scheduleId, uint256 milestoneIndex, string description);
event PerformanceTargetAchieved(uint256 indexed scheduleId, uint256 metricIndex, uint256 value);
event VestingPaused(uint256 indexed scheduleId, uint256 pauseTime);
event VestingResumed(uint256 indexed scheduleId, uint256 pauseDuration);
```

## Integration with Token Economics

### Supply Impact
- Vesting schedules control token release velocity
- Prevents sudden supply shocks
- Aligns long-term incentives with token value
- Provides predictable supply expansion

### Market Stability
- Gradual token releases maintain price stability
- Cliff periods prevent immediate selling pressure
- Performance-based vesting rewards value creation
- Revocation mechanisms protect against bad actors

This comprehensive vesting schedule ensures fair token distribution while maintaining long-term economic sustainability and stakeholder alignment.
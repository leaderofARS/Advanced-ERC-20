# Role Matrix

## Role Definitions

| Role | Description | Permissions |
|------|-------------|-------------|
| DEFAULT_ADMIN_ROLE | Super admin with all permissions | Grant/revoke all roles, system configuration |
| MINTER_ROLE | Token minting authority | Mint new tokens (within max supply) |
| BURNER_ROLE | Token burning authority | Burn tokens from any address (with allowance) |
| PAUSER_ROLE | Emergency pause authority | Pause/unpause all token operations |
| COMPLIANCE_ROLE | Regulatory compliance manager | Blacklist addresses, set transfer limits |
| GOVERNOR_ROLE | Governance system manager | Execute proposals, manage voting parameters |
| ANALYTICS_ROLE | Analytics system manager | Reset metrics, configure tracking |

## Role Hierarchy

```
DEFAULT_ADMIN_ROLE (Root)
├── MINTER_ROLE
├── BURNER_ROLE
├── PAUSER_ROLE
├── COMPLIANCE_ROLE
├── GOVERNOR_ROLE
└── ANALYTICS_ROLE
```

## Permission Matrix

| Function | Admin | Minter | Burner | Pauser | Compliance | Governor | Analytics |
|----------|-------|--------|--------|--------|------------|----------|-----------|
| grantRole | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| revokeRole | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| mint | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| burnFrom | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| pause/unpause | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| blacklistAddress | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| setTransferLimit | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| executeProposal | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| setVotingPeriod | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| resetMetrics | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| setMaxSupply | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| setTransferFee | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| setTreasury | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Best Practices

1. **Principle of Least Privilege**: Grant only necessary permissions
2. **Role Rotation**: Regularly rotate role assignments
3. **Multi-sig for Admin**: Use multi-signature wallet for admin role
4. **Time-locked Operations**: Consider timelock for critical operations
5. **Emergency Procedures**: Clear escalation path for emergencies

## Role Assignment Guidelines

### Initial Setup
- Deploy with single admin (deployer)
- Assign operational roles to dedicated addresses
- Transfer admin to multi-sig or DAO

### Operational Roles
- **Minter**: Treasury or authorized minting service
- **Pauser**: Emergency response team
- **Compliance**: Legal/compliance team
- **Governor**: DAO or governance contract

### Security Considerations
- Never assign multiple critical roles to same address
- Use hardware wallets for role holders
- Implement role change notifications
- Regular role audits and reviews
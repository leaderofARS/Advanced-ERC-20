# Fee Structure

## Transfer Fee Mechanism

The Advanced ERC-20 token implements a configurable fee system on transfers with the following characteristics:

### Fee Configuration

- **Fee Rate**: Configurable in basis points (1 basis point = 0.01%)
- **Maximum Fee**: 10% (1000 basis points) hard cap
- **Default Fee**: 1% (100 basis points)
- **Fee Exemptions**: Treasury address is exempt from fees

### Fee Distribution

Transfer fees are split between two mechanisms:

1. **Treasury Allocation**: Percentage sent to treasury address
2. **Token Burn**: Percentage permanently removed from supply

#### Default Distribution
- **Burn Rate**: 50% of collected fees
- **Treasury Rate**: 50% of collected fees

### Fee Calculation Example

For a 1000 token transfer with 1% fee and 50% burn rate:

```
Transfer Amount: 1000 tokens
Fee (1%): 10 tokens
Burn Amount (50% of fee): 5 tokens
Treasury Amount (50% of fee): 5 tokens
Recipient Receives: 990 tokens
```

### Fee Flow Diagram

```
User Transfer (1000 tokens)
         ↓
Fee Calculation (10 tokens @ 1%)
         ↓
    ┌─────────┐
    │ Fee Split │
    └─────────┘
         ↓
    ┌─────┬─────┐
    ↓     ↓     ↓
Burn   Treasury  Recipient
(5)     (5)      (990)
```

## Economic Impact

### Deflationary Pressure
- Burn mechanism reduces total supply over time
- Creates scarcity and potential value appreciation
- Burn rate is configurable (0-100% of fees)

### Treasury Funding
- Provides sustainable funding for project development
- Treasury can be DAO-controlled or multi-sig
- Funds can support ecosystem growth

### Fee Optimization
- Fees should balance revenue with user experience
- High fees may discourage usage
- Low fees may not provide sufficient funding

## Configuration Parameters

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Transfer Fee | 0-1000 bp | 100 bp | Fee rate in basis points |
| Burn Rate | 0-100% | 50% | Percentage of fees burned |
| Treasury Address | Any address | Deployer | Recipient of treasury portion |

## Governance Considerations

### Fee Changes
- Only DEFAULT_ADMIN_ROLE can modify fees
- Consider gradual changes to avoid user shock
- Communicate changes in advance

### Treasury Management
- Treasury address should be secure (multi-sig/DAO)
- Regular treasury usage reporting
- Transparent fund allocation

### Economic Monitoring
- Track fee collection rates
- Monitor burn impact on supply
- Analyze user behavior changes

## Fee Exemptions

### Current Exemptions
- Treasury address (both sending and receiving)
- Zero-value transfers
- Internal contract operations

### Future Considerations
- Whitelist for specific addresses
- Volume-based fee tiers
- Time-based fee adjustments
- Loyalty program discounts
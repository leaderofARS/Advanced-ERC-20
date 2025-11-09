# 🔥 Hardhat Ignition Modules
> **Declarative Deployment System** - Hardhat Ignition modules for reproducible and reliable smart contract deployments.

## 🎯 Overview

Hardhat Ignition provides a declarative system for deploying smart contracts. This directory contains all deployment modules that define how contracts should be deployed and configured.

### **🌟 Key Features**

- **Declarative Syntax**: Define deployments as code
- **Reproducible**: Same deployment across all networks
- **Dependency Management**: Automatic handling of contract dependencies
- **State Management**: Track deployment state and progress
- **Rollback Support**: Safe rollback on deployment failures

## 📂 Module Structure

```
ignition/
└── 📂 modules/
    ├── 📄 AdvancedERC20.ts      # Main token deployment
    ├── 📄 Governance.ts         # Governance system deployment
    └── 📄 Treasury.ts           # Treasury deployment
```

## 🚀 Usage

```bash
# Deploy to local network
npx hardhat ignition deploy ignition/modules/AdvancedERC20.ts

# Deploy to testnet
npx hardhat ignition deploy ignition/modules/AdvancedERC20.ts --network sepolia

# Deploy to mainnet
npx hardhat ignition deploy ignition/modules/AdvancedERC20.ts --network mainnet
```

## 📝 Module Example

```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AdvancedERC20", (m) => {
  const token = m.contract("AdvancedERC20", [
    "Advanced ERC-20",
    "AERC20",
    18,
    m.getParameter("initialSupply")
  ]);

  return { token };
});
```

---

**Ignition modules provide a robust and reliable deployment system for the Advanced ERC-20 platform.**
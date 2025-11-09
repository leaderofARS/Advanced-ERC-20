# ⚙️ Configuration Files
> **System Configuration & Settings** - Centralized configuration management for all platform components and environments.

## 🎯 Overview

This directory contains all configuration files for the Advanced ERC-20 platform, including network settings, deployment parameters, and environment-specific configurations.

### **🌟 Configuration Principles**

- **Environment Separation**: Distinct configs for dev, test, and production
- **Security First**: Sensitive data managed through environment variables
- **Version Control**: Configuration versioning and change tracking
- **Validation**: Automated configuration validation and testing
- **Documentation**: Comprehensive inline documentation

## 📂 Configuration Structure

```
config/
├── 📄 hardhat.config.ts          # Hardhat network configuration
├── 📄 networks.json              # Network definitions
├── 📄 deployment.json            # Deployment parameters
├── 📄 governance.json            # Governance settings
├── 📄 tokenomics.json            # Economic parameters
└── 📂 environments/              # Environment-specific configs
    ├── development.json
    ├── testnet.json
    └── mainnet.json
```

## 🔧 Configuration Files

### **Hardhat Configuration**
```typescript
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 11155111
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 1
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  }
};

export default config;
```

### **Network Configuration**
```json
{
  "networks": {
    "mainnet": {
      "chainId": 1,
      "name": "Ethereum Mainnet",
      "rpcUrl": "${MAINNET_RPC_URL}",
      "blockExplorer": "https://etherscan.io",
      "gasPrice": "auto",
      "confirmations": 2
    },
    "sepolia": {
      "chainId": 11155111,
      "name": "Sepolia Testnet",
      "rpcUrl": "${SEPOLIA_RPC_URL}",
      "blockExplorer": "https://sepolia.etherscan.io",
      "gasPrice": "auto",
      "confirmations": 1
    },
    "polygon": {
      "chainId": 137,
      "name": "Polygon Mainnet",
      "rpcUrl": "${POLYGON_RPC_URL}",
      "blockExplorer": "https://polygonscan.com",
      "gasPrice": "auto",
      "confirmations": 2
    }
  }
}
```

### **Deployment Configuration**
```json
{
  "deployment": {
    "token": {
      "name": "Advanced ERC-20",
      "symbol": "AERC20",
      "decimals": 18,
      "initialSupply": "1000000000000000000000000",
      "maxSupply": "1000000000000000000000000"
    },
    "roles": {
      "admin": "${ADMIN_ADDRESS}",
      "governor": "${GOVERNOR_ADDRESS}",
      "minter": "${MINTER_ADDRESS}",
      "pauser": "${PAUSER_ADDRESS}",
      "compliance": "${COMPLIANCE_ADDRESS}"
    },
    "fees": {
      "transferFeeRate": 25,
      "burnPercentage": 50,
      "feeRecipient": "${TREASURY_ADDRESS}"
    },
    "governance": {
      "votingPeriod": 604800,
      "proposalThreshold": "1000000000000000000000",
      "quorumPercentage": 10
    }
  }
}
```

### **Governance Configuration**
```json
{
  "governance": {
    "voting": {
      "period": 604800,
      "delay": 86400,
      "quorum": 10,
      "threshold": "1000000000000000000000"
    },
    "timelock": {
      "minDelay": 172800,
      "maxDelay": 604800,
      "gracePeriod": 86400
    },
    "proposals": {
      "maxActive": 10,
      "executionDelay": 172800,
      "expirationPeriod": 1209600
    },
    "roles": {
      "proposer": ["GOVERNOR_ROLE"],
      "executor": ["DEFAULT_ADMIN_ROLE"],
      "canceller": ["DEFAULT_ADMIN_ROLE"]
    }
  }
}
```

### **Tokenomics Configuration**
```json
{
  "tokenomics": {
    "supply": {
      "initial": "1000000000000000000000000",
      "maximum": "1000000000000000000000000",
      "allocation": {
        "team": 15,
        "public": 20,
        "advisors": 5,
        "staking": 15,
        "governance": 10,
        "development": 5,
        "treasury": 30
      }
    },
    "fees": {
      "transfer": {
        "base": 0.25,
        "min": 0.1,
        "max": 1.0
      },
      "distribution": {
        "burn": 50,
        "treasury": 30,
        "staking": 20
      }
    },
    "vesting": {
      "team": {
        "cliff": 31536000,
        "duration": 94608000,
        "percentage": 15
      },
      "advisors": {
        "cliff": 15768000,
        "duration": 63072000,
        "percentage": 5
      }
    }
  }
}
```

## 🔐 Environment Variables

### **Required Variables**
```bash
# Network Configuration
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# Deployment
DEPLOYER_PRIVATE_KEY=your_private_key_here
ADMIN_ADDRESS=0x...
GOVERNOR_ADDRESS=0x...
TREASURY_ADDRESS=0x...

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_cmc_api_key

# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## ✅ Configuration Validation

### **Validation Script**
```typescript
// scripts/validateConfig.ts
import * as fs from 'fs';
import * as path from 'path';

interface ConfigValidation {
  valid: boolean;
  errors: string[];
}

export const validateConfig = (): ConfigValidation => {
  const errors: string[] = [];
  
  // Check required environment variables
  const requiredEnvVars = [
    'MAINNET_RPC_URL',
    'DEPLOYER_PRIVATE_KEY',
    'ADMIN_ADDRESS'
  ];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });
  
  // Validate configuration files
  const configFiles = ['networks.json', 'deployment.json', 'governance.json'];
  
  configFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', 'config', file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing configuration file: ${file}`);
    } else {
      try {
        JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (e) {
        errors.push(`Invalid JSON in ${file}: ${e.message}`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

## 🚀 Usage Examples

### **Loading Configuration**
```typescript
import * as fs from 'fs';
import * as path from 'path';

export const loadConfig = (configName: string) => {
  const configPath = path.join(__dirname, '..', 'config', `${configName}.json`);
  const configData = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(configData);
};

// Usage
const networkConfig = loadConfig('networks');
const deploymentConfig = loadConfig('deployment');
```

### **Environment-Specific Configuration**
```typescript
const environment = process.env.NODE_ENV || 'development';
const envConfig = loadConfig(`environments/${environment}`);

export const getConfig = () => {
  return {
    ...loadConfig('deployment'),
    ...envConfig
  };
};
```

---

**These configuration files provide a centralized, secure, and maintainable way to manage all platform settings across different environments.**
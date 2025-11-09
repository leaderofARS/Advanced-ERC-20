// Project configuration for Advanced ERC-20
export const config = {
  // Development settings
  development: {
    frontend: {
      port: 3000,
      url: 'http://localhost:3000'
    },
    root: {
      port: 8080,
      url: 'http://localhost:8080'
    },
    hardhat: {
      network: 'localhost',
      port: 8545
    }
  },

  // Production settings
  production: {
    frontend: {
      buildDir: 'frontend/.next',
      staticDir: 'frontend/out'
    },
    dist: {
      dir: 'dist',
      frontend: 'dist/frontend'
    }
  },

  // Smart contract settings
  contracts: {
    name: 'AdvancedERC20',
    symbol: 'AERC20',
    decimals: 18,
    initialSupply: '1000000'
  },

  // Frontend settings
  frontend: {
    title: 'Advanced ERC-20 Token',
    description: 'Advanced ERC-20 token with governance, analytics, and role management',
    theme: 'dark',
    features: [
      'governance',
      'analytics',
      'roleManagement',
      'tokenOperations'
    ]
  }
};

export default config;
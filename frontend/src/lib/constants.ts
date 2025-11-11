// Contract Configuration
export const CONTRACT_CONFIG = {
  ADDRESS: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`,
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1'),
  BLOCK_EXPLORER: process.env.NEXT_PUBLIC_BLOCK_EXPLORER || 'https://etherscan.io',
} as const;

// Network Configuration
export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  GOERLI: 5,
  SEPOLIA: 11155111,
  POLYGON: 137,
  MUMBAI: 80001,
  ARBITRUM: 42161,
  OPTIMISM: 10,
} as const;

export const CHAIN_NAMES = {
  [SUPPORTED_CHAINS.ETHEREUM]: 'Ethereum',
  [SUPPORTED_CHAINS.GOERLI]: 'Goerli',
  [SUPPORTED_CHAINS.SEPOLIA]: 'Sepolia',
  [SUPPORTED_CHAINS.POLYGON]: 'Polygon',
  [SUPPORTED_CHAINS.MUMBAI]: 'Mumbai',
  [SUPPORTED_CHAINS.ARBITRUM]: 'Arbitrum',
  [SUPPORTED_CHAINS.OPTIMISM]: 'Optimism',
} as const;

// Role Constants (must match smart contract)
export const ROLES = {
  DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
  MINTER_ROLE: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
  BURNER_ROLE: '0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848',
  PAUSER_ROLE: '0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a',
  COMPLIANCE_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000001',
  GOVERNOR_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000002',
  ANALYTICS_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000003',
} as const;

export const ROLE_NAMES = {
  [ROLES.DEFAULT_ADMIN_ROLE]: 'Admin',
  [ROLES.MINTER_ROLE]: 'Minter',
  [ROLES.BURNER_ROLE]: 'Burner',
  [ROLES.PAUSER_ROLE]: 'Pauser',
  [ROLES.COMPLIANCE_ROLE]: 'Compliance',
  [ROLES.GOVERNOR_ROLE]: 'Governor',
  [ROLES.ANALYTICS_ROLE]: 'Analytics',
} as const;

export const ROLE_DESCRIPTIONS = {
  [ROLES.DEFAULT_ADMIN_ROLE]: 'Full administrative access to all contract functions',
  [ROLES.MINTER_ROLE]: 'Can mint new tokens within supply limits',
  [ROLES.BURNER_ROLE]: 'Can burn tokens from approved accounts',
  [ROLES.PAUSER_ROLE]: 'Can pause/unpause contract in emergencies',
  [ROLES.COMPLIANCE_ROLE]: 'Can manage blacklists and compliance settings',
  [ROLES.GOVERNOR_ROLE]: 'Can execute governance proposals',
  [ROLES.ANALYTICS_ROLE]: 'Can manage analytics and reset metrics',
} as const;

// Token Configuration
export const TOKEN_CONFIG = {
  NAME: 'Advanced ERC20 Token',
  SYMBOL: 'AERC20',
  DECIMALS: 18,
  MAX_SUPPLY: '1000000', // 1M tokens
  INITIAL_SUPPLY: '200000', // 200K tokens
} as const;

// Fee Configuration
export const FEE_CONFIG = {
  BASIS_POINTS: 10000,
  MAX_FEE: 1000, // 10%
  DEFAULT_FEE: 100, // 1%
  DEFAULT_BURN_RATE: 50, // 50%
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  REFRESH_INTERVAL: 30000, // 30 seconds
  NOTIFICATION_DURATION: 5000, // 5 seconds
  MAX_RECENT_TRANSACTIONS: 10,
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_TRANSFER_AMOUNT: '0.000001',
  MAX_TRANSFER_AMOUNT: '1000000',
  ADDRESS_REGEX: /^0x[a-fA-F0-9]{40}$/,
  AMOUNT_REGEX: /^\d*\.?\d*$/,
  MAX_DECIMALS: 18,
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    SECONDARY: '#6B7280',
  },
  TIMEFRAMES: ['1h', '24h', '7d', '30d', '1y'] as const,
  DEFAULT_TIMEFRAME: '24h' as const,
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'aerc20-theme',
  WALLET_CONNECTED: 'aerc20-wallet-connected',
  USER_PREFERENCES: 'aerc20-user-preferences',
  RECENT_TRANSACTIONS: 'aerc20-recent-transactions',
  NOTIFICATIONS: 'aerc20-notifications',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  INVALID_ADDRESS: 'Invalid Ethereum address',
  INVALID_AMOUNT: 'Invalid token amount',
  INSUFFICIENT_BALANCE: 'Insufficient token balance',
  TRANSACTION_FAILED: 'Transaction failed',
  NETWORK_ERROR: 'Network error occurred',
  CONTRACT_ERROR: 'Contract interaction failed',
  UNAUTHORIZED: 'You are not authorized for this action',
  CONTRACT_PAUSED: 'Contract is currently paused',
  BLACKLISTED_ADDRESS: 'Address is blacklisted',
  TRANSFER_LIMIT_EXCEEDED: 'Transfer amount exceeds limit',
  MAX_SUPPLY_EXCEEDED: 'Would exceed maximum token supply',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_SUBMITTED: 'Transaction submitted successfully',
  TRANSACTION_CONFIRMED: 'Transaction confirmed',
  TOKENS_TRANSFERRED: 'Tokens transferred successfully',
  TOKENS_MINTED: 'Tokens minted successfully',
  TOKENS_BURNED: 'Tokens burned successfully',
  CONTRACT_PAUSED: 'Contract paused successfully',
  CONTRACT_UNPAUSED: 'Contract unpaused successfully',
  ROLE_GRANTED: 'Role granted successfully',
  ROLE_REVOKED: 'Role revoked successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;

// Feature Flags
export const FEATURES = {
  GOVERNANCE: true,
  ANALYTICS: true,
  ROLE_MANAGEMENT: true,
  COMPLIANCE: true,
  BURN_MECHANISM: true,
  FEE_MECHANISM: true,
  PAUSE_MECHANISM: true,
  UPGRADE_MECHANISM: true,
} as const;

// Social Links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/advancederc20',
  DISCORD: 'https://discord.gg/advancederc20',
  GITHUB: 'https://github.com/advancederc20/token',
  DOCS: 'https://docs.advancederc20.com',
  BLOG: 'https://blog.advancederc20.com',
} as const;

// External Links
export const EXTERNAL_LINKS = {
  ETHERSCAN: 'https://etherscan.io',
  COINGECKO: 'https://coingecko.com',
  COINMARKETCAP: 'https://coinmarketcap.com',
  UNISWAP: 'https://app.uniswap.org',
  OPENSEA: 'https://opensea.io',
} as const;

// Analytics Events
export const ANALYTICS_EVENTS = {
  WALLET_CONNECTED: 'wallet_connected',
  WALLET_DISCONNECTED: 'wallet_disconnected',
  TOKEN_TRANSFER: 'token_transfer',
  TOKEN_MINT: 'token_mint',
  TOKEN_BURN: 'token_burn',
  ROLE_GRANTED: 'role_granted',
  ROLE_REVOKED: 'role_revoked',
  CONTRACT_PAUSED: 'contract_paused',
  CONTRACT_UNPAUSED: 'contract_unpaused',
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
} as const;

// Default Values
export const DEFAULTS = {
  TRANSFER_AMOUNT: '',
  MINT_AMOUNT: '',
  BURN_AMOUNT: '',
  RECIPIENT_ADDRESS: '',
  SLIPPAGE_TOLERANCE: 0.5, // 0.5%
  GAS_LIMIT_MULTIPLIER: 1.2, // 20% buffer
  POLLING_INTERVAL: 12000, // 12 seconds (Ethereum block time)
} as const;
// Contract Types
export interface TokenContract {
  address: `0x${string}`;
  abi: readonly unknown[];
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  maxSupply: bigint;
}

export interface UserBalance {
  balance: bigint;
  formattedBalance: string;
}

// Analytics Types
export interface AnalyticsData {
  totalTransfers: number;
  totalVolume: string;
  uniqueUsers: number;
  burnedTokens: string;
  treasuryBalance: string;
  averageFee: string;
}

export interface TransferEvent {
  from: string;
  to: string;
  amount: bigint;
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
}

export interface ChartDataPoint {
  timestamp: number;
  volume: number;
  transfers: number;
  price: number;
}

// Governance Types
export interface Proposal {
  id: number;
  proposer: string;
  description: string;
  votesFor: bigint;
  votesAgainst: bigint;
  startTime: number;
  endTime: number;
  executed: boolean;
}

export interface VoteData {
  proposalId: number;
  voter: string;
  support: boolean;
  weight: bigint;
  timestamp: number;
}

// Role Management Types
export type Role = 
  | 'DEFAULT_ADMIN_ROLE'
  | 'MINTER_ROLE'
  | 'BURNER_ROLE'
  | 'PAUSER_ROLE'
  | 'COMPLIANCE_ROLE'
  | 'GOVERNOR_ROLE'
  | 'ANALYTICS_ROLE';

export interface RoleData {
  role: Role;
  members: string[];
  adminRole: Role;
}

export interface UserRoles {
  address: string;
  roles: Role[];
}

// Transaction Types
export interface TransactionStatus {
  hash?: string;
  status: 'idle' | 'pending' | 'success' | 'error';
  error?: string;
}

export interface TransferFormData {
  to: string;
  amount: string;
}

export interface MintFormData {
  to: string;
  amount: string;
}

// UI Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Configuration Types
export interface AppConfig {
  contractAddress: `0x${string}`;
  chainId: number;
  rpcUrl: string;
  blockExplorer: string;
  apiBaseUrl: string;
}

// Error Types
export interface ContractError {
  code: string;
  message: string;
  data?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Utility Types
export type Address = `0x${string}`;
export type Hash = `0x${string}`;
export type Hex = `0x${string}`;

export type TimeFrame = '1h' | '24h' | '7d' | '30d' | '1y';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface FilterConfig {
  field: string;
  value: unknown;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
}
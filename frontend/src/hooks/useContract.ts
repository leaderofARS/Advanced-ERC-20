import { useContractRead, useContractWrite } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useState, useEffect } from 'react';
import type { TokenInfo, UserBalance, TransactionStatus } from '@/types';

// Advanced ERC-20 Contract ABI (partial)
const ADVANCED_ERC20_ABI = [
  // Standard ERC-20 functions
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'amount' }
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'address', name: 'spender' },
      { type: 'uint256', name: 'amount' }
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { type: 'address', name: 'owner' },
      { type: 'address', name: 'spender' }
    ],
    outputs: [{ type: 'uint256' }],
  },
  // Advanced functions
  {
    name: 'maxSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'amount' }
    ],
    outputs: [],
  },
  {
    name: 'burn',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'uint256', name: 'amount' }],
    outputs: [],
  },
  {
    name: 'pause',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'unpause',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'paused',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'transferFee',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'treasury',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
  {
    name: 'burnRate',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'hasRole',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { type: 'bytes32', name: 'role' },
      { type: 'address', name: 'account' }
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'grantRole',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'bytes32', name: 'role' },
      { type: 'address', name: 'account' }
    ],
    outputs: [],
  },
  {
    name: 'revokeRole',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'bytes32', name: 'role' },
      { type: 'address', name: 'account' }
    ],
    outputs: [],
  },
  // Events
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { type: 'address', name: 'from', indexed: true },
      { type: 'address', name: 'to', indexed: true },
      { type: 'uint256', name: 'value', indexed: false }
    ],
  },
  {
    name: 'Approval',
    type: 'event',
    inputs: [
      { type: 'address', name: 'owner', indexed: true },
      { type: 'address', name: 'spender', indexed: true },
      { type: 'uint256', name: 'value', indexed: false }
    ],
  },
] as const;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;

export function useTokenInfo(): TokenInfo | undefined {
  const { data: name } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'name',
    enabled: !!CONTRACT_ADDRESS,
  });

  const { data: symbol } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'symbol',
    enabled: !!CONTRACT_ADDRESS,
  });

  const { data: decimals } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'decimals',
    enabled: !!CONTRACT_ADDRESS,
  });

  const { data: totalSupply } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'totalSupply',
    enabled: !!CONTRACT_ADDRESS,
  });

  const { data: maxSupply } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'maxSupply',
    enabled: !!CONTRACT_ADDRESS,
  });

  if (!name || !symbol || decimals === undefined || !totalSupply || !maxSupply) {
    return undefined;
  }

  return {
    name,
    symbol,
    decimals,
    totalSupply,
    maxSupply,
  };
}

export function useUserBalance(address?: `0x${string}`): UserBalance | undefined {
  const { data: balance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!CONTRACT_ADDRESS && !!address,
  });

  if (!balance) return undefined;

  return {
    balance,
    formattedBalance: formatEther(balance),
  };
}

export function useTransfer() {
  const [status, setStatus] = useState<TransactionStatus>({ status: 'idle' });

  const { write, data, isLoading, isSuccess, isError, error } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'transfer',
    onSuccess: (data) => {
      setStatus({ status: 'success', hash: data.hash });
    },
    onError: (error) => {
      setStatus({ status: 'error', error: error.message });
    },
  });

  const transfer = (to: string, amount: string) => {
    try {
      setStatus({ status: 'pending' });
      write({
        args: [to as `0x${string}`, parseEther(amount)],
      });
    } catch (err) {
      setStatus({ 
        status: 'error', 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      setStatus({ status: 'pending', hash: data?.hash });
    }
  }, [isLoading, data?.hash]);

  return {
    transfer,
    status,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  };
}

export function useMint() {
  const [status, setStatus] = useState<TransactionStatus>({ status: 'idle' });

  const { write, data, isLoading, isSuccess, isError, error } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'mint',
    onSuccess: (data) => {
      setStatus({ status: 'success', hash: data.hash });
    },
    onError: (error) => {
      setStatus({ status: 'error', error: error.message });
    },
  });

  const mint = (to: string, amount: string) => {
    try {
      setStatus({ status: 'pending' });
      write({
        args: [to as `0x${string}`, parseEther(amount)],
      });
    } catch (err) {
      setStatus({ 
        status: 'error', 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  };

  return {
    mint,
    status,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  };
}

export function useBurn() {
  const [status, setStatus] = useState<TransactionStatus>({ status: 'idle' });

  const { write, data, isLoading, isSuccess, isError, error } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'burn',
    onSuccess: (data) => {
      setStatus({ status: 'success', hash: data.hash });
    },
    onError: (error) => {
      setStatus({ status: 'error', error: error.message });
    },
  });

  const burn = (amount: string) => {
    try {
      setStatus({ status: 'pending' });
      write({
        args: [parseEther(amount)],
      });
    } catch (err) {
      setStatus({ 
        status: 'error', 
        error: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  };

  return {
    burn,
    status,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  };
}

export function usePauseContract() {
  const [status, setStatus] = useState<TransactionStatus>({ status: 'idle' });

  const { data: isPaused } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'paused',
    enabled: !!CONTRACT_ADDRESS,
  });

  const { write: pauseWrite } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'pause',
    onSuccess: (data) => {
      setStatus({ status: 'success', hash: data.hash });
    },
    onError: (error) => {
      setStatus({ status: 'error', error: error.message });
    },
  });

  const { write: unpauseWrite } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'unpause',
    onSuccess: (data) => {
      setStatus({ status: 'success', hash: data.hash });
    },
    onError: (error) => {
      setStatus({ status: 'error', error: error.message });
    },
  });

  const pause = () => {
    setStatus({ status: 'pending' });
    pauseWrite?.();
  };

  const unpause = () => {
    setStatus({ status: 'pending' });
    unpauseWrite?.();
  };

  return {
    isPaused,
    pause,
    unpause,
    status,
  };
}

export function useRoleManagement() {
  const [status, setStatus] = useState<TransactionStatus>({ status: 'idle' });

  // Role constants (these should match the contract)
  const ROLES = {
    DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
    MINTER_ROLE: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
    BURNER_ROLE: '0x3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848',
    PAUSER_ROLE: '0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a',
    COMPLIANCE_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000001',
    GOVERNOR_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000002',
    ANALYTICS_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000003',
  };

  const checkRole = (role: keyof typeof ROLES, account: string) => {
    return useContractRead({
      address: CONTRACT_ADDRESS,
      abi: ADVANCED_ERC20_ABI,
      functionName: 'hasRole',
      args: [ROLES[role] as `0x${string}`, account as `0x${string}`],
      enabled: !!CONTRACT_ADDRESS && !!account,
    });
  };

  const { write: grantWrite } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'grantRole',
    onSuccess: (data) => {
      setStatus({ status: 'success', hash: data.hash });
    },
    onError: (error) => {
      setStatus({ status: 'error', error: error.message });
    },
  });

  const { write: revokeWrite } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ADVANCED_ERC20_ABI,
    functionName: 'revokeRole',
    onSuccess: (data) => {
      setStatus({ status: 'success', hash: data.hash });
    },
    onError: (error) => {
      setStatus({ status: 'error', error: error.message });
    },
  });

  const grantRole = (role: keyof typeof ROLES, account: string) => {
    setStatus({ status: 'pending' });
    grantWrite({
      args: [ROLES[role] as `0x${string}`, account as `0x${string}`],
    });
  };

  const revokeRole = (role: keyof typeof ROLES, account: string) => {
    setStatus({ status: 'pending' });
    revokeWrite({
      args: [ROLES[role] as `0x${string}`, account as `0x${string}`],
    });
  };

  return {
    ROLES,
    checkRole,
    grantRole,
    revokeRole,
    status,
  };
}
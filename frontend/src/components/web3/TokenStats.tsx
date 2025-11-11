'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAccount, useReadContract } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { formatEther } from 'viem';

// Mock contract ABI - replace with actual ABI
const tokenABI = [
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
] as const;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;

export function TokenStats() {
  const { address, isConnected } = useAccount();

  // Contract reads
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!CONTRACT_ADDRESS,
    },
  });

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!CONTRACT_ADDRESS && !!address,
    },
  });

  const { data: tokenName } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenABI,
    functionName: 'name',
    query: {
      enabled: !!CONTRACT_ADDRESS,
    },
  });

  const { data: tokenSymbol } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: tokenABI,
    functionName: 'symbol',
    query: {
      enabled: !!CONTRACT_ADDRESS,
    },
  });

  if (!isConnected) {
    return (
      <Card className="p-6 text-center">
        <p className="text-secondary-400">Connect your wallet to view token statistics</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Token Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-secondary-400">Token Name</p>
            <p className="text-white font-medium">{tokenName || 'Advanced ERC20 Token'}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-400">Symbol</p>
            <p className="text-white font-medium">{tokenSymbol || 'AERC20'}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-400">Total Supply</p>
            <p className="text-white font-medium">
              {totalSupply ? formatEther(totalSupply) : '1,000,000'} {tokenSymbol || 'AERC20'}
            </p>
          </div>
          <div>
            <p className="text-sm text-secondary-400">Your Balance</p>
            <p className="text-white font-medium">
              {balance ? formatEther(balance) : '0'} {tokenSymbol || 'AERC20'}
            </p>
          </div>
        </div>
      </Card>

      {/* Live Chart Placeholder */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Price Chart</h3>
        <div className="h-64 bg-secondary-800/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-secondary-400">Live price chart coming soon</p>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Transfer</p>
                  <p className="text-secondary-400 text-xs">2 minutes ago</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium">+1,000 AERC20</p>
                <p className="text-secondary-400 text-xs">$2,500</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
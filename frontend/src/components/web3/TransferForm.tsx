'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const tokenABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;

export function TransferForm() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { address, isConnected } = useAccount();

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isSuccess) {
      toast.success('Transfer completed successfully!');
      setRecipient('');
      setAmount('');
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!recipient || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: tokenABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parseEther(amount)],
      });
    } catch (error: any) {
      toast.error('Transfer failed: ' + error.message);
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-6 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-warning-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Wallet Not Connected</h3>
        <p className="text-secondary-400">Please connect your wallet to transfer tokens</p>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary-500/20 rounded-lg">
            <PaperAirplaneIcon className="h-6 w-6 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Transfer Tokens</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-secondary-300 mb-2">
              Amount (AERC20)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.000001"
              min="0"
              className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Fee Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-3"
          >
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-primary-300 font-medium mb-1">Transfer Fee: 1%</p>
                <p className="text-primary-400/80">
                  50% burned, 50% to treasury. Estimated fee: {amount ? (parseFloat(amount) * 0.01).toFixed(6) : '0'} AERC20
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={isPending || isConfirming}
            disabled={!recipient || !amount || isPending || isConfirming}
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Send Tokens'}
          </Button>
        </form>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-secondary-700">
          <p className="text-sm text-secondary-400 mb-3">Quick Actions</p>
          <div className="grid grid-cols-3 gap-2">
            {['25%', '50%', '100%'].map((percentage) => (
              <Button
                key={percentage}
                variant="ghost"
                size="sm"
                onClick={() => {
                  // This would calculate based on actual balance
                  const mockBalance = 1000;
                  const value = (mockBalance * parseInt(percentage) / 100).toString();
                  setAmount(value);
                }}
              >
                {percentage}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
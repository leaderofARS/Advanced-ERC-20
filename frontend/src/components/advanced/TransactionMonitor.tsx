'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRealTimeTransactions } from '@/hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  type: 'TRANSFER' | 'MINT' | 'BURN' | 'APPROVE';
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  timestamp: string;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
}

export function TransactionMonitor() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'TRANSFER' | 'MINT' | 'BURN'>('ALL');
  const [isLive, setIsLive] = useState(true);
  const realtimeTransactions = useRealTimeTransactions();

  useEffect(() => {
    // Load initial transactions
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Add new real-time transactions
    if (realtimeTransactions.length > 0 && isLive) {
      setTransactions(prev => {
        const newTxs = realtimeTransactions.filter(
          tx => !prev.some(existing => existing.hash === tx.hash)
        );
        return [...newTxs, ...prev].slice(0, 100); // Keep last 100
      });
    }
  }, [realtimeTransactions, isLive]);

  const fetchTransactions = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          hash: '0x1234567890abcdef1234567890abcdef12345678',
          from: '0x742d35Cc6634C0532925a3b8D4C9db96C4C4C4C4',
          to: '0x8ba1f109551bD432803012645Hac136c22C4C4C4',
          amount: '1000.50',
          type: 'TRANSFER',
          status: 'CONFIRMED',
          timestamp: new Date().toISOString(),
          gasUsed: '21000',
          gasPrice: '20',
          blockNumber: 18500000
        },
        {
          id: '2',
          hash: '0xabcdef1234567890abcdef1234567890abcdef12',
          from: '0x0000000000000000000000000000000000000000',
          to: '0x742d35Cc6634C0532925a3b8D4C9db96C4C4C4C4',
          amount: '5000.00',
          type: 'MINT',
          status: 'CONFIRMED',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          gasUsed: '45000',
          gasPrice: '25',
          blockNumber: 18499999
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    filter === 'ALL' || tx.type === filter
  );

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'PENDING') return ClockIcon;
    if (status === 'FAILED') return ExclamationTriangleIcon;
    
    switch (type) {
      case 'TRANSFER': return ArrowRightIcon;
      case 'MINT': return ArrowUpIcon;
      case 'BURN': return FireIcon;
      default: return CheckCircleIcon;
    }
  };

  const getTransactionColor = (type: string, status: string) => {
    if (status === 'PENDING') return 'text-warning-400 bg-warning-500/20';
    if (status === 'FAILED') return 'text-error-400 bg-error-500/20';
    
    switch (type) {
      case 'TRANSFER': return 'text-primary-400 bg-primary-500/20';
      case 'MINT': return 'text-success-400 bg-success-500/20';
      case 'BURN': return 'text-error-400 bg-error-500/20';
      default: return 'text-secondary-400 bg-secondary-500/20';
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(2);
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold text-white">Live Transactions</h3>
          <motion.div
            animate={{ scale: isLive ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${isLive ? 'bg-success-500' : 'bg-secondary-500'}`}
          />
          <span className="text-sm text-secondary-400">
            {isLive ? 'Live' : 'Paused'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={isLive ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTransactions}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'TRANSFER', 'MINT', 'BURN'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filter === type
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-800 text-secondary-400 hover:text-white hover:bg-secondary-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredTransactions.map((tx, index) => {
            const Icon = getTransactionIcon(tx.type, tx.status);
            const colorClass = getTransactionColor(tx.type, tx.status);
            
            return (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-secondary-800/50 rounded-lg hover:bg-secondary-800/70 transition-colors group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{tx.type}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tx.status === 'CONFIRMED' ? 'bg-success-500/20 text-success-400' :
                        tx.status === 'PENDING' ? 'bg-warning-500/20 text-warning-400' :
                        'bg-error-500/20 text-error-400'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-secondary-400">
                      <span>{truncateAddress(tx.from)}</span>
                      <ArrowRightIcon className="w-3 h-3" />
                      <span>{truncateAddress(tx.to)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-medium">
                    {formatAmount(tx.amount)} AERC20
                  </div>
                  <div className="text-sm text-secondary-400">
                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                  </div>
                </div>

                {/* Hover details */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                  >
                    View
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-secondary-400" />
            </div>
            <p className="text-secondary-400">No transactions found</p>
            <p className="text-sm text-secondary-500 mt-1">
              {filter === 'ALL' ? 'Waiting for new transactions...' : `No ${filter.toLowerCase()} transactions`}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-secondary-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-white">
              {transactions.filter(tx => tx.status === 'CONFIRMED').length}
            </div>
            <div className="text-sm text-secondary-400">Confirmed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning-400">
              {transactions.filter(tx => tx.status === 'PENDING').length}
            </div>
            <div className="text-sm text-secondary-400">Pending</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error-400">
              {transactions.filter(tx => tx.status === 'FAILED').length}
            </div>
            <div className="text-sm text-secondary-400">Failed</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  UsersIcon,
  CurrencyDollarIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Chart, MetricCard } from '@/components/ui/Chart';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface MetricData {
  totalSupply: string;
  holders: number;
  volume24h: string;
  transactions24h: number;
  burnedTokens: string;
  marketCap: string;
  price: string;
  priceChange24h: number;
}

interface ChartData {
  timestamp: number;
  price: number;
  volume: number;
  transactions: number;
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate WebSocket connection for real-time data
    const connectWebSocket = () => {
      setIsConnected(true);
      setIsLoading(false);
      
      // Mock real-time data updates
      const interval = setInterval(() => {
        updateMetrics();
        updateChartData();
      }, 5000);

      return () => {
        clearInterval(interval);
        setIsConnected(false);
      };
    };

    const cleanup = connectWebSocket();
    
    // Initial data load
    updateMetrics();
    updateChartData();

    return cleanup;
  }, [timeframe]);

  const updateMetrics = () => {
    // Mock data - replace with actual API calls
    const mockMetrics: MetricData = {
      totalSupply: (1000000 + Math.random() * 1000).toFixed(0),
      holders: Math.floor(5000 + Math.random() * 100),
      volume24h: (50000 + Math.random() * 10000).toFixed(2),
      transactions24h: Math.floor(1200 + Math.random() * 100),
      burnedTokens: (15000 + Math.random() * 100).toFixed(2),
      marketCap: (2500000 + Math.random() * 100000).toFixed(2),
      price: (2.45 + (Math.random() - 0.5) * 0.1).toFixed(4),
      priceChange24h: (Math.random() - 0.5) * 20
    };
    
    setMetrics(mockMetrics);
  };

  const updateChartData = () => {
    // Generate mock chart data based on timeframe
    const dataPoints = timeframe === '1h' ? 60 : timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
    const now = Date.now();
    const interval = timeframe === '1h' ? 60000 : timeframe === '24h' ? 3600000 : timeframe === '7d' ? 86400000 : 86400000;
    
    const newChartData: ChartData[] = [];
    for (let i = dataPoints - 1; i >= 0; i--) {
      newChartData.push({
        timestamp: now - (i * interval),
        price: 2.45 + (Math.random() - 0.5) * 0.5,
        volume: 1000 + Math.random() * 5000,
        transactions: Math.floor(10 + Math.random() * 50)
      });
    }
    
    setChartData(newChartData);
  };

  const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const formatCurrency = (amount: string) => {
    return `$${formatNumber(amount)}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Real-Time Metrics</h2>
          <LoadingSpinner size="sm" text="Connecting..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-secondary-900/50 border border-secondary-700/50 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-secondary-800 rounded mb-2"></div>
              <div className="h-8 bg-secondary-800 rounded mb-2"></div>
              <div className="h-3 bg-secondary-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Real-Time Metrics</h2>
          <motion.div
            animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success-500' : 'bg-error-500'}`}
          />
          <span className="text-sm text-secondary-400">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex bg-secondary-800 rounded-lg p-1">
          {(['1h', '24h', '7d', '30d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeframe === period
                  ? 'bg-primary-500 text-white'
                  : 'text-secondary-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <AnimatePresence mode="wait">
        {metrics && (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <MetricCard
              title="Token Price"
              value={`$${metrics.price}`}
              change={`${metrics.priceChange24h >= 0 ? '+' : ''}${metrics.priceChange24h.toFixed(2)}%`}
              changeType={metrics.priceChange24h >= 0 ? 'positive' : 'negative'}
              icon={CurrencyDollarIcon}
              color="primary"
            />
            
            <MetricCard
              title="Market Cap"
              value={formatCurrency(metrics.marketCap)}
              change="+5.2% vs yesterday"
              changeType="positive"
              icon={ChartBarIcon}
              color="success"
            />
            
            <MetricCard
              title="24h Volume"
              value={formatCurrency(metrics.volume24h)}
              change="+12.8% vs yesterday"
              changeType="positive"
              icon={ArrowTrendingUpIcon}
              color="primary"
            />
            
            <MetricCard
              title="Holders"
              value={formatNumber(metrics.holders)}
              change="+23 new holders"
              changeType="positive"
              icon={UsersIcon}
              color="success"
            />
            
            <MetricCard
              title="Total Supply"
              value={formatNumber(metrics.totalSupply)}
              change="Fixed supply"
              changeType="neutral"
              icon={CurrencyDollarIcon}
              color="primary"
            />
            
            <MetricCard
              title="Burned Tokens"
              value={formatNumber(metrics.burnedTokens)}
              change="+0.5% burned"
              changeType="positive"
              icon={FireIcon}
              color="error"
            />
            
            <MetricCard
              title="24h Transactions"
              value={metrics.transactions24h.toLocaleString()}
              change="+8.3% vs yesterday"
              changeType="positive"
              icon={ArrowTrendingUpIcon}
              color="success"
            />
            
            <MetricCard
              title="Avg Block Time"
              value="12.5s"
              change="Stable"
              changeType="neutral"
              icon={ClockIcon}
              color="primary"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Price History</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-secondary-400">Price ($)</span>
            </div>
          </div>
          <Chart
            data={chartData.map(d => ({
              time: new Date(d.timestamp).toLocaleTimeString(),
              price: d.price
            }))}
            type="area"
            dataKey="price"
            xAxisKey="time"
            color="#3B82F6"
            height={250}
          />
        </Card>

        {/* Volume Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Trading Volume</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span className="text-sm text-secondary-400">Volume</span>
            </div>
          </div>
          <Chart
            data={chartData.map(d => ({
              time: new Date(d.timestamp).toLocaleTimeString(),
              volume: d.volume
            }))}
            type="bar"
            dataKey="volume"
            xAxisKey="time"
            color="#10B981"
            height={250}
          />
        </Card>
      </div>

      {/* Transaction Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction Activity</h3>
        <Chart
          data={chartData.map(d => ({
            time: new Date(d.timestamp).toLocaleTimeString(),
            transactions: d.transactions
          }))}
          type="line"
          dataKey="transactions"
          xAxisKey="time"
          color="#F59E0B"
          height={200}
        />
      </Card>
    </div>
  );
}
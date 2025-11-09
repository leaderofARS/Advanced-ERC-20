'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TokenStats } from '@/components/web3/TokenStats';
import { TransferForm } from '@/components/web3/TransferForm';
import { RoleManager } from '@/components/web3/RoleManager';

const tabs = [
  { id: 'overview', name: 'Overview', icon: ChartBarIcon },
  { id: 'transfer', name: 'Transfer', icon: CurrencyDollarIcon },
  { id: 'roles', name: 'Roles', icon: UserGroupIcon },
  { id: 'settings', name: 'Settings', icon: CogIcon },
];

const mockStats = [
  {
    title: 'Total Supply',
    value: '1,000,000',
    change: '+2.5%',
    trend: 'up',
    icon: BanknotesIcon,
    color: 'text-primary-400'
  },
  {
    title: 'Circulating Supply',
    value: '750,000',
    change: '-1.2%',
    trend: 'down',
    icon: ArrowTrendingDownIcon,
    color: 'text-success-400'
  },
  {
    title: 'Burned Tokens',
    value: '50,000',
    change: '+15.3%',
    trend: 'up',
    icon: FireIcon,
    color: 'text-error-400'
  },
  {
    title: 'Market Cap',
    value: '$2.5M',
    change: '+8.7%',
    trend: 'up',
    icon: ArrowTrendingUpIcon,
    color: 'text-warning-400'
  }
];

export function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <section id="dashboard" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">Token Dashboard</span>
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Comprehensive token management interface with real-time data and advanced controls.
          </p>
        </motion.div>

        {/* Dashboard Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card variant="glass" className="overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-white/10">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-400'
                        : 'border-transparent text-secondary-400 hover:text-secondary-300'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {mockStats.map((stat, index) => (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-secondary-400 mb-1">{stat.title}</p>
                              <p className="text-2xl font-bold text-white">{stat.value}</p>
                              <div className={`flex items-center text-sm ${
                                stat.trend === 'up' ? 'text-success-400' : 'text-error-400'
                              }`}>
                                {stat.trend === 'up' ? (
                                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                ) : (
                                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                                )}
                                {stat.change}
                              </div>
                            </div>
                            <div className={`p-3 rounded-lg bg-secondary-800/50`}>
                              <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <TokenStats />
                </motion.div>
              )}

              {activeTab === 'transfer' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TransferForm />
                </motion.div>
              )}

              {activeTab === 'roles' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RoleManager />
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <CogIcon className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Settings Panel</h3>
                  <p className="text-secondary-400 mb-6">
                    Configure token parameters, fee rates, and system settings.
                  </p>
                  <Button>Coming Soon</Button>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface Proposal {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endTime: string;
  proposer: string;
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: 'Increase Transfer Fee to 2%',
    description: 'Proposal to increase the transfer fee from 1% to 2% to enhance treasury funding and deflationary pressure.',
    status: 'active',
    votesFor: 125000,
    votesAgainst: 75000,
    totalVotes: 200000,
    endTime: '2024-01-15',
    proposer: '0x1234...5678'
  },
  {
    id: 2,
    title: 'Add New Compliance Features',
    description: 'Implement additional KYC requirements and enhanced compliance monitoring for institutional adoption.',
    status: 'passed',
    votesFor: 180000,
    votesAgainst: 45000,
    totalVotes: 225000,
    endTime: '2024-01-10',
    proposer: '0xabcd...efgh'
  },
  {
    id: 3,
    title: 'Reduce Burn Rate to 25%',
    description: 'Lower the burn rate from 50% to 25% to increase treasury allocation for development funding.',
    status: 'failed',
    votesFor: 80000,
    votesAgainst: 150000,
    totalVotes: 230000,
    endTime: '2024-01-05',
    proposer: '0x9876...5432'
  }
];

export function Governance() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'create'>('proposals');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-primary-400 bg-primary-500/20';
      case 'passed': return 'text-success-400 bg-success-500/20';
      case 'failed': return 'text-error-400 bg-error-500/20';
      case 'pending': return 'text-warning-400 bg-warning-500/20';
      default: return 'text-secondary-400 bg-secondary-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return ClockIcon;
      case 'passed': return CheckCircleIcon;
      case 'failed': return XCircleIcon;
      case 'pending': return ClockIcon;
      default: return DocumentTextIcon;
    }
  };

  return (
    <section id="governance" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">Decentralized Governance</span>
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Community-driven decision making with token-weighted voting and transparent proposal execution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-white/10">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'proposals'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-secondary-400 hover:text-secondary-300'
                  }`}
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  <span>Proposals</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'create'
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-secondary-400 hover:text-secondary-300'
                  }`}
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Create Proposal</span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'proposals' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {mockProposals.map((proposal, index) => {
                    const StatusIcon = getStatusIcon(proposal.status);
                    const votePercentage = (proposal.votesFor / proposal.totalVotes) * 100;
                    
                    return (
                      <motion.div
                        key={proposal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="p-6 hover:border-primary-500/50 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  #{proposal.id} {proposal.title}
                                </h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-secondary-400 text-sm mb-3">
                                {proposal.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-secondary-500">
                                <span>Proposed by {proposal.proposer}</span>
                                <span>•</span>
                                <span>Ends {proposal.endTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Voting Progress */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-secondary-300">Voting Progress</span>
                              <span className="text-white font-medium">
                                {proposal.totalVotes.toLocaleString()} votes
                              </span>
                            </div>
                            
                            <div className="relative">
                              <div className="w-full bg-secondary-800 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-success-500 to-success-400 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${votePercentage}%` }}
                                />
                              </div>
                              <div className="flex justify-between mt-2 text-xs">
                                <span className="text-success-400">
                                  For: {proposal.votesFor.toLocaleString()} ({votePercentage.toFixed(1)}%)
                                </span>
                                <span className="text-error-400">
                                  Against: {proposal.votesAgainst.toLocaleString()} ({(100 - votePercentage).toFixed(1)}%)
                                </span>
                              </div>
                            </div>

                            {proposal.status === 'active' && (
                              <div className="flex space-x-3 pt-3">
                                <Button size="sm" className="flex-1">
                                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                                  Vote For
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1">
                                  <XCircleIcon className="h-4 w-4 mr-2" />
                                  Vote Against
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'create' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-2xl mx-auto"
                >
                  <Card className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-primary-500/20 rounded-lg">
                        <PlusIcon className="h-6 w-6 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Create New Proposal</h3>
                    </div>

                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          Proposal Title
                        </label>
                        <input
                          type="text"
                          placeholder="Enter proposal title..."
                          className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Describe your proposal in detail..."
                          className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-secondary-300 mb-2">
                          Voting Duration
                        </label>
                        <select className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30">30 days</option>
                        </select>
                      </div>

                      <div className="bg-warning-500/10 border border-warning-500/20 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <UserGroupIcon className="h-5 w-5 text-warning-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-warning-300 font-medium mb-1">Proposal Requirements</p>
                            <p className="text-warning-400/80">
                              You need at least 1,000 AERC20 tokens to create a proposal. 
                              Current balance: 2,500 AERC20
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">
                        Create Proposal
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
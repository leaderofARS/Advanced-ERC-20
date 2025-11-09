'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  LockClosedIcon,
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Role-Based Access Control',
    description: 'Seven distinct roles with hierarchical permissions: Admin, Minter, Burner, Pauser, Compliance, Governor, and Analytics.',
    color: 'text-success-400',
    bgColor: 'bg-success-500/20'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Advanced Fee Mechanism',
    description: 'Configurable transfer fees with treasury allocation and token burning for deflationary economics.',
    color: 'text-warning-400',
    bgColor: 'bg-warning-500/20'
  },
  {
    icon: ChartBarIcon,
    title: 'Real-time Analytics',
    description: 'Comprehensive event tracking, user activity monitoring, and supply metrics with dashboard visualization.',
    color: 'text-primary-400',
    bgColor: 'bg-primary-500/20'
  },
  {
    icon: UserGroupIcon,
    title: 'On-chain Governance',
    description: 'Token-weighted voting system with proposal creation, execution, and configurable voting periods.',
    color: 'text-accent-400',
    bgColor: 'bg-accent-500/20'
  },
  {
    icon: LockClosedIcon,
    title: 'Compliance Layer',
    description: 'Address blacklisting, transfer limits, and regulatory compliance features for enterprise adoption.',
    color: 'text-error-400',
    bgColor: 'bg-error-500/20'
  },
  {
    icon: ArrowPathIcon,
    title: 'Upgradeable Architecture',
    description: 'UUPS proxy pattern for safe contract upgrades with admin controls and timelock mechanisms.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20'
  },
  {
    icon: CogIcon,
    title: 'Pausable Operations',
    description: 'Emergency pause functionality to halt all token operations during security incidents or maintenance.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  },
  {
    icon: DocumentTextIcon,
    title: 'Comprehensive Documentation',
    description: 'Complete technical documentation, API references, and integration guides for developers.',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="gradient-text">Enterprise-Grade Features</span>
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Built for modern DeFi applications with security, scalability, and compliance at its core.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full group hover:glow-blue">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-secondary-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card variant="gradient" className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">99.9%</div>
                <div className="text-secondary-300">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-400 mb-2">7</div>
                <div className="text-secondary-300">Security Roles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-400 mb-2">∞</div>
                <div className="text-secondary-300">Scalability</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
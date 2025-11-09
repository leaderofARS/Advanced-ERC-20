'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  CogIcon, 
  LightBulbIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise Security',
    description: 'Role-based access control with multi-signature support'
  },
  {
    icon: ChartBarIcon,
    title: 'Real-time Analytics',
    description: 'Comprehensive tracking and monitoring dashboard'
  },
  {
    icon: CogIcon,
    title: 'Advanced Features',
    description: 'Fee mechanisms, compliance, and governance built-in'
  },
  {
    icon: LightBulbIcon,
    title: 'Smart Automation',
    description: 'Automated processes with configurable parameters'
  }
];

export function Hero() {
  return (
    <section className="relative pt-12 pb-16 overflow-hidden min-h-screen flex items-center">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Advanced ERC-20</span>
              <br />
              <span className="text-white">Token Platform</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-secondary-300 mb-8 max-w-3xl mx-auto">
              Next-generation token infrastructure with enterprise-grade features, 
              governance, compliance, and real-time analytics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button size="lg" className="group">
              Launch Dashboard
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="group">
              <PlayIcon className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-6 text-center group hover:glow-blue transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500/20 mb-4 group-hover:bg-primary-500/30 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary-400" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-secondary-400 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-accent-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-success-500/10 rounded-full blur-xl animate-pulse delay-2000" />
    </section>
  );
}
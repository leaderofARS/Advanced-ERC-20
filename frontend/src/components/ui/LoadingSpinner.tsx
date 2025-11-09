'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-400',
    white: 'border-white'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`
          ${sizes[size]} 
          border-2 
          ${colors[color]} 
          border-t-transparent 
          rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm text-secondary-400"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function SkeletonLoader({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children || <div className="bg-secondary-800 rounded h-4 w-full" />}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-secondary-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" text="Loading..." />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <p className="text-white font-semibold">Advanced ERC-20</p>
          <p className="text-secondary-400 text-sm">Initializing platform...</p>
        </motion.div>
      </div>
    </div>
  );
}
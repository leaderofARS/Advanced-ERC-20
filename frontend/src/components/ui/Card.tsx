'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neon' | 'gradient';
  hover?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const baseClasses = 'rounded-xl border transition-all duration-300';
    
    const variants = {
      default: 'bg-secondary-900/50 border-secondary-700/50 backdrop-blur-sm',
      glass: 'glass border-white/20',
      neon: 'bg-secondary-900/30 border-primary-500/50 shadow-lg shadow-primary-500/20',
      gradient: 'bg-gradient-to-br from-secondary-900/80 to-secondary-800/80 border-secondary-600/50',
    };

    const hoverClasses = hover ? 'hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1' : '';

    const CardComponent = hover ? motion.div : 'div';
    const motionProps = hover ? {
      whileHover: { y: -4 },
      transition: { duration: 0.2 }
    } : {};

    return (
      <CardComponent
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          hoverClasses,
          className
        )}
        {...(hover ? motionProps : {})}
        {...(props as any)}
      >
        {children}
      </CardComponent>
    );
  }
);

Card.displayName = 'Card';

export { Card };
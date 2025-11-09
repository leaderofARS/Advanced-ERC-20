'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  HomeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Logo } from '@/components/ui/Logo';

const navigation = [
  { name: 'Dashboard', href: '#dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '#analytics', icon: ChartBarIcon },
  { name: 'Governance', href: '#governance', icon: UserGroupIcon },
  { name: 'Settings', href: '#settings', icon: CogIcon },
  { name: 'Docs', href: '#docs', icon: DocumentTextIcon },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
            <span className="ml-3 text-xl font-bold gradient-text">
              Advanced ERC-20
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-secondary-300 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </motion.a>
            ))}
          </div>

          {/* Connect Wallet & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <ConnectButton 
                chainStatus="icon"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-secondary-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-secondary-300 hover:text-white transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  whileHover={{ x: 10 }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </motion.a>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <ConnectButton 
                  chainStatus="icon"
                  accountStatus="avatar"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
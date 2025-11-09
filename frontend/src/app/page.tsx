'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Dashboard } from '@/components/sections/Dashboard';
import { Analytics } from '@/components/sections/Analytics';
import { Governance } from '@/components/sections/Governance';
import { Footer } from '@/components/layout/Footer';
import { TransactionMonitor } from '@/components/advanced/TransactionMonitor';

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary-950 overflow-x-hidden">
      <Navbar />
      
      {/* Main content with proper spacing */}
      <main className="pt-16">
        <Hero />
        <Features />
        <Dashboard />
        <Analytics />
        <Governance />
        
        {/* Advanced Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Live Transaction Monitor
              </h2>
              <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
                Real-time transaction monitoring with advanced filtering and analytics
              </p>
            </motion.div>
            
            <TransactionMonitor />
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
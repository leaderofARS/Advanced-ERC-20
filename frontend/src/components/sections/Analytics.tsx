'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RealTimeMetrics } from '@/components/advanced/RealTimeMetrics';

export function Analytics() {
  return (
    <section id="analytics" className="py-20 px-4 bg-secondary-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Advanced Analytics
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Real-time insights and comprehensive metrics for informed decision making
          </p>
        </motion.div>

        <RealTimeMetrics />
      </div>
    </section>
  );
}
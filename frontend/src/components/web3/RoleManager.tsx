'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheckIcon,
  UserPlusIcon,
  UserMinusIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const roles = [
  {
    name: 'DEFAULT_ADMIN_ROLE',
    description: 'Super admin with all permissions',
    color: 'text-error-400',
    bgColor: 'bg-error-500/20',
    icon: ShieldCheckIcon
  },
  {
    name: 'MINTER_ROLE',
    description: 'Can mint new tokens within max supply',
    color: 'text-success-400',
    bgColor: 'bg-success-500/20',
    icon: UserPlusIcon
  },
  {
    name: 'BURNER_ROLE',
    description: 'Can burn tokens from addresses',
    color: 'text-warning-400',
    bgColor: 'bg-warning-500/20',
    icon: UserMinusIcon
  },
  {
    name: 'PAUSER_ROLE',
    description: 'Can pause/unpause token operations',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    icon: ExclamationTriangleIcon
  },
  {
    name: 'COMPLIANCE_ROLE',
    description: 'Manages blacklist and transfer limits',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    icon: ShieldCheckIcon
  },
  {
    name: 'GOVERNOR_ROLE',
    description: 'Manages governance proposals',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: CogIcon
  },
  {
    name: 'ANALYTICS_ROLE',
    description: 'Manages analytics and metrics',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    icon: CogIcon
  }
];

export function RoleManager() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [targetAddress, setTargetAddress] = useState('');
  const { address, isConnected } = useAccount();

  const handleGrantRole = () => {
    if (!selectedRole || !targetAddress) return;
    // Implementation would call contract function
    console.log('Granting role:', selectedRole, 'to:', targetAddress);
  };

  const handleRevokeRole = () => {
    if (!selectedRole || !targetAddress) return;
    // Implementation would call contract function
    console.log('Revoking role:', selectedRole, 'from:', targetAddress);
  };

  if (!isConnected) {
    return (
      <Card className="p-6 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-warning-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Wallet Not Connected</h3>
        <p className="text-secondary-400">Please connect your wallet to manage roles</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Available Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <motion.div
              key={role.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => setSelectedRole(role.name)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedRole === role.name
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-secondary-600 bg-secondary-800/50 hover:border-secondary-500'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${role.bgColor}`}>
                    <role.icon className={`h-5 w-5 ${role.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {role.name.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-secondary-400 mt-1">
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Role Management Actions */}
      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Manage {selectedRole.replace('_', ' ')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Target Address
                </label>
                <input
                  type="text"
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-secondary-800/50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleGrantRole}
                  disabled={!targetAddress}
                  className="flex-1"
                >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Grant Role
                </Button>
                
                <Button
                  onClick={handleRevokeRole}
                  disabled={!targetAddress}
                  variant="outline"
                  className="flex-1"
                >
                  <UserMinusIcon className="h-4 w-4 mr-2" />
                  Revoke Role
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Current Role Holders */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Role Holders</h3>
        <div className="space-y-3">
          {/* Mock data - would be fetched from contract */}
          {[
            { role: 'DEFAULT_ADMIN_ROLE', address: '0x1234...5678', isYou: true },
            { role: 'MINTER_ROLE', address: '0xabcd...efgh', isYou: false },
            { role: 'PAUSER_ROLE', address: '0x9876...5432', isYou: false },
          ].map((holder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-secondary-800/50 rounded-lg"
            >
              <div>
                <p className="text-white text-sm font-medium">
                  {holder.role.replace('_', ' ')}
                </p>
                <p className="text-secondary-400 text-xs">
                  {holder.address} {holder.isYou && '(You)'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {holder.isYou && (
                  <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded">
                    You
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
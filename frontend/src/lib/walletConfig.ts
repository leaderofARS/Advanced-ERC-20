import { getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { Chain } from 'wagmi';

export function createWalletConnectors(chains: Chain[]) {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  
  // If no project ID is provided, use a limited set of wallets
  if (!projectId || projectId === 'default-project-id') {
    console.warn('WalletConnect project ID not configured. Some wallet features may be limited.');
    
    return connectorsForWallets([
      {
        groupName: 'Recommended',
        wallets: [
          injectedWallet({ chains }),
          metaMaskWallet({ projectId: '2f05a7cdc2bb9f5b8a186aa4e3010a2c', chains }),
          coinbaseWallet({ appName: 'Advanced ERC-20', chains }),
        ],
      },
    ]);
  }

  // Full wallet configuration with WalletConnect
  try {
    const { connectors } = getDefaultWallets({
      appName: 'Advanced ERC-20',
      projectId,
      chains,
    });
    
    return connectors;
  } catch (error) {
    console.warn('Error configuring wallets, falling back to basic configuration:', error);
    
    // Fallback configuration
    return connectorsForWallets([
      {
        groupName: 'Recommended',
        wallets: [
          injectedWallet({ chains }),
          metaMaskWallet({ projectId: '2f05a7cdc2bb9f5b8a186aa4e3010a2c', chains }),
          coinbaseWallet({ appName: 'Advanced ERC-20', chains }),
        ],
      },
    ]);
  }
}

// Safe wallet connection wrapper
export function safeWalletConnect(connectFn: () => Promise<void>) {
  return async () => {
    try {
      await connectFn();
    } catch (error: any) {
      // Handle specific wallet connection errors
      if (error?.message?.includes('User rejected') || 
          error?.message?.includes('User denied')) {
        console.log('User cancelled wallet connection');
        return;
      }
      
      if (error?.message?.includes('WebSocket') || 
          error?.message?.includes('WalletConnect')) {
        console.warn('WalletConnect connection issue (non-critical):', error.message);
        return;
      }
      
      console.error('Wallet connection error:', error);
      throw error;
    }
  };
}
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Advanced ERC-20 | Enterprise Token Management',
  description: 'Next-generation ERC-20 token with advanced features including governance, compliance, analytics, and fee mechanisms.',
  keywords: ['ERC-20', 'DeFi', 'Blockchain', 'Ethereum', 'Token', 'Governance', 'Web3'],
  authors: [{ name: 'Advanced ERC-20 Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
  openGraph: {
    title: 'Advanced ERC-20 | Enterprise Token Management',
    description: 'Next-generation ERC-20 token with advanced features',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced ERC-20 | Enterprise Token Management',
    description: 'Next-generation ERC-20 token with advanced features',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-secondary-950 text-white min-h-screen antialiased`}>
        <ErrorBoundary>
          <Providers>
            {/* Background Effects */}
            <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
            <div className="fixed inset-0 matrix-rain pointer-events-none" />
            
            {/* Main Content */}
            <div className="relative z-10 min-h-screen">
              {children}
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
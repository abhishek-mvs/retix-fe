import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectWallet, WalletInfo } from '@/utils/connectWallet';
import { BrowserProvider } from 'ethers';
import Cookies from 'js-cookie';

interface WalletContextType {
  wallet: WalletInfo | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const connect = async () => {
    try {
      setIsConnecting(true);
      const walletInfo = await connectWallet();
      setWallet(walletInfo);
      // Set cookie for wallet connection status
      Cookies.set('wallet_connected', 'true', { expires: 7 }); // Expires in 7 days
      
      // Check if there's a redirect URL
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
    // Remove wallet connection cookie
    Cookies.remove('wallet_connected');
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWallet({ signer, provider, address });
            // Set cookie for wallet connection status
            Cookies.set('wallet_connected', 'true', { expires: 7 });
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };
    checkWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 
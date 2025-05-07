'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function useWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  return {
    address,
    isConnected,
    connect,
    connectors,
    isLoading,
    pendingConnector,
    disconnect,
  }
} 
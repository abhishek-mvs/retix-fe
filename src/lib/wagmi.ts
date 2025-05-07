import { http } from 'wagmi'
import { mainnet, sepolia, baseSepolia, hardhat } from 'wagmi/chains'
import { createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, baseSepolia, hardhat],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [hardhat.id]: http(),
  },
}) 
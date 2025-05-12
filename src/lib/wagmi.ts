import { http } from "wagmi";
import { mainnet, baseSepolia, hardhat } from "wagmi/chains";
import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, baseSepolia, hardhat],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
    [hardhat.id]: http(),
  },
});

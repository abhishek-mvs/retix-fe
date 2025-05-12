"use client";

import { PRIVY_APP_ID } from "@/data/constants";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "wagmi/chains";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        // Display email and wallet as login methods
        loginMethods: ["email"],
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#264a82",
          logo: "/logos/logo-with-name.svg",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          // createOnLogin: "all-users",
        },

        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  );
}

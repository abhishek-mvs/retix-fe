"use client";

import { PRIVY_APP_ID } from "@/data/constants";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia, base } from "wagmi/chains";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { PostHogProvider } from "./PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
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

          defaultChain: base,
          supportedChains: [baseSepolia, base],
        }}
      >
        <SmartWalletsProvider>{children}</SmartWalletsProvider>
      </PrivyProvider>
    </PostHogProvider>
  );
}
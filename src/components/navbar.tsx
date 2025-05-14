"use client";
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "wagmi/chains";
import { MOCK_USDC_ADDRESS } from "@/data/constants";
import USDC_ABI from "../data/usdcERC20.json";
import { ethers } from "ethers";

export default function Navbar() {
  const router = useRouter();
  const { login, logout, user } = usePrivy();
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!user?.smartWallet?.address) return;

      try {
        const publicClient = createPublicClient({
          chain: baseSepolia,
          transport: http(),
        });

        // Fetch ETH balance
        const ethBalanceWei = await publicClient.getBalance({
          address: user.smartWallet.address as `0x${string}`,
        });
        setEthBalance(ethers.formatEther(ethBalanceWei));

        // Fetch USDC balance
        const usdcBalanceWei = (await publicClient.readContract({
          address: MOCK_USDC_ADDRESS as `0x${string}`,
          abi: USDC_ABI,
          functionName: "balanceOf",
          args: [user.smartWallet.address],
        })) as bigint;
        setUsdcBalance(ethers.formatEther(usdcBalanceWei));
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.smartWallet?.address) {
      fetchBalances();
      // Refresh balances every 30 seconds
      const interval = setInterval(fetchBalances, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.smartWallet?.address]);

  const handleDisconnect = () => {
    logout();
    router.push("/");
  };

  const copyAddress = () => {
    if (user?.smartWallet?.address) {
      navigator.clipboard.writeText(user.smartWallet.address);
      toast.success("Smart wallet address copied to clipboard!");
    }
  };

  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Link href="/" className="mr-8">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={150}
            height={30}
            className="h-6 w-auto"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <NavLink href="/events">Explore</NavLink>
        {user && (
          <>
            <NavLink href="/sell">Sell</NavLink>
            <NavLink href="/my-tickets">My Tickets</NavLink>
            <NavLink href="/my-bids">My Bids</NavLink>
          </>
        )}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="text-sm">{user.email?.address}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {user.smartWallet?.address && (
                <>
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    Smart Wallet
                  </div>
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={copyAddress}
                  >
                    <span className="text-xs font-mono">
                      {user.smartWallet.address.slice(0, 6)}...
                      {user.smartWallet.address.slice(-4)}
                    </span>
                    <Copy className="h-4 w-4" />
                  </DropdownMenuItem>
                  <div className="px-2 py-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ETH Balance:</span>
                      <span className="font-mono">
                        {isLoading
                          ? "..."
                          : `${parseFloat(ethBalance).toFixed(4)} ETH`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">USDC Balance:</span>
                      <span className="font-mono">
                        {isLoading
                          ? "..."
                          : `${parseFloat(usdcBalance).toFixed(2)} USDC`}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleDisconnect}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={login}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-gray-800 hover:text-green-600">
      {children}
    </Link>
  );
}

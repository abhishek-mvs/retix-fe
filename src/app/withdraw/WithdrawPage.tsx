"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { createPublicClient, http, encodeFunctionData } from "viem";
import { base } from "wagmi/chains";
import { MOCK_USDC_ADDRESS } from "@/data/constants";
import USDC_ABI from "@/data/usdcERC20.json";
import { ethers } from "ethers";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseUSDC, formatUSDC } from "@/utils/formatters";
type TokenType = "ETH" | "USDC";

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = usePrivy();
  const { client: smartWalletClient } = useSmartWallets();
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<TokenType>("USDC");

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const fetchBalances = async () => {
      if (!user?.smartWallet?.address) return;

      try {
        const publicClient = createPublicClient({
          chain: base,
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
        setUsdcBalance(formatUSDC(usdcBalanceWei).toString());
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [user, router]);

  const handleWithdraw = async () => {
    if (!user?.smartWallet?.address || !smartWalletClient) {
      toast.error("No wallet connected");
      return;
    }

    if (!destinationAddress) {
      toast.error("Please enter a destination address");
      return;
    }

    // Validate Ethereum address
    if (!ethers.isAddress(destinationAddress)) {
      toast.error("Invalid Ethereum address");
      return;
    }

    try {
      setIsWithdrawing(true);
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });

      if (selectedToken === "USDC") {
        // Get the current USDC balance
        const usdcBalanceWei = (await publicClient.readContract({
          address: MOCK_USDC_ADDRESS as `0x${string}`,
          abi: USDC_ABI,
          functionName: "balanceOf",
          args: [user.smartWallet.address],
        })) as bigint;

        if (usdcBalanceWei <= BigInt(0)) {
          toast.error("No USDC balance to withdraw");
          return;
        }

        // If no amount specified, withdraw all
        const amountToWithdraw = withdrawAmount 
          ? parseUSDC(withdrawAmount)
          : usdcBalanceWei;

        if (amountToWithdraw > usdcBalanceWei) {
          toast.error("Insufficient balance");
          return;
        }

        // Transfer USDC to the destination address
        const tx = await smartWalletClient.sendTransaction({
          to: MOCK_USDC_ADDRESS,
          data: encodeFunctionData({
            abi: USDC_ABI,
            functionName: "transfer",
            args: [destinationAddress, amountToWithdraw],
          }),
        });

        // Wait for the transaction to be mined
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: tx,
          timeout: 60000 // 60 second timeout
        });

        if (receipt.status === 'success') {
          toast.success("USDC withdrawn successfully!");
          // Refresh balances
          const newUsdcBalanceWei = (await publicClient.readContract({
            address: MOCK_USDC_ADDRESS as `0x${string}`,
            abi: USDC_ABI,
            functionName: "balanceOf",
            args: [user.smartWallet.address],
          })) as bigint;
          setUsdcBalance(formatUSDC(newUsdcBalanceWei).toString());
        } else {
          throw new Error("Transaction failed");
        }
      } else {
        // Handle ETH withdrawal
        const ethBalanceWei = await publicClient.getBalance({
          address: user.smartWallet.address as `0x${string}`,
        });

        if (ethBalanceWei <= BigInt(0)) {
          toast.error("No ETH balance to withdraw");
          return;
        }

        // If no amount specified, withdraw all
        const amountToWithdraw = withdrawAmount 
          ? ethers.parseEther(withdrawAmount)
          : ethBalanceWei;

        if (amountToWithdraw > ethBalanceWei) {
          toast.error("Insufficient balance");
          return;
        }

        // Transfer ETH to the destination address
        const tx = await smartWalletClient.sendTransaction({
          to: destinationAddress as `0x${string}`,
          value: amountToWithdraw,
        });

        // Wait for the transaction to be mined
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: tx,
          timeout: 60000 // 60 second timeout
        });

        if (receipt.status === 'success') {
          toast.success("ETH withdrawn successfully!");
          // Refresh ETH balance
          const newEthBalanceWei = await publicClient.getBalance({
            address: user.smartWallet.address as `0x${string}`,
          });
          setEthBalance(ethers.formatEther(newEthBalanceWei));
        } else {
          throw new Error("Transaction failed");
        }
      }

      // Clear form after successful withdrawal
      setWithdrawAmount("");
      setDestinationAddress("");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error(error instanceof Error ? error.message : "Failed to withdraw funds");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleWithdrawAll = () => {
    setWithdrawAmount("");
    handleWithdraw();
  };

  const getCurrentBalance = () => {
    if (isLoading) return "...";
    return selectedToken === "ETH" 
      ? `${parseFloat(ethBalance).toFixed(4)} ETH`
      : `${parseFloat(usdcBalance).toFixed(2)} USDC`;
  };

  const isBalanceZero = () => {
    if (isLoading) return true;
    return selectedToken === "ETH" 
      ? parseFloat(ethBalance) <= 0
      : parseFloat(usdcBalance) <= 0;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>
                Transfer your funds from your smart wallet to your destination address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Token</label>
                  <Select
                    value={selectedToken}
                    onValueChange={(value) => setSelectedToken(value as TokenType)}
                    disabled={isWithdrawing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Available Balance:</span>
                    <span className="font-mono">
                      {getCurrentBalance()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination Address</label>
                  <Input
                    type="text"
                    placeholder="Enter Ethereum address"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    disabled={isWithdrawing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount to Withdraw</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      disabled={isWithdrawing}
                    />
                    <Button
                      variant="outline"
                      onClick={handleWithdrawAll}
                      disabled={isWithdrawing || isBalanceZero()}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || isBalanceZero() || !destinationAddress}
                >
                  {isWithdrawing ? "Withdrawing..." : "Withdraw Funds"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
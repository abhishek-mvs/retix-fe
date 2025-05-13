import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, MOCK_USDC_ADDRESS } from "@/data/constants";
import ABI from "../data/abi.json";
import USDC_ABI from "../data/usdcERC20.json";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "wagmi/chains";
import { toast } from "sonner";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useAddUserBid() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { client: smartWalletClient } = useSmartWallets();
  const { user } = usePrivy();

  const checkUSDCBalance = async (requiredAmount: bigint) => {
    if (!user?.smartWallet?.address) throw new Error("No wallet address found");

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });

    const balance = await publicClient.readContract({
      address: MOCK_USDC_ADDRESS as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [user.smartWallet.address]
    }) as bigint;

    console.log("USDC Balance:", ethers.formatEther(balance));
    console.log("Required Amount:", ethers.formatEther(requiredAmount));

    if (balance < requiredAmount) {
      throw new Error(`Insufficient USDC balance. You need ${ethers.formatEther(requiredAmount)} USDC but have ${ethers.formatEther(balance)} USDC.`);
    }

    return balance;
  };

  const checkAndApproveAllowance = async (bidAmount: number) => {
    if (!smartWalletClient) throw new Error("No Smart Wallet");
    if (!user?.smartWallet?.address) throw new Error("No wallet address found");

    const bidAmountWei = ethers.parseEther(bidAmount.toString());
    
    // Check USDC balance first
    await checkUSDCBalance(bidAmountWei);
    
    // Create a public client for read operations
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http()
    });

    // Check current allowance using public client
    const currentAllowance = await publicClient.readContract({
      address: MOCK_USDC_ADDRESS as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'allowance',
      args: [user.smartWallet.address, CONTRACT_ADDRESS]
    }) as bigint;

    console.log("Current allowance:", currentAllowance.toString());
    console.log("Required amount:", bidAmountWei.toString());

    // If current allowance is less than bid amount, request approval
    if (currentAllowance < bidAmountWei) {
      console.log("Requesting USDC approval...");
      const approveData = encodeFunctionData({
        abi: USDC_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, bidAmountWei],
      });

      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const approveTx = await smartWalletClient.sendTransaction({
            to: MOCK_USDC_ADDRESS,
            data: approveData,
          });

          console.log("USDC approval transaction:", approveTx);
          toast.success("USDC approval successful!");
          
          // Wait for a few blocks to ensure the approval is processed
          await sleep(5000);
          return;
        } catch (error) {
          retries++;
          console.error(`Approval attempt ${retries} failed:`, error);
          
          if (retries === MAX_RETRIES) {
            throw new Error("Failed to approve USDC after multiple attempts. Please try again later.");
          }
          
          // Wait before retrying
          await sleep(RETRY_DELAY);
        }
      }
    }
  };

  const placeBid = async (ticketId: number, bidAmount: number, email: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log("ticketId", ticketId);
      console.log("bidAmount", bidAmount.toString());
      console.log("email", email);
      const bidAmountWei = ethers.parseEther(bidAmount.toString());
      console.log("bidAmountWei", bidAmountWei);

      if (!smartWalletClient) throw new Error("No Smart Wallet");

      // Check and request USDC approval if needed
      await checkAndApproveAllowance(bidAmount);

      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          // Simulate the transaction first
          const simulateData = encodeFunctionData({
            abi: ABI,
            functionName: "placeBid",
            args: [BigInt(ticketId), bidAmountWei, email],
          });

          await smartWalletClient.sendTransaction({
            to: CONTRACT_ADDRESS,
            data: simulateData,
          });

          console.log("Simulation successful, proceeding with transaction");

          // If simulation passes, send the actual transaction
          const txData = encodeFunctionData({
            abi: ABI,
            functionName: "placeBid",
            args: [BigInt(ticketId), bidAmountWei, email],
          });

          const tx = await smartWalletClient.sendTransaction({
            to: CONTRACT_ADDRESS,
            data: txData,
          });

          console.log("Transaction sent:", tx);
          setTxHash(tx);
          toast.success("Bid placed successfully!");
          return tx;
        } catch (error: unknown) {
          retries++;
          console.error(`Bid attempt ${retries} failed:`, error);
          
          if (retries === MAX_RETRIES) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            if (errorMessage.includes("pimlico")) {
              throw new Error("Network is currently busy. Please try again in a few minutes.");
            } else if (errorMessage.includes("insufficient funds")) {
              throw new Error("Insufficient funds in your smart wallet. Please add more ETH for gas fees.");
            } else if (errorMessage.includes("transfer amount exceeds balance")) {
              throw new Error("Insufficient USDC balance. Please add more USDC to your smart wallet.");
            } else {
              throw new Error(`Failed to place bid: ${errorMessage}`);
            }
          }
          
          // Wait before retrying
          await sleep(RETRY_DELAY);
        }
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { placeBid, loading, error, txHash };
}

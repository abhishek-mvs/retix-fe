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

export function useAddUserBid() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { client: smartWalletClient } = useSmartWallets();
  const { user } = usePrivy();

  // Helper function to validate inputs before sending to contract
  const validateInputs = ({
    ticketId,
    bidAmount,
    email,
  }: {
    ticketId: number;
    bidAmount: number;
    email: string;
  }) => {
    if (ticketId < 0) {
      throw new Error("Invalid ticket ID");
    }

    if (bidAmount <= 0) {
      throw new Error("Bid amount must be greater than 0");
    }

    if (!email || !email.includes('@')) {
      throw new Error("Invalid email address");
    }
  };

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

      try {
        const approveTx = await smartWalletClient.sendTransaction({
          to: MOCK_USDC_ADDRESS,
          data: approveData,
        });

        console.log("USDC approval transaction:", approveTx);
        
        // Wait for the approval transaction to be mined
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: approveTx,
          timeout: 60000 // 60 second timeout
        });

        if (receipt.status === 'success') {
          toast.success("USDC approval successful!");
        } else {
          throw new Error("USDC approval transaction failed");
        }
      } catch (error) {
        console.error("USDC approval failed:", error);
        throw new Error("Failed to approve USDC. Please try again.");
      }
    }
  };

  const placeBid = async (ticketId: number, bidAmount: number, email: string) => {
    try {
      console.log("placeBid called", ticketId, bidAmount, email);
      setLoading(true);
      setError(null);

      if (!smartWalletClient) throw new Error("No Smart Wallet");
      
      // Validate inputs before proceeding
      validateInputs({ ticketId, bidAmount, email });

      const bidAmountWei = ethers.parseEther(bidAmount.toString());
      console.log("ticketId", ticketId);
      console.log("bidAmount", bidAmount.toString());
      console.log("email", email);
      console.log("bidAmountWei", bidAmountWei);

      // Check and request USDC approval if needed
      await checkAndApproveAllowance(bidAmount);

      // Simulate the transaction first
      const simulateData = encodeFunctionData({
        abi: ABI,
        functionName: "placeBid",
        args: [BigInt(ticketId), bidAmountWei, email],
      });

      // Create a public client for simulation
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http()
      });

      // Simulate the transaction without sending it
      await publicClient.simulateContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "placeBid",
        args: [BigInt(ticketId), bidAmountWei, email],
        account: user?.smartWallet?.address as `0x${string}`,
      });

      console.log("Simulation successful, proceeding with transaction");

      // If simulation passes, send the actual transaction
      const tx = await smartWalletClient.sendTransaction({
        to: CONTRACT_ADDRESS,
        data: simulateData,
      });

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
        timeout: 60000 // 60 second timeout
      });

      if (receipt.status === 'success') {
        console.log("Transaction confirmed:", tx);
        setTxHash(tx);
        toast.success("Bid placed successfully!");
        return tx;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: unknown) {
      let errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Handle common errors with better messages
      if (errorMessage.includes("user rejected")) {
        errorMessage = "Transaction was rejected by the user";
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage = "Insufficient funds in your smart wallet. Please add more ETH for gas fees.";
      } else if (errorMessage.includes("transfer amount exceeds balance")) {
        errorMessage = "Insufficient USDC balance. Please add more USDC to your smart wallet.";
      } else if (errorMessage.includes("pimlico")) {
        errorMessage = "Network is currently busy. Please try again in a few minutes.";
      } else if (errorMessage.includes("execution reverted")) {
        // Try to extract more specific error from the contract
        const match = errorMessage.match(/reason="([^"]+)"/);
        if (match && match[1]) {
          errorMessage = `Contract error: ${match[1]}`;
        } else {
          errorMessage = "Transaction failed: Contract execution reverted";
        }
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { placeBid, loading, error, txHash };
}

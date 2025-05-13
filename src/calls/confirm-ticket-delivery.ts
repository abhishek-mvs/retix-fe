import { Contract } from "ethers";
import ABI from "../data/abi.json";
import { CONTRACT_ADDRESS } from "@/data/constants";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData } from "viem";

export const confirmTicketDelivery = async (ticketId: number) => {
  const { client: smartWalletClient } = useSmartWallets();

  if (!smartWalletClient) throw new Error("No Smart Wallet");

  try {
    const tx = await smartWalletClient.sendTransaction({
      to: CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi: ABI,
        functionName: "confirmTicketDelivery",
        args: [BigInt(ticketId), true],
      }),
    });

    return true;
  } catch (error) {
    console.error("Error confirming ticket delivery:", error);
    throw error;
  }
}; 
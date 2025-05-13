import { Contract } from "ethers";
import ABI from "../data/abi.json";
import { CONTRACT_ADDRESS } from "@/data/constants";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData } from "viem";

type SmartWalletClient = ReturnType<typeof useSmartWallets>['client'];

export const confirmTicketDelivery = async (
  ticketId: number,
  smartWalletClient: SmartWalletClient
) => {
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
import { BrowserProvider, Contract } from "ethers";
import ABI from "../data/abi.json";
import { CONTRACT_ADDRESS } from "@/data/constants";

export const confirmTicketDelivery = async (ticketId: number) => {
  if (!window.ethereum) throw new Error("No wallet found");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

  try {
    const tx = await contract.confirmTicketDelivery(ticketId, true);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error confirming ticket delivery:", error);
    throw error;
  }
}; 
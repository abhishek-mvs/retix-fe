import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, MOCK_USDC_ADDRESS } from "@/data/constants";
import ABI from "../data/abi.json";
import USDC_ABI from "../data/usdcERC20.json";

export function useAddUserBid() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const checkAndApproveAllowance = async (signer: ethers.Signer, bidAmount: number) => {
    const usdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, USDC_ABI, signer);
    const signerAddress = await signer.getAddress();
    
    // Check current allowance
    const currentAllowance = await usdcContract.allowance(signerAddress, CONTRACT_ADDRESS);
    console.log("bidAmount", bidAmount.toString());
    const bidAmountWei = ethers.parseEther(bidAmount.toString());
    console.log("currentAllowance", currentAllowance);
    console.log("bidAmountWei", bidAmountWei);
    // If current allowance is less than bid amount, request approval
    if (currentAllowance < bidAmountWei) {
      console.log("Requesting USDC approval...");
      const approveTx = await usdcContract.approve(CONTRACT_ADDRESS, bidAmountWei);
      await approveTx.wait();
      console.log("USDC approval successful");
    }
  };

  const placeBid = async (ticketId: number, bidAmount: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log("ticketId", ticketId);
      console.log("bidAmount", bidAmount.toString());
      const bidAmountWei = ethers.parseEther(bidAmount.toString());
      console.log("bidAmountWei", bidAmountWei);
      if (!window.ethereum) throw new Error("Wallet not detected");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Check and request USDC approval if needed
      await checkAndApproveAllowance(signer, bidAmount);

      try {
        // Simulate the transaction first
        await contract.placeBid.staticCall(
          BigInt(ticketId),
          bidAmountWei,
          { gasLimit: 3000000 }
        );

        console.log("Simulation successful, proceeding with transaction");
      } catch (error: unknown) {
        const simError = error as Error;
        console.error("Simulation failed:", simError);
        if (simError.message) {
          if (simError.message.includes("execution reverted")) {
            const match = simError.message.match(/reason="([^"]+)"/);
            if (match && match[1]) {
              throw new Error(`Contract would reject this transaction: ${match[1]}`);
            }
          }
        }
        throw new Error("Transaction would fail: " + simError.message);
      }

      // If simulation passes, send the actual transaction
      const tx = await contract.placeBid(
        BigInt(ticketId),
        bidAmountWei,
        { gasLimit: 3000000 }
      );

      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed on-chain. Check explorer for details.");
      }

      console.log("Transaction confirmed:", receipt);
      setTxHash(receipt.hash);
      return receipt;
    } catch (err) {
      let errorMessage = (err as Error).message;

      if (errorMessage.includes("user rejected")) {
        errorMessage = "Transaction was rejected by the user";
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas * price + value";
      } else if (errorMessage.includes("execution reverted")) {
        const match = errorMessage.match(/reason="([^"]+)"/);
        if (match && match[1]) {
          errorMessage = `Contract error: ${match[1]}`;
        } else {
          errorMessage = "Transaction failed: Contract execution reverted";
        }
      }

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { placeBid, loading, error, txHash };
}

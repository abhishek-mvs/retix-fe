import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "@/data/constants";
import ABI from "../data/abi.json";

export function useListTicket() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Helper function to validate inputs before sending to contract
  const validateInputs = ({
    eventDate,
    bidExpiry,
    sellerExpiryTime,
    minBid,
  }: {
    eventDate: number;
    bidExpiry: number;
    sellerExpiryTime: number;
    minBid: number;
  }) => {
    const currentTime = Math.floor(Date.now() / 1000);

    // Check timestamps
    if (eventDate <= currentTime) {
      throw new Error("Event date must be in the future");
    }

    if (bidExpiry >= eventDate) {
      throw new Error("Bid expiry must be before event date");
    }

    if (sellerExpiryTime <= bidExpiry) {
      throw new Error("Seller expiry must be after bid expiry");
    }

    // Check for valid bid amount
    if (minBid <= 0) {
      throw new Error("Minimum bid must be greater than 0");
    }
  };

  const listTicket = async ({
    eventDetails,
    eventName,
    eventDate,
    eventLocation,
    ticketImage,
    sellerFID,
    minBid,
    bidExpiry,
    sellerExpiryTime,
  }: {
    eventDetails: string;
    eventName: string;
    eventDate: number;
    eventLocation: string;
    ticketImage: string;
    sellerFID: number;
    minBid: number;
    bidExpiry: number;
    sellerExpiryTime: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) throw new Error("Wallet not detected");

      validateInputs({ eventDate, bidExpiry, sellerExpiryTime, minBid });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      try {
        console.log("eventDetails", eventDetails);
        console.log("eventName", eventName);
        console.log("eventDate", eventDate);
        console.log("eventLocation", eventLocation);
        console.log("ticketImage", ticketImage);
        console.log("sellerFID", sellerFID);
        console.log("minBid", minBid);
        await contract.listTicket.staticCall(
          eventDetails,
          eventName,
          BigInt(eventDate),
          eventLocation,
          ticketImage,
          BigInt(sellerFID),
          ethers.parseEther(minBid.toString()),
          BigInt(bidExpiry),
          BigInt(sellerExpiryTime),
          { gasLimit: 3000000 }
        );

        console.log("Simulation successful, proceeding with transaction");
      } catch (error: unknown) {
        const simError = error as Error;
        console.error("Simulation failed:", simError);
        // Try to extract more useful error information
        if (simError.message) {
          if (simError.message.includes("execution reverted")) {
            const match = simError.message.match(/reason="([^"]+)"/);
            if (match && match[1]) {
              throw new Error(
                `Contract would reject this transaction: ${match[1]}`
              );
            }
          }
        }
        throw new Error("Transaction would fail: " + simError.message);
      }

      // If simulation passes, send the actual transaction
      const tx = await contract.listTicket(
        eventDetails,
        eventName,
        BigInt(eventDate),
        eventLocation,
        ticketImage,
        BigInt(sellerFID),
        ethers.parseEther(minBid.toString()),
        BigInt(bidExpiry),
        BigInt(sellerExpiryTime),
        {
          gasLimit: 3000000, // Increase gas limit significantly
        }
      );
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error(
          "Transaction failed on-chain. Check explorer for details."
        );
      }

      console.log("Transaction confirmed:", receipt);
      setTxHash(receipt.hash);
      return receipt;
    } catch (err) {
      let errorMessage = (err as Error).message;

      // Handle common errors with better messages
      if (errorMessage.includes("user rejected")) {
        errorMessage = "Transaction was rejected by the user";
      } else if (errorMessage.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for gas * price + value";
      } else if (errorMessage.includes("execution reverted")) {
        // Try to extract more specific error from the contract
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

  return { listTicket, loading, error, txHash };
}
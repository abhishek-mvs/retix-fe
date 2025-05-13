import { useEffect, useState, useCallback } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import ABI from "../data/abi.json";
import { CONTRACT_ADDRESS, RPC } from "@/data/constants";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

interface BestBid {
  email: string;
  amount: bigint;
}

export const useBestBid = (ticketId: number | string) => {
  const [bestBid, setBestBid] = useState<BestBid | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { client: smartWalletClient } = useSmartWallets();

  const fetchBestBid = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!smartWalletClient) throw new Error("No Smart Wallet");

      const provider = new JsonRpcProvider(RPC);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
      const [email, amount] = await contract.getTheBestBid(ticketId);
      setBestBid({ email, amount });
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [ticketId, smartWalletClient]);

  useEffect(() => {
    if (ticketId !== undefined && ticketId !== null) {
      fetchBestBid();
    }
  }, [ticketId, fetchBestBid]);

  return { bestBid, loading, error, refetch: fetchBestBid };
};

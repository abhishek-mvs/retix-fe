import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract } from "ethers";
import ABI from "../data/abi.json";
import { CONTRACT_ADDRESS } from "@/data/constants";

interface BestBid {
  email: string;
  amount: bigint;
}

export const useBestBid = (ticketId: number | string) => {
  const [bestBid, setBestBid] = useState<BestBid | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBestBid = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) throw new Error("No wallet found");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      const [email, amount] = await contract.getTheBestBid(ticketId);
      setBestBid({ email, amount });
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId !== undefined && ticketId !== null) {
      fetchBestBid();
    }
  }, [ticketId, fetchBestBid]);

  return { bestBid, loading, error, refetch: fetchBestBid };
};

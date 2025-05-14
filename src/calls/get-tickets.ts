import { useEffect, useState, useCallback } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import ABI from "../data/abi.json";
import { Ticket } from "@/types";
import { CONTRACT_ADDRESS, RPC } from "@/data/constants";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { client: smartWalletClient } = useSmartWallets();

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!smartWalletClient) throw new Error("No Smart Wallet");

      const provider = new JsonRpcProvider(RPC);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const allTickets: Ticket[] = await contract.getAllTickets();
      console.log("allTickets", allTickets);
      setTickets(allTickets);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [smartWalletClient]);

  useEffect(() => {
    if (smartWalletClient) {
      fetchTickets();
    }
  }, [fetchTickets, smartWalletClient]);

  return { tickets, loading, error, refetch: fetchTickets };
};

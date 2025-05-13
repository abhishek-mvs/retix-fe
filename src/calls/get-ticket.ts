import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import ABI from "../data/abi.json";
import { Ticket } from "@/types";
import { CONTRACT_ADDRESS, RPC } from "@/data/constants";

export const useTicketById = (id: number | string) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new JsonRpcProvider(RPC);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);
     
      const ticketData: Ticket = await contract.tickets(id);
      setTicket(ticketData);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      fetchTicket();
    }
  }, [id, fetchTicket]);

  return { ticket, loading, error, refetch: fetchTicket };
};

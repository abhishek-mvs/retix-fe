import { useEffect, useState } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import ABI from "../data/abi.json";
import { Ticket } from "@/types";
import { CONTRACT_ADDRESS, RPC } from "@/data/constants";
import { usePrivy } from "@privy-io/react-auth";

export const useSellerTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = usePrivy();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("user", user);
      const provider = new JsonRpcProvider(RPC);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const allTickets: Ticket[] = await contract.getSellerTickets(
        user?.smartWallet?.address
      );
      console.log("allSellerTickets", allTickets);
      setTickets(allTickets);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return { tickets, loading, error, refetch: fetchTickets };
};

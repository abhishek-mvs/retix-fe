import { useEffect, useState } from "react";
import ABI from "../data/abi.json";
import { Ticket } from "@/types";
import { CONTRACT_ADDRESS } from "@/data/constants";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData } from "viem";

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { client: smartWalletClient } = useSmartWallets();

  const fetchTickets = async () => {
    try {
      console.log("before tx 1");

      if (!smartWalletClient) {
        return; // Exit early if wallet is not ready
      }

      setLoading(true);
      setError(null);

      console.log("before tx");
      const tx = await smartWalletClient.sendTransaction({
        to: CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: ABI,
          functionName: "getAllTickets",
          args: [],
        }),
      });
      console.log("after tx");

      console.log({ tx });
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (isReady) {
  //     fetchTickets();
  //   }
  // }, [isReady]); // Only run when wallet is ready

  return { tickets, loading, error, refetch: fetchTickets };
};

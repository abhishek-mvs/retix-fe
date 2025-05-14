import { useEffect, useState, useCallback } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import ABI from "../data/abi.json";
import { Bid } from "@/types";
import { CONTRACT_ADDRESS, RPC } from "@/data/constants";
import { usePrivy } from "@privy-io/react-auth";

export const useUserBids = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = usePrivy();

  const fetchUserBids = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.smartWallet?.address) throw new Error("No wallet found");

      const provider = new JsonRpcProvider(RPC);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const userBids: Bid[] = await contract.getUserBids(user.smartWallet.address);
      console.log("userBids", userBids);
      setBids(userBids);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user?.smartWallet?.address]);

  useEffect(() => {
    if (user?.smartWallet?.address) {
      fetchUserBids();
    }
  }, [fetchUserBids, user?.smartWallet?.address]);

  return { bids, loading, error, refetch: fetchUserBids };
}; 
import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import ABI from "../data/abi.json";
import { Bid } from "@/types";
import { CONTRACT_ADDRESS } from "@/data/constants";

export const useUserBids = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBids = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) throw new Error("No wallet found");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

      const userBids: Bid[] = await contract.getUserBids(await signer.getAddress());
      console.log("userBids", userBids);
      setBids(userBids);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBids();
  }, []);

  return { bids, loading, error, refetch: fetchUserBids };
}; 
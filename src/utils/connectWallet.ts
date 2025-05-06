import { BrowserProvider, Signer } from "ethers";

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider;
  }
}

export interface WalletInfo {
  signer: Signer;
  provider: BrowserProvider;
  address: string;
}

export const connectWallet = async (): Promise<WalletInfo> => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { signer, provider, address };
};

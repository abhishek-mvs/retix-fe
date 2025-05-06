import React, { useState } from "react";
import { connectWallet, WalletInfo } from "../utils/connectWallet";

const WalletConnectButton: React.FC = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);

  const handleConnect = async () => {
    const walletInfo = await connectWallet();
    setWallet(walletInfo);
  };

  return (
    <div>
      {wallet ? (
        <p>
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}
        </p>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center text-gray-800 hover:text-green-600"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnectButton;

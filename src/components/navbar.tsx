import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@/contexts/WalletContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { wallet, connect, disconnect, isConnecting } = useWallet();
  const router = useRouter();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    router.push('/');
  };

  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Link href="/" className="mr-8">
          <Image
            src="/placeholder.svg?height=50&width=150"
            alt="Logo"
            width={150}
            height={50}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <NavLink href="/events">Explore</NavLink>
        {wallet && (
          <>
            <NavLink href="/sell">Sell</NavLink>
            <NavLink href="/my-tickets">My Tickets</NavLink>
            <NavLink href="/my-bids">My Bids</NavLink>
          </>
        )}
        {wallet ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="text-sm">
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleDisconnect}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        )}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-gray-800 hover:text-green-600">
      {children}
    </Link>
  );
}

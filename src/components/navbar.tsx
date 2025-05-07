import type React from "react";
import Link from "next/link";
import Image from "next/image";
// import { User as UserIcon } from "lucide-react";
import WalletConnectButton from "./wallet-connect";

export default function Navbar() {
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
        <NavLink href="/explore">Explore</NavLink>
        <NavLink href="/sell">Sell</NavLink>
        {/* <NavLink href="/favorites">Favorites</NavLink> */}
        <NavLink href="/my-tickets">My Tickets</NavLink>
        <WalletConnectButton />
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

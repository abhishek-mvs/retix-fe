import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { User } from "lucide-react"

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
        <div className="hidden md:flex space-x-6">
          <NavLink href="/sports">Sports</NavLink>
          <NavLink href="/concerts">Concerts</NavLink>
          <NavLink href="/theater">Theater</NavLink>
          <NavLink href="/cities">Cities</NavLink>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <NavLink href="/explore">Explore</NavLink>
        <NavLink href="/sell">Sell</NavLink>
        <NavLink href="/favorites">Favorites</NavLink>
        <NavLink href="/my-tickets">My Tickets</NavLink>
        <Link href="/sign-in" className="flex items-center text-gray-800 hover:text-green-600">
          <span className="mr-2">Sign In</span>
          <User className="h-5 w-5 text-green-600" />
        </Link>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-800 hover:text-green-600">
      {children}
    </Link>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Info, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BidPopupProps {
  isOpen: boolean
  onClose: () => void
  eventName: string
  eventDate: string
  eventLocation: string
  minBid: string
  onSubmitBid: (amount: number, email: string) => void
}

export default function BidPopup({
  isOpen,
  onClose,
  eventName,
  eventDate,
  eventLocation,
  minBid,
  onSubmitBid,
}: BidPopupProps) {
  const [bidAmount, setBidAmount] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const minBidValue = minBid ? Number.parseFloat(minBid.replace(/[^0-9.]/g, "")) : 0

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value)
    setError(null)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError(null)
  }

  const handleSubmit = () => {
    const amount = Number.parseFloat(bidAmount)

    if (isNaN(amount)) {
      setError("Please enter a valid bid amount")
      return
    }

    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    onSubmitBid(amount, email)
    setBidAmount("")
    setEmail("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
          <DialogDescription>
            Enter your bid amount for this ticket. The minimum bid is {minBid}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">{eventName}</h3>
            <p className="text-sm text-gray-500">{eventDate}</p>
            <p className="text-sm text-gray-500">{eventLocation}</p>
          </div>

          <Separator />

          <div>
            <Label htmlFor="min-bid" className="text-sm text-gray-500">
              Minimum Bid Required
            </Label>
            <p id="min-bid" className="font-semibold">
              {minBid}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bid-amount">Your Bid (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="bid-amount"
                type="number"
                step="0.01"
                min={minBidValue}
                placeholder={minBidValue.toFixed(2)}
                className="pl-8"
                value={bidAmount}
                onChange={handleBidChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-green-50 p-3 rounded-md flex items-start space-x-2">
            <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p>Your card will only be charged if your bid is accepted by the seller.</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            Place Bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

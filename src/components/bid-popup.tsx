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
  currentPrice: string
  minBidIncrement: string
  onSubmitBid: (amount: number) => void
}

export default function BidPopup({
  isOpen,
  onClose,
  eventName,
  eventDate,
  eventLocation,
  currentPrice,
  minBidIncrement,
  onSubmitBid,
}: BidPopupProps) {
  const [bidAmount, setBidAmount] = useState("")
  const [error, setError] = useState<string | null>(null)

  const currentPriceValue = Number.parseFloat(currentPrice.replace(/[^0-9.]/g, ""))
  const minBidValue = Number.parseFloat(minBidIncrement.replace(/[^0-9.]/g, ""))
  const minAllowedBid = currentPriceValue + minBidValue

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value)
    setError(null)
  }

  const handleSubmit = () => {
    const amount = Number.parseFloat(bidAmount)

    if (isNaN(amount)) {
      setError("Please enter a valid bid amount")
      return
    }

    if (amount < minAllowedBid) {
      setError(`Bid must be at least $${minAllowedBid.toFixed(2)}`)
      return
    }

    onSubmitBid(amount)
    setBidAmount("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
          <DialogDescription>
            Enter your bid amount for this ticket. The minimum bid increment is {minBidIncrement}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">{eventName}</h3>
            <p className="text-sm text-gray-500">{eventDate}</p>
            <p className="text-sm text-gray-500">{eventLocation}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-price" className="text-sm text-gray-500">
                Current Price
              </Label>
              <p id="current-price" className="font-semibold">
                {currentPrice}
              </p>
            </div>
            <div>
              <Label htmlFor="min-increment" className="text-sm text-gray-500">
                Min. Increment
              </Label>
              <p id="min-increment" className="font-semibold">
                {minBidIncrement}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bid-amount">Your Bid (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="bid-amount"
                type="number"
                step="0.01"
                min={minAllowedBid}
                placeholder={minAllowedBid.toFixed(2)}
                className="pl-8"
                value={bidAmount}
                onChange={handleBidChange}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

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

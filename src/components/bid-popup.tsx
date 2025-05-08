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
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const minBidValue = minBid ? Number.parseFloat(minBid.replace(/[^0-9.]/g, "")) : 0

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError(null)
  }

  const handleSubmit = () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    onSubmitBid(minBidValue, email)
    setEmail("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Ticket</DialogTitle>
          <DialogDescription>
            Enter your email to purchase this ticket for {minBid}.
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
            <Label htmlFor="ticket-price" className="text-sm text-gray-500">
              Ticket Price
            </Label>
            <p id="ticket-price" className="font-semibold text-green-600">
              {minBid}
            </p>
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
              <p>Your card will be charged {minBid} for this ticket purchase.</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            Purchase Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

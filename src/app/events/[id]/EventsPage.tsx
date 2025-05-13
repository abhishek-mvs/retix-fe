"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTicketById } from "@/calls/get-ticket";
import {
  formatTimestamp,
  formatTimeLeft,
  formatUSDC,
} from "@/utils/formatters";
import { useState } from "react";
import BidPopup from "@/components/bid-popup";
import { useAddUserBid } from "@/calls/add-user-bid";
import { toast } from "sonner";
import { getTicketStatusString } from "@/types";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

export default function EventPage({ id }: { id: number }) {
  const { ticket } = useTicketById(id);
  const { client: smartWalletClient } = useSmartWallets();

  console.log({ smartWalletClient });

  const [isBidPopupOpen, setIsBidPopupOpen] = useState(false);
  const { placeBid, loading, error } = useAddUserBid();

  const handleOpenBidPopup = () => {
    setIsBidPopupOpen(true);
  };

  const handleCloseBidPopup = () => {
    setIsBidPopupOpen(false);
  };

  const handleSubmitBid = async (amount: number, email: string) => {
    try {
      await placeBid(id, amount, email);
      toast.success("Bid placed successfully!");
      handleCloseBidPopup();
    } catch (err) {
      toast.error(error || "Failed to place bid");
    }
  };

  if (!ticket) return <p>Loading...</p>;

  // Check if bidding is expired
  const now = Math.floor(Date.now() / 1000);
  const isExpired = Number(ticket.bidExpiryTime) < now;
  const isActive = Number(ticket.status) === 0;
  const isAvailableForBidding = isActive && !isExpired;

  const getStatusMessage = () => {
    if (!isActive) {
      switch (Number(ticket.status)) {
        case 1:
          return "Ticket is pending verification";
        case 2:
          return "Ticket has been sold";
        case 3:
          return "Ticket is no longer available";
        default:
          return "Ticket is not available";
      }
    }
    if (isExpired) {
      return "Bidding time has expired";
    }
    return "";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-4xl w-full p-0 md:p-10 flex flex-col md:flex-row gap-0 md:gap-10 relative">
        {/* Back to listings link inside the card */}
        <div className="absolute left-0 top-0 md:top-6 md:left-6 z-10">
          <Link
            href="/events"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors text-base font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Link>
        </div>
        {/* Event Image */}
        <div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-0">
          <div className="relative aspect-video w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-md">
            <Image
              src={ticket?.ticketImage}
              alt={ticket?.eventName}
              fill
              className="object-cover"
            />
          </div>
        </div>
        {/* Event Details */}
        <div className="md:w-1/2 w-full flex flex-col justify-center space-y-6 p-6 md:p-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 leading-tight">
              {ticket.eventName}
            </h1>
            <p className="text-base text-gray-500 mb-4 flex items-center gap-2">
              <span className="inline-block bg-gray-100 px-2 py-0.5 rounded-full font-medium text-gray-700 text-sm">
                {formatTimestamp(ticket.eventDate)}
              </span>
              <span className="inline-block bg-gray-100 px-2 py-0.5 rounded-full font-medium text-gray-700 text-sm">
                {ticket.eventLocation}
              </span>
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              About this event
            </h2>
            <p className="text-gray-700 text-sm">{ticket.eventDetails}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              Ticket Information
            </h2>
            <div className="divide-y divide-gray-200">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium text-sm">
                  Minimum Bid:
                </span>
                <span className="text-green-700 font-bold text-base">
                  {formatUSDC(ticket.minBid)} USDC
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium text-sm">
                  Bid Expires:
                </span>
                <span className="text-gray-800 text-sm">
                  {formatTimestamp(ticket.bidExpiryTime)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium text-sm">
                  Time Left:
                </span>
                <span
                  className={`font-bold text-sm ${
                    isExpired ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatTimeLeft(ticket.bidExpiryTime)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium text-sm">Status:</span>
                <span className="text-gray-800 text-sm">{getTicketStatusString(ticket.status)}</span>
              </div>
            </div>
          </div>

          {/* Bid Button or Expired Message */}
          {isExpired ? (
            <div className="w-full text-center py-2 text-base font-semibold text-red-600 bg-red-50 rounded-xl border border-red-200">Bidding time is expired</div>
          ) : (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 text-base font-semibold rounded-xl shadow transition-colors"
              onClick={handleOpenBidPopup}
            >
              Place a Bid
            </Button>
          )}
        </div>

        <BidPopup
          isOpen={isBidPopupOpen}
          onClose={handleCloseBidPopup}
          eventName={ticket.eventName}
          eventDate={formatTimestamp(ticket.bidExpiryTime)}
          eventLocation={ticket.eventLocation}
          minBid={formatUSDC(ticket.minBid).toString()}
          onSubmitBid={handleSubmitBid}
        />
      </div>
    </div>
  );
}

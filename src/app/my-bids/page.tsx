"use client";

import Navbar from "@/components/navbar";
import { useUserBids } from "@/calls/get-user-bids";
import { useTickets } from "@/calls/get-tickets";
import { Bid } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import Image from "next/image";
import { formatUSDC } from "@/utils/formatters";

export default function MyBidsPage() {
  const { bids, loading: bidsLoading, error: bidsError } = useUserBids();
  const { tickets, loading: ticketsLoading } = useTickets();
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");

  if (bidsLoading || ticketsLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (bidsError) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{bidsError}</div>;
  }

  const getTicketForBid = (bid: Bid) => {
    return tickets.find((ticket) => ticket.id === bid.ticketId);
  };

  const formatDate = (timestamp: bigint) => {
    return format(new Date(Number(timestamp) * 1000), "MMM dd, yyyy HH:mm");
  };

  const filteredBids = bids.filter((bid) => 
    activeTab === "current" ? bid.isActive : !bid.isActive
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">My Bids</h1>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b">
            <button
              className={`pb-2 px-4 ${
                activeTab === "current"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("current")}
            >
              Current Bids
            </button>
            <button
              className={`pb-2 px-4 ${
                activeTab === "past"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past Bids
            </button>
          </div>
          
          <div className="grid gap-6">
            {filteredBids.map((bid) => {
              const ticket = getTicketForBid(bid);
              if (!ticket) return null;

              return (
                <div key={`${bid.ticketId}-${bid.timestamp}`} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{ticket.eventName}</h2>
                      <p className="text-gray-600 mb-2">{ticket.eventDetails}</p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Location:</span> {ticket.eventLocation}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Your Bid:</span> {formatUSDC(bid.amount)} USDC
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Minimum Bid:</span> {formatUSDC(ticket.minBid)} USDC
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Bid Time:</span> {formatDate(bid.timestamp)}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Bid Expiry:</span> {formatDate(BigInt(ticket.bidExpiryTime))}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Status:</span>{" "}
                          <span
                            className={`${
                              bid.isAccepted
                                ? "text-green-600"
                                : bid.isActive
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {bid.isAccepted
                              ? "Won"
                              : bid.isActive
                              ? "Active"
                              : "Expired"}
                          </span>
                        </p>
                      </div>
                    </div>
                    {ticket.ticketImage && (
                      <div className="relative w-32 h-32">
                        <Image
                          src={ticket.ticketImage}
                          alt={ticket.eventName}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredBids.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {activeTab === "current" 
                  ? "You don't have any active bids."
                  : "You don't have any past bids."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
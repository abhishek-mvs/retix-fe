"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useSellerTickets } from "@/calls/get-seller-tickets";
import TicketCard from "@/components/ticket-card";
import { useState } from "react";
import { toast } from "sonner";
import { Ticket } from "@/types";
import { formatTimestamp, formatTimeLeft } from "@/utils/formatters";

export default function MyTicketsPage() {
  const { tickets, loading, error } = useSellerTickets();
  const [verifyingTicketId, setVerifyingTicketId] = useState<number | null>(null);

  const handleVerifyTicket = async (ticketId: number) => {
    setVerifyingTicketId(ticketId);
    try {
      // Dummy verification flow - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Ticket verified successfully!");
    } catch (error) {
      toast.error("Failed to verify ticket");
    } finally {
      setVerifyingTicketId(null);
    }
  };

  const isBiddingPeriodEnded = (ticket: Ticket) => {
    return Date.now() / 1000 > ticket.bidExpiryTime;
  };

  // Filter tickets into different categories
  const activeTickets = tickets.filter(ticket => !isBiddingPeriodEnded(ticket) && !ticket.sold);
  const pendingTickets = tickets.filter(ticket => isBiddingPeriodEnded(ticket) && !ticket.sold);
  const pastTickets = tickets.filter(ticket => ticket.sold);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

          {/* Active Tickets Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Active Tickets</h2>
            {activeTickets.length === 0 ? (
              <EmptyState message="No active tickets" />
            ) : (
              <div className="grid gap-6">
                {activeTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <TicketCard ticket={ticket} type="upcoming" />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
                          Bidding Active
                        </span>
                        <span className="text-sm text-gray-600">
                          Expires in {formatTimeLeft(ticket.bidExpiryTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Pending Verification Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Pending Verification</h2>
            {pendingTickets.length === 0 ? (
              <EmptyState message="No tickets pending verification" />
            ) : (
              <div className="grid gap-6">
                {pendingTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <TicketCard ticket={ticket} type="upcoming" />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                          Pending Verification
                        </span>
                        <span className="text-sm text-gray-600">
                          Verify within {formatTimeLeft(ticket.sellerExpiryTime)}
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleVerifyTicket(ticket.id)}
                        disabled={verifyingTicketId === ticket.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {verifyingTicketId === ticket.id ? 'Verifying...' : 'Verify Ticket Sent'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Past Tickets Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Past Tickets</h2>
            {pastTickets.length === 0 ? (
              <EmptyState message="No past tickets" />
            ) : (
              <div className="grid gap-6">
                {pastTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <TicketCard ticket={ticket} type="past" />
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                          Sold
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 mb-6">
        Tickets will appear here when available
      </p>
      <Button className="bg-green-600 hover:bg-green-700 text-white">
        Browse Events
      </Button>
    </div>
  );
}

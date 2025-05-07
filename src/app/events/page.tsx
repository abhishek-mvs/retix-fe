"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import TicketCard from "@/components/ticket-card";
import { useTickets } from "@/calls/get-tickets";

export default function MyTicketsPage() {
  const { tickets, loading, error } = useTickets();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">All Tickets</h1>

          {tickets.length === 0 ? (
            <EmptyState message="You don't have any upcoming tickets" />
          ) : (
            <div className="grid gap-6">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} type="upcoming" />
              ))}
            </div>
          )}
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
        Tickets you purchase will appear here
      </p>
      <Button className="bg-green-600 hover:bg-green-700 text-white">
        Browse Events
      </Button>
    </div>
  );
}

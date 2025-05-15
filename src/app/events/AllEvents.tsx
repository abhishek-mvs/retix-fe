"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import TicketCard from "@/components/ticket-card";
import { useTickets } from "@/calls/get-tickets";
import {
  filterActiveTickets,
  filterPastAndPendingTickets,
} from "@/utils/ticket-filters";

export default function EventsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { tickets, loading, error } = useTickets();
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <p className="text-red-600 font-medium text-lg">Error: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const currentTickets = filterActiveTickets(tickets);
  const pastTickets = filterPastAndPendingTickets(tickets);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">All Tickets</h1>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("current")}
                className={`${
                  activeTab === "current"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Current Events
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {currentTickets.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`${
                  activeTab === "past"
                    ? "border-gray-500 text-gray-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Past Events
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {pastTickets.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Current Events Section */}
          {activeTab === "current" && (
            <section>
              {currentTickets.length === 0 ? (
                <EmptyState
                  message="No current events available"
                  description="Check back later for new events"
                />
              ) : (
                <div className="grid gap-6">
                  {currentTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      type="upcoming"
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Past Events Section */}
          {activeTab === "past" && (
            <section>
              {pastTickets.length === 0 ? (
                <EmptyState
                  message="No past events"
                  description="Your past events will appear here"
                />
              ) : (
                <div className="grid gap-6">
                  {pastTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} type="past" />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  message,
  description,
}: {
  message: string;
  description: string;
}) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <Button className="bg-green-600 hover:bg-green-700 text-white">
        Browse Events
      </Button>
    </div>
  );
}

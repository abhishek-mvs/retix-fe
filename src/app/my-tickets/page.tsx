"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useSellerTickets } from "@/calls/get-seller-tickets";
import TicketCard from "@/components/ticket-card";
import { useState } from "react";
import { toast } from "sonner";
import { formatTimeLeft } from "@/utils/formatters";
import SellerTicketVerifierQR from "@/components/seller-ticket-verifier";
import { confirmTicketDelivery } from "@/calls/confirm-ticket-delivery";
import {
  filterActiveTickets,
  filterPendingTickets,
  filterPastTickets,
} from "@/utils/ticket-filters";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

export default function MyTicketsPage() {
  const { tickets, loading, error, refetch } = useSellerTickets();
  const [verifyingTicketId, setVerifyingTicketId] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "past">(
    "active"
  );
  const [showVerifier, setShowVerifier] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { client: smartWalletClient } = useSmartWallets();

  const handleVerifyTicket = async (ticketId: number) => {
    setVerifyingTicketId(ticketId);
    setShowVerifier(true);
  };

  const handleVerificationComplete = async (proof: {
    claimData: { context: string };
  }) => {
    console.log(proof);
    if (verifyingTicketId === null || !smartWalletClient) return;

    try {
      setIsConfirming(true);
      await confirmTicketDelivery(verifyingTicketId, smartWalletClient);
      toast.success("Ticket verified and delivery confirmed successfully!");
      setShowVerifier(false);
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify and confirm ticket delivery");
    } finally {
      setVerifyingTicketId(null);
      setIsConfirming(false);
    }
  };

  // // Filter tickets using the new status system
  // console.log("tickets", tickets);
  // for (const ticket of tickets) {
  //   console.log("ticket", ticket.status);
  // }
  const activeTickets = filterActiveTickets(tickets);
  const pendingTickets = filterPendingTickets(tickets);
  const pastTickets = filterPastTickets(tickets);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );

  if (error)
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        {/* Verification Modal */}
        {showVerifier && verifyingTicketId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              {isConfirming ? (
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-lg text-gray-600">
                    Confirming ticket delivery...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please wait while we process your transaction
                  </p>
                </div>
              ) : (
                <>
                  <SellerTicketVerifierQR
                    ticketId={verifyingTicketId}
                    onVerified={handleVerificationComplete}
                  />
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => {
                        setShowVerifier(false);
                        setVerifyingTicketId(null);
                      }}
                      variant="outline"
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("active")}
                className={`${
                  activeTab === "active"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Active Tickets
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {activeTickets.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`${
                  activeTab === "pending"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Pending Verification
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {pendingTickets.length}
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
                Past Tickets
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {pastTickets.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Active Tickets Section */}
          {activeTab === "active" && (
            <section>
              {activeTickets.length === 0 ? (
                <EmptyState message="No active tickets" />
              ) : (
                <div className="grid gap-6">
                  {activeTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <TicketCard ticket={ticket} type="selling" />
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
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
          )}

          {/* Pending Verification Section */}
          {activeTab === "pending" && (
            <section>
              {pendingTickets.length === 0 ? (
                <EmptyState message="No tickets pending verification" />
              ) : (
                <div className="grid gap-6">
                  {pendingTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <TicketCard ticket={ticket} type="selling" />
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Verify within{" "}
                            {formatTimeLeft(ticket.sellerExpiryTime)}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleVerifyTicket(ticket.id)}
                          disabled={verifyingTicketId === ticket.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {verifyingTicketId === ticket.id
                            ? "Verifying..."
                            : "Verify Ticket Sent"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Past Tickets Section */}
          {activeTab === "past" && (
            <section>
              {pastTickets.length === 0 ? (
                <EmptyState message="No past tickets" />
              ) : (
                <div className="grid gap-6">
                  {pastTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <TicketCard ticket={ticket} type="selling" />
                    </div>
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

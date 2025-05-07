"use client";
import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Share2, QrCode } from "lucide-react";
import Image from "next/image";
import { useSellerTickets } from "@/calls/get-seller-tickets";
import { Ticket } from "@/types";

export default function MyTicketsPage() {
  const { tickets, loading, error } = useSellerTickets();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
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

interface TicketCardProps {
  ticket: Ticket;
  type: "upcoming" | "past" | "selling";
}

function TicketCard({ ticket, type }: TicketCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative h-48 md:h-full">
            <Image
              src={"/placeholder.svg"}
              alt={ticket.eventDetails}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 md:col-span-3">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {ticket.eventDetails}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{ticket.bidExpiry}</span>
                  </div>
                  {/* <div className="flex items-center">
										<Clock className="h-4 w-4 mr-2" />
										<span>{ticket.time}</span>
									</div> */}
                  {/* <div className="flex items-center">
										<MapPin className="h-4 w-4 mr-2" />
										<span>{ticket.location}</span>
									</div> */}
                </div>

                <div className="mt-4">
                  {/* <p className="font-medium">{ticket.ticketType}</p>
									<p className="text-gray-600">{ticket.seatInfo}</p>
									{ticket.minBid && (
										<p className="font-bold mt-2">{ticket.price}</p>
									)} */}
                  {/* {ticket.status && (
										<div className="mt-2">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												{ticket.status}
											</span>
										</div>
									)} */}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {type === "upcoming" && (
                  <>
                    <Button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                      <QrCode className="h-4 w-4" />
                      View Ticket
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </>
                )}

                {type === "past" && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                )}

                {type === "selling" && (
                  <>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                    >
                      Edit Listing
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex items-center justify-center gap-2"
                    >
                      Remove Listing
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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

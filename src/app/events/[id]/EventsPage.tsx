"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTicketById } from "@/calls/get-ticket";
import { formatTimestamp } from "@/utils/formatters";

export default function EventPage({ id }: { id: number }) {
  const { ticket } = useTicketById(id);

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/events"
        className="inline-flex items-center text-green-600 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to listings
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={ticket?.ticketImage}
            alt={ticket?.eventName}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{ticket.eventName}</h1>
          <p className="text-gray-600 mb-4">
            {formatTimestamp(ticket.bidExpiryTime)} • {ticket.eventLocation}
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About this event</h2>
            <p className="text-gray-700">{ticket.eventDetails}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Ticket prices</h2>
            <p className="text-gray-700">{Number(ticket.minBid)}</p>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
            Place a Bid
          </Button>
        </div>
      </div>
    </div>
  );
}

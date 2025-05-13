"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Share2, QrCode, MapPin } from "lucide-react";
import Image from "next/image";
import { Ticket, getTicketStatusString } from "@/types";
import { formatTimestamp, getIPFSUrl, formatUSDC } from "@/utils/formatters";
import { useRouter } from "next/navigation";

interface TicketCardProps {
  ticket: Ticket;
  type: "upcoming" | "past" | "selling";
}

export default function TicketCard({ ticket, type }: TicketCardProps) {
  const router = useRouter();
  const redirectToTicket = () => {
    router.push(`/events/${ticket.id}`);
  };

  const getStatusColor = (status: bigint) => {
    switch (Number(status)) {
      case 0: // active
        return "bg-green-100 text-green-800";
      case 1: // pending
        return "bg-yellow-100 text-yellow-800";
      case 2: // completed
        return "bg-blue-100 text-blue-800";
      case 3: // notSold
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden" onClick={redirectToTicket}>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative h-48 md:h-full">
            <Image
              src={getIPFSUrl(ticket.ticketImage)}
              alt={ticket.eventDetails}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 md:col-span-3">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h2 className="text-xl font-bold mb-2">{ticket.eventName}</h2>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatTimestamp(ticket.eventDate)}</span>
                  </div>
                  {/* <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{ticket.bidExpiry}</span>
                  </div> */}
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{ticket.eventLocation}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-medium">{formatUSDC(ticket.minBid)} USDC</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getTicketStatusString(ticket.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {type === "upcoming" && Number(ticket.status) === 2 && (
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

                {type === "past" && Number(ticket.status) === 2 && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                )}

                {type === "selling" && Number(ticket.status) === 0 && (
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

                {type === "selling" && Number(ticket.status) === 1 && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    Verify Ticket
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

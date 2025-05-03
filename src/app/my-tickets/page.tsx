import Navbar from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Download,
  Share2,
  QrCode,
} from "lucide-react";
import Image from "next/image";

export default function MyTicketsPage() {
  // This would typically come from an API
  const upcomingTickets = [
    {
      id: "1",
      eventName: "Manchester City vs. Liverpool",
      date: "May 15, 2025",
      time: "8:00 PM",
      location: "Etihad Stadium, Manchester",
      imageUrl: "/placeholder.svg?height=200&width=300",
      ticketType: "General Admission",
      seatInfo: "Section A, Row 12, Seat 24-25",
    },
    {
      id: "2",
      eventName: "Taylor Swift Concert",
      date: "June 10, 2025",
      time: "7:30 PM",
      location: "Wembley Stadium, London",
      imageUrl: "/placeholder.svg?height=200&width=300",
      ticketType: "VIP Package",
      seatInfo: "Section B, Row 3, Seat 15-16",
    },
  ];

  const pastTickets = [
    {
      id: "3",
      eventName: "Arsenal vs. Chelsea",
      date: "March 5, 2025",
      time: "3:00 PM",
      location: "Emirates Stadium, London",
      imageUrl: "/placeholder.svg?height=200&width=300",
      ticketType: "General Admission",
      seatInfo: "Section C, Row 20, Seat 10-11",
    },
  ];

  const sellingTickets = [
    {
      id: "4",
      eventName: "Ed Sheeran Concert",
      date: "July 22, 2025",
      time: "8:00 PM",
      location: "O2 Arena, London",
      imageUrl: "/placeholder.svg?height=200&width=300",
      ticketType: "Standard Entry",
      seatInfo: "Section D, Row 15, Seat 7-8",
      price: "$120.00 each",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="selling">Selling</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingTickets.length > 0 ? (
                <div className="grid gap-6">
                  {upcomingTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      type="upcoming"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="You don't have any upcoming tickets" />
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastTickets.length > 0 ? (
                <div className="grid gap-6">
                  {pastTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} type="past" />
                  ))}
                </div>
              ) : (
                <EmptyState message="You don't have any past tickets" />
              )}
            </TabsContent>

            <TabsContent value="selling">
              {sellingTickets.length > 0 ? (
                <div className="grid gap-6">
                  {sellingTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      type="selling"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="You don't have any tickets for sale" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface Ticket {
  id: string;
  eventName: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  ticketType: string;
  seatInfo: string;
  price?: string;
  status?: string;
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
              src={ticket.imageUrl || "/placeholder.svg"}
              alt={ticket.eventName}
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
                    <span>{ticket.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{ticket.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{ticket.location}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-medium">{ticket.ticketType}</p>
                  <p className="text-gray-600">{ticket.seatInfo}</p>
                  {ticket.price && (
                    <p className="font-bold mt-2">{ticket.price}</p>
                  )}
                  {ticket.status && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {ticket.status}
                      </span>
                    </div>
                  )}
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

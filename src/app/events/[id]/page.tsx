import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // In a real app, you would fetch event details based on params.id
  const eventDetails = {
    id: id,
    title: "Event Title",
    date: "May 15, 2025",
    location: "Stadium Name, City",
    description: "This is a detailed description of the event.",
    imageUrl: "/placeholder.svg?height=400&width=800",
    price: "$75 - $250",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-green-600 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to listings
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={eventDetails.imageUrl || "/placeholder.svg"}
            alt={eventDetails.title}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{eventDetails.title}</h1>
          <p className="text-gray-600 mb-4">
            {eventDetails.date} • {eventDetails.location}
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About this event</h2>
            <p className="text-gray-700">{eventDetails.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Ticket prices</h2>
            <p className="text-gray-700">{eventDetails.price}</p>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
            View Available Tickets
          </Button>
        </div>
      </div>
    </div>
  );
}

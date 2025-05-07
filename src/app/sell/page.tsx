"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { ArrowLeft, Tag, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useListTicket } from "@/calls/list-ticket";
import TicketVerfierQR from "@/components/ticket-verifier";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

interface Proof {
  claimData: {
    context: string;
  };
}

export default function SellPage() {
  const {
    listTicket,
    //  loading, error, txHash
  } = useListTicket();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [ticketImage, setTicketImage] = useState("");
  const [minBid, setMinBid] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [finalEstimate, setFinalEstimate] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [proof, setProof] = useState<Proof | null>(null);
  const [actualEventTimestamp, setActualEventTimestamp] = useState<number | null>(null);

  useEffect(() => {
    function calculateFinalPrice(): number {
      const serviceFee = 2;
      const finalPrice = parseInt(minBid) - serviceFee;
      return finalPrice > 0 ? finalPrice : 0; // Prevent negative values
    }
    if (minBid != "") {
      const price = calculateFinalPrice();
      setFinalEstimate(price);
    }
  }, [minBid]);

  const handleList = async () => {
    console.log(eventDate);
    if (!eventDate || !actualEventTimestamp) return 0;

    // Subtract time from actual event for expiry values
    const bidExpiry = actualEventTimestamp - 2 * 86400; // 2 days before event
    const sellerExpiryTime = actualEventTimestamp - 1 * 86400; // 1 day before event
    console.log("bidExpiry", bidExpiry);
    console.log("sellerExpiryTime", sellerExpiryTime);

    await listTicket({
      eventDetails,
      eventName,
      eventDate: actualEventTimestamp,
      eventLocation,
      ticketImage,
      sellerFID: 0,
      minBid: parseInt(minBid),
      bidExpiry,
      sellerExpiryTime,
    });
  };

  const handleProofVerified = (proof: Proof) => {
    setIsVerified(true);
    setProof(proof);
    try {
      const context = JSON.parse(proof.claimData.context);
      const params = context.extractedParameters || {};
      setEventName(params.title || "");
      setEventDetails(params.product || "");
      setEventDate(params.transactionDate || "");
      setEventLocation(params.venue_code || "");

      // Parse IST date string to epoch
      if (params.transactionDate) {
        // Format: MM/DD/YYYY HH:MM:SS
        const [datePart, timePart] = params.transactionDate.split(' ');
        const [month, day, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        
        // Create date in IST (UTC+5:30)
        const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
        // Adjust for IST (UTC+5:30)
        date.setHours(date.getHours() - 5);
        date.setMinutes(date.getMinutes() - 30);
        
        const timestamp = Math.floor(date.getTime() / 1000);
        setActualEventTimestamp(timestamp);
        console.log('actualEventTimestamp', timestamp);
      }
    } catch (error) {
      console.error('Error parsing proof data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <h1 className="text-3xl font-bold mb-8">Sell Your Tickets</h1>

          {!isVerified ? (
            <TicketVerfierQR onVerified={handleProofVerified} />
          ) : (
            <>
              {/* Display proof for demonstration */}
              {proof && (
                <div className="mb-6 p-4 bg-gray-50 border rounded">
                  <h3 className="font-semibold mb-2">Verification Proof:</h3>
                  <pre className="text-xs overflow-x-auto">{JSON.stringify(proof, null, 2)}</pre>
                </div>
              )}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Event Details</h2>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="event-name" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                        <Input id="event-name" value={eventName} readOnly className="bg-gray-100" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                          <Input id="event-date" value={eventDate} readOnly className="bg-gray-100" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">Event Location</label>
                        <Input id="event-location" value={eventLocation} readOnly className="bg-gray-100" />
                      </div>
                      <div>
                        <label htmlFor="event-details" className="block text-sm font-medium text-gray-700 mb-1">Event Details</label>
                        <Input id="event-details" value={eventDetails} readOnly className="bg-gray-100" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>

                    <div className="space-y-4">
                      {/* <div>
                        <label
                          htmlFor="ticket-type"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ticket Type
                        </label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select ticket type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">
                              General Admission
                            </SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="reserved">
                              Reserved Seating
                            </SelectItem>
                            <SelectItem value="box">Box Seats</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}

                      <div className="grid grid-cols-2 gap-4">
                        {/* <div>
                          <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Quantity
                          </label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            placeholder="Number of tickets"
                          />
                        </div> */}
                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Min Bid ($)
                          </label>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="price"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-10"
                              onChange={(e) => setMinBid(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description (Optional)
                        </label>
                        <Textarea
                          id="description"
                          placeholder="Add details about your tickets (section, row, etc.)"
                          rows={4}
                          onChange={(e) => setEventDetails(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ticket Image URI
                        </label>
                        <Input
                          id="image"
                          type="text"
                          placeholder="Image URI"
                          onChange={(e) => setTicketImage(e.target.value)}
                        />
                      </div>
                      {/* 
                      <div>
                        <label
                          htmlFor="ticket-upload"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Upload Ticket Images
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Drag and drop files here, or click to browse
                          </p>
                          <input
                            id="ticket-upload"
                            type="file"
                            multiple
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() =>
                              document.getElementById("ticket-upload")?.click()
                            }
                          >
                            Select Files
                          </Button>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                    <h2 className="text-xl font-semibold mb-4">Listing Summary</h2>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Fee</span>
                        <span>$2</span>
                      </div>

                      <div className="flex justify-between font-semibold">
                        <span>Estimate you&apos;ll Receive</span>
                        <span>${finalEstimate ? finalEstimate : "---"}</span>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800 flex">
                        <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p>
                          Your tickets will be listed immediately after submission
                          and verification. You&apos;ll be paid once the tickets are
                          sold.
                        </p>
                      </div>

                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        onClick={handleList}
                      >
                        List Tickets for Sale
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

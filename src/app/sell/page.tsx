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
import Image from "next/image.js";
import { keccak256 } from "ethers";
import { encodeAbiParameters } from "viem";

interface Proof {
  claimData: {
    context: string;
  };
}

export default function SellPage() {
  const { listTicket } = useListTicket();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [minBid, setMinBid] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [finalEstimate, setFinalEstimate] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [privateBookingHash, setPrivateBookingHash] = useState("");
  const [actualEventTimestamp, setActualEventTimestamp] = useState<
    number | null
  >(null);

  const [ticketImage, setTicketImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setTicketImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a preview URL
    }
  };

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
    if (!eventDate || !actualEventTimestamp) return 0;

    // Subtract time from actual event for expiry values
    const bidExpiry = actualEventTimestamp - 2 * 60; // 5 mins before event
    const sellerExpiryTime = actualEventTimestamp + 45 * 60; // 2 mins before event
    console.log("bidExpiry", bidExpiry);
    console.log("sellerExpiryTime", sellerExpiryTime);

    await listTicket({
      eventDetails,
      eventName,
      eventDate: actualEventTimestamp,
      eventLocation,
      ticketImage:
        "https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/medium/raid-2-et00382745-1742820522.jpg",
      sellerFID: 0,
      minBid: parseInt(minBid),
      bidExpiry,
      sellerExpiryTime,
      privateBookingHash,
    });
  };

  const handleProofVerified = (proof: Proof) => {
    setIsVerified(true);
    try {
      const context = JSON.parse(proof.claimData.context);
      const params = context.extractedParameters || {};
      setEventName(params.title || "");
      setEventDetails(params.product || "");
      setEventDate(params.transactionDate || "");
      setEventLocation(params.venue_code || "");

      const secret = process.env.NEXT_PUBLIC_SECRET || "";
      const bookingId = params.URL_PARAMS_1;
      const transactionId = params.URL_PARAMS_2;

      const encoded = encodeAbiParameters(
        [
          { name: "secret", type: "string" },
          { name: "bookingId", type: "string" },
          { name: "transactionId", type: "string" },
        ],
        [secret, bookingId, transactionId]
      );
      const privateBookingHash = keccak256(encoded);
      setPrivateBookingHash(privateBookingHash);
      // Parse IST date string to epoch
      if (params.transactionDate) {
        // Format: MM/DD/YYYY HH:MM:SS
        const [datePart, timePart] = params.transactionDate.split(" ");
        const [month, day, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);

        // Create date in IST (UTC+5:30)
        const date = new Date(
          Date.UTC(year, month - 1, day, hours, minutes, seconds)
        );
        // Adjust for IST (UTC+5:30)
        date.setHours(date.getHours() - 5);
        date.setMinutes(date.getMinutes() - 30);
        
        const timestamp = Math.floor(date.getTime() / 1000);
        
        const timestamp10MinsFromNow = Math.floor((Date.now() + 60 * 60 * 1000) / 1000);
        setActualEventTimestamp(timestamp10MinsFromNow);
        console.log("actualEventTimestamp", timestamp10MinsFromNow);
      }
    } catch (error) {
      console.error("Error parsing proof data:", error);
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
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Event Details
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="event-name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Event Name
                        </label>
                        <Input
                          id="event-name"
                          value={eventName}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="event-date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Event Date
                          </label>
                          <Input
                            id="event-date"
                            value={eventDate}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="event-location"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Event Location
                          </label>
                          <Input
                            id="event-location"
                            value={eventLocation}
                            readOnly
                            className="bg-gray-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="event-details"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Event Details
                        </label>
                        <Input
                          id="event-details"
                          value={eventDetails}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Ticket Details
                    </h2>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Price ($)
                          </label>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="price"
                              type="number"
                              min="0"
                              // step="0.01"
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
                      <div className="mb-4">
                        <label
                          htmlFor="ticketImage"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ticket Image Upload
                        </label>

                        <div
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-50"
                          onClick={() =>
                            document.getElementById("ticketImageInput")?.click()
                          }
                        >
                          <svg
                            className="h-6 w-6 text-gray-400 mb-1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0 0l-3-3m3 3l3-3M16 7h-1a4 4 0 00-8 0H6a2 2 0 00-2 2v2h16V9a2 2 0 00-2-2z"
                            />
                          </svg>
                          <p className="text-sm text-gray-500">
                            Upload Ticket Image
                          </p>
                          <p className="text-xs text-gray-400">
                            (png, jpeg, pdf and more)
                          </p>
                        </div>

                        <input
                          type="file"
                          id="ticketImageInput"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={handleImageChange}
                        />

                        {/* 🔽 Show preview if available and not a PDF */}
                        {previewUrl &&
                          !ticketImage?.name.toLowerCase().endsWith(".pdf") && (
                            <Image
                              src={previewUrl}
                              alt="Ticket Preview"
                              className="mt-2 w-full max-h-64 object-contain rounded border"
                              width={100}
                              height={100}
                            />
                          )}

                        {/* If it's a PDF, show a file name */}
                        {ticketImage?.name.toLowerCase().endsWith(".pdf") && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected PDF: {ticketImage.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Listing Summary
                    </h2>

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
                          Your tickets will be listed immediately after
                          submission and verification. You&apos;ll be paid once
                          the tickets are sold.
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

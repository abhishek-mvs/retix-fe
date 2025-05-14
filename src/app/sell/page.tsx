"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useListTicket } from "@/calls/list-ticket";
import TicketVerfierQR from "@/components/ticket-verifier";
import Image from "next/image.js";
import { keccak256 } from "ethers";
import { encodeAbiParameters } from "viem";
import { useRouter } from "next/navigation";

interface Proof {
  claimData: {
    context: string;
  };
}

export default function SellPage() {
  const router = useRouter();
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
  
  const uploadToIPFS = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // If there's already an image, don't allow another one
      if (ticketImage) {
        alert('You can only upload one image. Please remove the existing image first.');
        e.target.value = ''; // Clear the input
        return;
      }

      const file = files[0];
      setTicketImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    if (previewUrl) {
      console.log("previewUrl", previewUrl);
    }
  }, [previewUrl]);

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
    const bidExpiry = actualEventTimestamp - 2 * 60;
    const sellerExpiryTime = actualEventTimestamp + 45 * 60;

    let finalImageUrl = "https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/medium/raid-2-et00382745-1742820522.jpg";
    
    // Only upload to IPFS if there's a ticket image
    if (ticketImage) {
      try {
        finalImageUrl = await uploadToIPFS(ticketImage);
        console.log("finalImageUrl", finalImageUrl);
      } catch (error) {
        console.error('Failed to upload image to IPFS:', error);
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    try {
      await listTicket({
        eventDetails,
        eventName,
        eventDate: actualEventTimestamp,
        eventLocation,
        ticketImage: finalImageUrl,
        sellerFID: 0,
        minBid: parseInt(minBid),
        bidExpiry,
        sellerExpiryTime,
        privateBookingHash,
      });
      
      // Navigate to my-tickets page after successful listing
      router.push('/my-tickets');
    } catch (error) {
      console.error('Failed to list ticket:', error);
      alert('Failed to list ticket. Please try again.');
    }
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

        const timestamp10MinsFromNow = Math.floor(
          (Date.now() + 60 * 60 * 1000) / 1000
        );
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
          <h1 className="text-3xl font-bold mb-8">Sell Your Tickets</h1>

          {!isVerified ? (
            <TicketVerfierQR onVerified={handleProofVerified} />
          ) : (
            <>
              <div className="grid md:grid-cols-12 gap-8">
                {/* Left Column - Event Image and Basic Details */}
                <div className="md:col-span-5">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Location
                        </label>
                        <div className="bg-gray-100 p-3 rounded-md flex items-center">
                          <svg
                            className="h-5 w-5 text-gray-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {eventLocation}
                        </div>
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

                  <div className="my-4">
                    <label
                      htmlFor="ticketImage"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ticket Image Upload
                    </label>

                    <div
                      className="w-full h-22 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-50"
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
                        Upload Ticket Image (png, jpeg, pdf and more)
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
                          className="mt-4 w-full max-h-64 object-contain rounded border"
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

                {/* Right Column - Ticket Details and Listing Summary */}
                <div className="md:col-span-7">
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
                          className="bg-gray-50"
                          onChange={(e) => setEventDetails(e.target.value)}
                          defaultValue={eventDetails}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">
                      Listing Summary
                    </h2>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <span className="text-gray-600">Service Fee</span>
                          <button className="ml-1 text-gray-400 hover:text-gray-600">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        </div>
                        <span className="font-medium">$2</span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center">
                          <span className="text-gray-800 font-medium">
                            Estimate you will receive
                          </span>
                          <button className="ml-1 text-gray-400 hover:text-gray-600">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        </div>
                        <span className="font-bold text-lg">
                          ${finalEstimate}
                        </span>
                      </div>

                      <Button
                        className="w-full bg-black hover:bg-gray-800 text-white py-6 mt-4"
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

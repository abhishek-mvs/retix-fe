"use client";
import Navbar from "@/components/navbar";
import { ArrowLeft, Upload, Calendar, MapPin, Tag, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SellPage() {
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

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="text-xl font-semibold mb-4">Event Details</h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="event-type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Type
                    </label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="concerts">Concerts</SelectItem>
                        <SelectItem value="theater">Theater</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="event-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Name
                    </label>
                    <Input id="event-name" placeholder="Enter event name" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="event-date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Event Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input id="event-date" type="date" className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="event-time"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Event Time
                      </label>
                      <Input id="event-time" type="time" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="event-location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="event-location"
                        placeholder="Enter venue name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>

                <div className="space-y-4">
                  <div>
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
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
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price per Ticket ($)
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
                    />
                  </div>

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
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Listing Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>You&apos;ll Receive</span>
                    <span>$0.00</span>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800 flex">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>
                      Your tickets will be listed immediately after submission
                      and verification. You&apos;ll be paid once the tickets are
                      sold.
                    </p>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    List Tickets for Sale
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

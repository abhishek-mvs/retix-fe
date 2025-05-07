"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SimpleBidPopup from "@/components/simple-bid-popup";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function BidExamplePage() {
  const [currentPrice, setCurrentPrice] = useState("$75.00");

  const handleBidSubmit = (amount: number) => {
    // In a real app, you would submit this to your backend
    console.log(`Bid submitted: $${amount.toFixed(2)}`);

    // Update the current price
    setCurrentPrice(`$${amount.toFixed(2)}`);

    // Show success toast
    toast({
      title: "Bid Placed Successfully!",
      description: `Your bid of $${amount.toFixed(2)} has been placed.`,
      variant: "success",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Bid Example</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Manchester City vs. Liverpool</CardTitle>
            <CardDescription>
              May 15, 2025 • Etihad Stadium, Manchester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Current Highest Bid</p>
                <p className="text-2xl font-bold text-green-700">
                  {currentPrice}
                </p>
              </div>

              <p className="text-sm text-gray-700">
                This is a premium ticket for the upcoming match between
                Manchester City and Liverpool. Seats are located in Section A
                with excellent view of the field.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View Details</Button>
            <SimpleBidPopup
              eventName="Manchester City vs. Liverpool"
              currentPrice={currentPrice}
              onSubmitBid={handleBidSubmit}
            />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taylor Swift Concert</CardTitle>
            <CardDescription>
              June 10, 2025 • Wembley Stadium, London
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Current Highest Bid</p>
                <p className="text-2xl font-bold text-green-700">$120.00</p>
              </div>

              <p className="text-sm text-gray-700">
                VIP ticket for Taylor Swift&apos;s upcoming concert. Package
                includes early entry, exclusive merchandise, and premium
                seating.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View Details</Button>
            <SimpleBidPopup
              eventName="Taylor Swift Concert"
              currentPrice="$120.00"
              onSubmitBid={(amount) => {
                console.log(`Bid submitted: $${amount.toFixed(2)}`);
                toast({
                  title: "Bid Placed Successfully!",
                  description: `Your bid of $${amount.toFixed(
                    2
                  )} has been placed.`,
                });
              }}
            />
          </CardFooter>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Custom Trigger Example</h2>
        <SimpleBidPopup
          eventName="Ed Sheeran Concert"
          currentPrice="$95.00"
          onSubmitBid={(amount) => {
            console.log(`Bid submitted: $${amount.toFixed(2)}`);
            toast({
              title: "Bid Placed Successfully!",
              description: `Your bid of $${amount.toFixed(2)} has been placed.`,
            });
          }}
          triggerButton={
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Bid Now
            </Button>
          }
        />
      </div>

      <Toaster />
    </div>
  );
}

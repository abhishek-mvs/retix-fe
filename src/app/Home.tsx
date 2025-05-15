"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import MobileMockupFlow from "@/components/mobille-mockup-flow";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define the steps for the sell flow
  const sellSteps = [
    {
      id: 1,
      title: "Scan QR Code",
      description: "Visit the sell page and scan the QR code with your phone",
      imageUrl: "/steps/1.png",
    },
    {
      id: 2,
      title: "Open Ticket Verifier",
      description: "The QR code opens our ticket verifier link in your browser",
      imageUrl: "/steps/2.jpeg",
    },
    {
      id: 3,
      title: "Login to BookMyShow",
      description: "Sign in to your BookMyShow account to access your tickets",
      imageUrl: "/steps/3.jpeg",
    },
    {
      id: 4,
      title: "Select the Ticket",
      description:
        "Navigate to the orders page in BookMyShow to see your tickets and select one.",
      imageUrl: "/steps/4.jpeg",
    },
    {
      id: 5,
      title: "Verify Ticket Details",
      description:
        "We'll automatically fetch the details of the ticket you select which will be auto-filled in the listing form",
      imageUrl: "/steps/5.jpeg",
    },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gray-500 font-medium">Offload your </span>
              <span className="text-black font-extrabold">
                Tickets the Smart Way
              </span>
            </h1>
          </div>

          <MobileMockupFlow steps={sellSteps} />

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to sell your tickets?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              It only takes a few minutes to list your tickets and reach
              thousands of potential buyers.
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = '/sell'}
            >
              Start Selling Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

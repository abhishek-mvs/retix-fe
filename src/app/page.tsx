"use client	";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import MobileMockupFlow from "@/components/mobille-mockup-flow";

export default function SellFlowPage() {
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
      title: "Visit Orders Page",
      description:
        "Navigate to the orders page in BookMyShow to see your tickets",
      imageUrl: "/steps/4.jpeg",
    },
    {
      id: 5,
      title: "Select & List Ticket",
      description:
        "Click on the ticket you want to list and we'll automatically fetch the details",
      imageUrl: "/steps/5.jpeg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />

        <div className="py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">
              Offload your tickets the Smart Way
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
            <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              Start Selling Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

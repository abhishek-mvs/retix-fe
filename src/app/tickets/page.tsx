'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useContract } from '@/hooks/useContract';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatEther } from 'viem';
import Link from 'next/link';

export default function TicketsPage() {
  const { address, isConnected } = useWallet();
  const { allTickets, isLoadingTickets, placeBid, isPlacingBid } = useContract();
  const [bidAmounts, setBidAmounts] = useState<{ [key: number]: string }>({});

  const handleBidChange = (ticketId: number, amount: string) => {
    setBidAmounts(prev => ({
      ...prev,
      [ticketId]: amount
    }));
  };

  const handlePlaceBid = async (ticketId: number) => {
    const amount = bidAmounts[ticketId];
    if (!amount) return;

    try {
      await placeBid(ticketId, amount);
      // Clear bid amount after successful bid
      setBidAmounts(prev => ({
        ...prev,
        [ticketId]: ''
      }));
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h1>
          <p className="text-gray-600">You need to connect your wallet to view and bid on tickets.</p>
        </div>
      </div>
    );
  }

  if (isLoadingTickets) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Tickets</h1>
        <Link href="/tickets/create">
          <Button>List New Ticket</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTickets?.map((ticket) => (
          <Card key={ticket.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>Ticket #{ticket.id}</CardTitle>
              <CardDescription>
                <div className="space-y-2">
                  <p>Event: {ticket.eventDetails}</p>
                  <p>Seller: {ticket.seller}</p>
                  <p>Minimum Bid: {formatEther(ticket.minBid)} ETH</p>
                  <p>Status: {ticket.sold ? 'Sold' : 'Available'}</p>
                  <p>Bid Expiry: {new Date(Number(ticket.bidExpiryTime) * 1000).toLocaleString()}</p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!ticket.sold && (
                <div className="space-y-4">
                  <Input
                    type="number"
                    placeholder="Enter bid amount in ETH"
                    value={bidAmounts[ticket.id] || ''}
                    onChange={(e) => handleBidChange(ticket.id, e.target.value)}
                    min={formatEther(ticket.minBid)}
                    step="0.01"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              {!ticket.sold && (
                <Button
                  onClick={() => handlePlaceBid(ticket.id)}
                  disabled={isPlacingBid || !bidAmounts[ticket.id]}
                  className="w-full"
                >
                  {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 
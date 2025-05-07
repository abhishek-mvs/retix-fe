'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useContract } from '@/hooks/useContract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function CreateTicketPage() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { listTicket, isListingTicket } = useContract();
  const [formData, setFormData] = useState({
    details: '',
    sellerFID: '',
    minBid: '',
    bidExpiryTime: '',
    sellerExpiryTime: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert times to Unix timestamps
      const bidExpiryTime = Math.floor(new Date(formData.bidExpiryTime).getTime() / 1000);
      const sellerExpiryTime = Math.floor(new Date(formData.sellerExpiryTime).getTime() / 1000);

      await listTicket(
        formData.details,
        parseInt(formData.sellerFID),
        formData.minBid,
        bidExpiryTime,
        sellerExpiryTime
      );

      // Redirect to tickets page after successful listing
      router.push('/tickets');
    } catch (error) {
      console.error('Error listing ticket:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h1>
          <p className="text-gray-600">You need to connect your wallet to list tickets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>List New Ticket</CardTitle>
          <CardDescription>Fill in the details to list your ticket for sale</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium">
                Event Details
              </label>
              <Textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Enter event details"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sellerFID" className="text-sm font-medium">
                Seller FID
              </label>
              <Input
                id="sellerFID"
                name="sellerFID"
                type="number"
                value={formData.sellerFID}
                onChange={handleInputChange}
                placeholder="Enter your FID"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="minBid" className="text-sm font-medium">
                Minimum Bid (ETH)
              </label>
              <Input
                id="minBid"
                name="minBid"
                type="number"
                value={formData.minBid}
                onChange={handleInputChange}
                placeholder="Enter minimum bid amount"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bidExpiryTime" className="text-sm font-medium">
                Bid Expiry Time
              </label>
              <Input
                id="bidExpiryTime"
                name="bidExpiryTime"
                type="datetime-local"
                value={formData.bidExpiryTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sellerExpiryTime" className="text-sm font-medium">
                Seller Expiry Time
              </label>
              <Input
                id="sellerExpiryTime"
                name="sellerExpiryTime"
                type="datetime-local"
                value={formData.sellerExpiryTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isListingTicket} className="w-full">
              {isListingTicket ? 'Listing Ticket...' : 'List Ticket'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 
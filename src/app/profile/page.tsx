'use client';

import { useWallet } from '@/hooks/useWallet';
import { useContract } from '@/hooks/useContract';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatEther } from 'viem';

export default function ProfilePage() {
  const { address, isConnected } = useWallet();
  const { 
    sellerTickets, 
    isLoadingSellerTickets,
    userBids,
    isLoadingUserBids,
    ticketBids,
    isLoadingTicketBids
  } = useContract();

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h1>
          <p className="text-gray-600">You need to connect your wallet to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Your Tickets</TabsTrigger>
          <TabsTrigger value="bids">Your Bids</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingSellerTickets ? (
              <p>Loading your tickets...</p>
            ) : sellerTickets?.length === 0 ? (
              <p>You haven't listed any tickets yet.</p>
            ) : (
              sellerTickets?.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <CardTitle>Ticket #{ticket.id}</CardTitle>
                    <CardDescription>
                      <div className="space-y-2">
                        <p>Event: {ticket.eventDetails}</p>
                        <p>Minimum Bid: {formatEther(ticket.minBid)} ETH</p>
                        <p>Status: {ticket.sold ? 'Sold' : 'Available'}</p>
                        <p>Bid Expiry: {new Date(Number(ticket.bidExpiryTime) * 1000).toLocaleString()}</p>
                        <p>Seller Expiry: {new Date(Number(ticket.sellerExpiryTime) * 1000).toLocaleString()}</p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!ticket.sold && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Current Bids:</h3>
                        {isLoadingTicketBids ? (
                          <p>Loading bids...</p>
                        ) : (
                          ticketBids?.[ticket.id]?.map((bid, index) => (
                            <div key={index} className="text-sm">
                              <p>Bidder: {bid.bidder}</p>
                              <p>Amount: {formatEther(bid.amount)} ETH</p>
                              <p>Time: {new Date(Number(bid.timestamp) * 1000).toLocaleString()}</p>
                              <p>Status: {bid.isActive ? 'Active' : bid.isAccepted ? 'Accepted' : 'Rejected'}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bids">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingUserBids ? (
              <p>Loading your bids...</p>
            ) : userBids?.length === 0 ? (
              <p>You haven't placed any bids yet.</p>
            ) : (
              userBids?.map((bid, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Bid on Ticket #{bid.ticketId}</CardTitle>
                    <CardDescription>
                      <div className="space-y-2">
                        <p>Amount: {formatEther(bid.amount)} ETH</p>
                        <p>Time: {new Date(Number(bid.timestamp) * 1000).toLocaleString()}</p>
                        <p>Status: {bid.isActive ? 'Active' : bid.isAccepted ? 'Accepted' : 'Rejected'}</p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
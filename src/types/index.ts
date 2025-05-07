export interface Event {
  id: string;
  title: string;
  imageUrl: string;
  likes: string;
  date?: string;
  location?: string;
  description?: string;
  price?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Filter {
  location?: string;
  date?: string;
  category?: string;
}

export interface User {
  fid: number | null;
  fname: string | null;
  wallet: string | null;
}

export type Ticket = {
  id: number; // uint256
  seller: string; // Ethereum address
  sellerFID: number;
  eventName: string;
  eventDetails: string;
  eventLocation: number;
  ticketImage: string;
  minBid: bigint; // Use BigInt for uint256 values
  sold: boolean;
  buyer: string; // Ethereum address
  buyerFID: number;
  bidExpiryTime: number; // Timestamp in seconds (or bigint if needed)
  sellerExpiryTime: number;
  isHighestBidderFound: boolean;
};

export type CreateTicketInput = {
  eventDetails: string;
  minBid: bigint;
  bidExpiryTime: number; // Unix timestamp
  sellerExpiryTime: number; // Unix timestamp
};

export type Bid = {
  ticketId: number;
  bidder: string;
  amount: bigint;
  timestamp: number;
};

export type TicketStatus = "available" | "sold" | "expired" | "refunded";

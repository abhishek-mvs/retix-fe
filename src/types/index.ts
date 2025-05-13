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
  eventLocation: string;
  eventDate: number;
  ticketImage: string;
  minBid: bigint; // Use BigInt for uint256 values
  sold: boolean;
  buyer: string; // Ethereum address
  buyerFID: number;
  bidExpiryTime: number; // Timestamp in seconds (or bigint if needed)
  sellerExpiryTime: number;
  isHighestBidderFound: boolean;
  status: bigint; // 0: active, 1: pending, 2: completed, 3: notSold
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
  timestamp: bigint;
  isActive: boolean;
  isAccepted: boolean;
};

export type TicketStatus = "active" | "pending" | "completed" | "notSold";

export const TICKET_STATUS_MAP: Record<number, TicketStatus> = {
  0: "active",
  1: "pending",
  2: "completed",
  3: "notSold"
} as const;

// Helper function to convert BigInt status to string
export const getTicketStatusString = (status: bigint): TicketStatus => {
  return TICKET_STATUS_MAP[Number(status)] || "active";
};

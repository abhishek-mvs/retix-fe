import { Ticket } from "@/types";

export const filterActiveTickets = (tickets: Ticket[]): Ticket[] => {
  return tickets.filter(ticket => ticket.status === BigInt(0)); // active
};

export const filterPendingTickets = (tickets: Ticket[]): Ticket[] => {
  return tickets.filter(ticket => ticket.status === BigInt(1)); // pending
};

export const filterPastTickets = (tickets: Ticket[]): Ticket[] => {
  return tickets.filter(ticket => 
    ticket.status === BigInt(2) || ticket.status === BigInt(3)
  ); // completed or notSold
};

export const filterPastAndPendingTickets = (tickets: Ticket[]): Ticket[] => {
  return tickets.filter(ticket => 
    ticket.status === BigInt(1) || ticket.status === BigInt(2) || ticket.status === BigInt(3)
  ); // completed or notSold
};

export const filterCompletedTickets = (tickets: Ticket[]): Ticket[] => {
  return tickets.filter(ticket => ticket.status === BigInt(2)); // completed
};

export const filterNotSoldTickets = (tickets: Ticket[]): Ticket[] => {
  return tickets.filter(ticket => ticket.status === BigInt(3)); // notSold
};

// Helper function to get tickets by type
export const getTicketsByType = (tickets: Ticket[], type: "active" | "pending" | "past" | "completed" | "notSold"): Ticket[] => {
  switch (type) {
    case "active":
      return filterActiveTickets(tickets);
    case "pending":
      return filterPendingTickets(tickets);
    case "past":
      return filterPastTickets(tickets);
    case "completed":
      return filterCompletedTickets(tickets);
    case "notSold":
      return filterNotSoldTickets(tickets);
    default:
      return tickets;
  }
}; 
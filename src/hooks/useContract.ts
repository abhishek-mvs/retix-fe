import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { parseEther } from 'viem';

// Contract address - replace with your deployed contract address
const CONTRACT_ADDRESS = '0x...'; // TODO: Replace with actual contract address

// Import the ABI from a separate file
import { contractABI } from '@/lib/contractABI';

export function useContract() {
  // Read functions
  const { data: allTickets, isLoading: isLoadingTickets } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getAllTickets',
  });

  const { data: sellerTickets, isLoading: isLoadingSellerTickets } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getSellerTickets',
  });

  const { data: userBids, isLoading: isLoadingUserBids } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getUserBids',
  });

  const { data: ticketBids, isLoading: isLoadingTicketBids } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getTicketBids',
  });

  const { data: ticketVerificationStatus, isLoading: isLoadingVerificationStatus } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getTicketVerificationStatus',
  });

  // Write functions
  const { config: listTicketConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'listTicket',
  });

  const { write: listTicket, isLoading: isListingTicket } = useContractWrite(listTicketConfig);

  const { config: placeBidConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'placeBid',
  });

  const { write: placeBid, isLoading: isPlacingBid } = useContractWrite(placeBidConfig);

  const { config: verifyTicketConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'verifyTicket',
  });

  const { write: verifyTicket, isLoading: isVerifyingTicket } = useContractWrite(verifyTicketConfig);

  const { config: confirmDeliveryConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'confirmTicketDelivery',
  });

  const { write: confirmDelivery, isLoading: isConfirmingDelivery } = useContractWrite(confirmDeliveryConfig);

  return {
    // Read functions
    allTickets,
    isLoadingTickets,
    sellerTickets,
    isLoadingSellerTickets,
    userBids,
    isLoadingUserBids,
    ticketBids,
    isLoadingTicketBids,
    ticketVerificationStatus,
    isLoadingVerificationStatus,

    // Write functions
    listTicket: (details: string, sellerFID: number, minBid: string, bidExpiryTime: number, sellerExpiryTime: number) => {
      return listTicket?.({
        args: [details, sellerFID, parseEther(minBid), bidExpiryTime, sellerExpiryTime],
      });
    },
    isListingTicket,

    placeBid: (ticketId: number, bidAmount: string) => {
      return placeBid?.({
        args: [ticketId, parseEther(bidAmount)],
      });
    },
    isPlacingBid,

    verifyTicket: (ticketId: number) => {
      return verifyTicket?.({
        args: [ticketId],
      });
    },
    isVerifyingTicket,

    confirmDelivery: (ticketId: number, success: boolean) => {
      return confirmDelivery?.({
        args: [ticketId, success],
      });
    },
    isConfirmingDelivery,
  };
} 
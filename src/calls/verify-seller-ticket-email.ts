import { Proof } from "@reclaimprotocol/js-sdk";
import { createPrivateBookingHash } from "@/utils/hash";

interface BestBid {
  email: string;
  amount: bigint;
}

async function resolveShortUrl(shortUrl: string): Promise<{ bookingId: string | null; transactionId: string | null } | null> {
  try {
    const response = await fetch(`/api/resolve-url?url=${encodeURIComponent(shortUrl)}`);
    if (!response.ok) {
      throw new Error('Failed to resolve URL');
    }
    const data = await response.json();
    return {
      bookingId: data.bookingId,
      transactionId: data.transactionId
    };
  } catch (error) {
    console.error('Error resolving short URL:', error);
    return null;
  }
}

export async function verifySellerTicketEmail(
  proof: Proof, 
  bestBid: BestBid,
  privateBookingHash: string
): Promise<boolean> {
  try {
    // Parse the context string to get the extracted parameters
    const contextData = JSON.parse(proof.claimData.context);
    
    // Extract email from the context data's extractedParameters
    const proofEmail = contextData.extractedParameters?.email;
    const content = contextData.extractedParameters?.snippet;
    
    if (!proofEmail) {
      console.error('No email found in verification proof');
      return false;
    }

    let bookingId: string | null = null;
    let transactionId: string | null = null;

    // Extract bookingID and transactionID from the content
    if (content) {
      // First try to find the full URL pattern
      const fullUrlMatch = content.match(/https:\/\/in\.bookmyshow\.com\/booking-details\?.*?bookingID=([^&]+).*?transactionID=(\d+)/);
      
      if (fullUrlMatch) {
        [, bookingId, transactionId] = fullUrlMatch;
      } else {
        // If full URL not found, look for the short URL
        const shortUrlMatch = content.match(/https:\/\/bmsurl\.co\/[^/\s]+\/[^/\s]+/);
        if (shortUrlMatch) {
          const shortUrl = shortUrlMatch[0];
          const resolvedData = await resolveShortUrl(shortUrl);
          if (resolvedData) {
            bookingId = resolvedData.bookingId;
            transactionId = resolvedData.transactionId;
          }
        }
      }
    }

    // Verify both email and booking details
    const isEmailValid = proofEmail.toLowerCase() === bestBid.email.toLowerCase();
    
    // If we have booking details, verify the hash
    let isBookingValid = false;
    if (bookingId && transactionId) {
      const secret = process.env.NEXT_PUBLIC_BMS_SECRET || '';
      const calculatedHash = createPrivateBookingHash(secret, bookingId, transactionId);
      console.log("Calculated hash:", calculatedHash);
      console.log("Private booking hash:", privateBookingHash);
      isBookingValid = calculatedHash === privateBookingHash;
    }
    
    return isEmailValid && isBookingValid;
  } catch (error) {
    console.error('Error verifying seller ticket email:', error);
    return false;
  }
}

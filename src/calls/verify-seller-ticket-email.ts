import { Proof } from "@reclaimprotocol/js-sdk";

interface BestBid {
  email: string;
  amount: bigint;
}

async function resolveShortUrl(shortUrl: string): Promise<string | null> {
  try {
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'follow'
    });
    
    // Get the final URL after all redirects
    const finalUrl = response.url;
    return finalUrl;
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
    console.log("Parsed context data:", JSON.stringify(contextData, null, 2));
    
    // Extract email from the context data's extractedParameters
    const proofEmail = contextData.extractedParameters?.email;
    const content = contextData.extractedParameters?.snippet;
    console.log("Extracted email from proof:", proofEmail);
    console.log("Expected email from best bid:", bestBid.email);
    console.log("Private booking hash:", privateBookingHash);
    console.log("Content:", content);
    
    if (!proofEmail) {
      console.error('No email found in verification proof');
      return false;
    }

    // Extract bookingID and transactionID from the content
    if (content) {
      // First try to find the full URL pattern
      const fullUrlMatch = content.match(/https:\/\/in\.bookmyshow\.com\/booking-details\?.*?bookingID=([^&]+).*?transactionID=(\d+)/);
      
      if (fullUrlMatch) {
        const [, bookingID, transactionID] = fullUrlMatch;
        console.log("Found bookingID:", bookingID);
        console.log("Found transactionID:", transactionID);
      } else {
        // If full URL not found, look for the short URL
        const shortUrlMatch = content.match(/https:\/\/bmsurl\.co\/[^/\s]+/);
        if (shortUrlMatch) {
          const shortUrl = shortUrlMatch[0];
          console.log("Found short URL:", shortUrl);
          
          // Resolve the short URL
          const finalUrl = await resolveShortUrl(shortUrl);
          if (finalUrl) {
            console.log("Resolved URL:", finalUrl);
            
            // Extract bookingID and transactionID from the resolved URL
            const resolvedUrlMatch = finalUrl.match(/bookingID=([^&]+).*?transactionID=(\d+)/);
            if (resolvedUrlMatch) {
              const [, bookingID, transactionID] = resolvedUrlMatch;
              console.log("Found bookingID from resolved URL:", bookingID);
              console.log("Found transactionID from resolved URL:", transactionID);
            }
          }
        }
      }
    }
    
    // Compare with the winner's email from best bid
    const isValid = proofEmail.toLowerCase() === bestBid.email.toLowerCase();
    console.log("Email verification result:", isValid);
    
    return isValid;
  } catch (error) {
    console.error('Error verifying seller ticket email:', error);
    return false;
  }
}

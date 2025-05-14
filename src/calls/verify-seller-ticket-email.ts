import { Proof } from "@reclaimprotocol/js-sdk";

interface BestBid {
  email: string;
  amount: bigint;
}

export function verifySellerTicketEmail(
  proof: Proof, 
  bestBid: BestBid,
  privateBookingHash: string
): boolean {
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
    
    // Compare with the winner's email from best bid
    const isValid = proofEmail.toLowerCase() === bestBid.email.toLowerCase();
    console.log("Email verification result:", isValid);
    
    return isValid;
  } catch (error) {
    console.error('Error verifying seller ticket email:', error);
    return false;
  }
}

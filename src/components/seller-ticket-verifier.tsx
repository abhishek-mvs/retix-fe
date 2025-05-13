import { useEffect, useState, useCallback } from "react";
import QRCode from "react-qr-code";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import {
  TICKET_VERIFIER_PROVIDER_ID,
  RECLAIM_APP_ID,
  RECLAIM_APP_SECRET,
} from "@/data/constants";
import { useBestBid } from "@/calls/get-best-bid";
import { formatEther } from "ethers";

interface Proof {
  claimData: {
    context: string;
  };
}

interface SellerTicketVerifierQRProps {
  onVerified?: (proof: Proof) => void;
  ticketId: number;
}

// Initialize Reclaim SDK outside the component
const initializeReclaimSDK = async () => {
  return await ReclaimProofRequest.init(
    RECLAIM_APP_ID,
    RECLAIM_APP_SECRET,
    TICKET_VERIFIER_PROVIDER_ID
  );
};

function SellerTicketVerifierQR({ onVerified, ticketId }: SellerTicketVerifierQRProps) {
  const [requestUrl, setRequestUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [verificationProof, setVerificationProof] = useState<Proof | null>(null);
  const { bestBid, loading: bidLoading, error: bidError } = useBestBid(ticketId);

  // Handle verification proof updates
  useEffect(() => {
    if (verificationProof && onVerified) {
      onVerified(verificationProof);
    }
  }, [verificationProof, onVerified]);

  const getVerificationReq = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use the external initialization function
      const reclaimProofRequest = await initializeReclaimSDK();
    
      // Generate the verification request URL
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      console.log("Request URL:", requestUrl);
      setRequestUrl(requestUrl);

      // Start listening for proof submissions
      await reclaimProofRequest.startSession({
        // Called when the user successfully completes the verification
        onSuccess: (proofs) => {
          if (proofs) {
            if (typeof proofs === "string") {
              // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
              console.log("SDK Message:", proofs);
            } else if (typeof proofs !== "string") {
              // When using the default callback url, we get a proof object in the response
              if (Array.isArray(proofs)) {
                // when using provider with multiple proofs, we get an array of proofs
                console.log(
                  "Verification success",
                  JSON.stringify(proofs.map((p) => p.claimData.context))
                );
                setVerificationProof(proofs[0]);
              } else {
                // when using provider with a single proof, we get a single proof object
                console.log("Verification success", proofs?.claimData.context);
                setVerificationProof(proofs as Proof);
              }
            }
          }
        },
        // Called if there's an error during verification
        onError: (error) => {
          console.error("Verification failed", error);
        },
      });
    } catch (error) {
      console.error("Error initializing verification:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getVerificationReq();
  }, [getVerificationReq]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Verify Ticket #{ticketId}</h2>
      
      {bidLoading ? (
        <div className="flex items-center justify-center h-12 w-full mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        </div>
      ) : bidError ? (
        <p className="text-red-500 mb-4">Error loading bid information</p>
      ) : bestBid ? (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm w-full">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Winner's Email:</span> {bestBid.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Amount to Receive:</span> {formatEther(bestBid.amount)} ETH
          </p>
        </div>
      ) : null}

      <p className="text-gray-600 mb-6">Scan this QR code with your phone to verify your ticket details</p>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : requestUrl ? (
        <>
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <QRCode value={requestUrl} size={256} />
          </div>
          <p className="text-gray-600 mb-2">Or use this link to verify your ticket:</p>
          <a 
            href={requestUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 underline font-medium"
          >
            Verify Ticket
          </a>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 w-full">
          <p className="text-red-500">Failed to generate verification QR code</p>
        </div>
      )}
    </div>
  );
}

export default SellerTicketVerifierQR; 
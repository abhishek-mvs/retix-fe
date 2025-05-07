import { useEffect, useState, useCallback } from "react";
import QRCode from "react-qr-code";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import {
  PROVIDER_ID,
  RECLAIM_APP_ID,
  RECLAIM_APP_SECRET,
} from "@/data/constants";

interface Proof {
  claimData: {
    context: string;
  };
}

function TicketVerfierQR({ onVerified }: { onVerified?: (proof: Proof) => void }) {
  // State to store the verification request URL
  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState<string[]>([]);

  const getVerificationReq = useCallback(async () => {
    // Initialize the Reclaim SDK with your credentials
    const reclaimProofRequest = await ReclaimProofRequest.init(
      RECLAIM_APP_ID,
      RECLAIM_APP_SECRET,
      PROVIDER_ID
    );
  
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
            setProofs([proofs]);
            if (onVerified) onVerified({ claimData: { context: proofs } });
          } else if (typeof proofs !== "string") {
            // When using the default callback url, we get a proof object in the response
            if (Array.isArray(proofs)) {
              // when using provider with multiple proofs, we get an array of proofs
              console.log(
                "Verification success",
                JSON.stringify(proofs.map((p) => p.claimData.context))
              );
              if (onVerified) onVerified(proofs[0]);
            } else {
              // when using provider with a single proof, we get a single proof object
              console.log("Verification success", proofs?.claimData.context);
              if (onVerified) onVerified(proofs as Proof);
            }
          }
        }
      },
      // Called if there's an error during verification
      onError: (error) => {
        console.error("Verification failed", error);
      },
    });
  }, [onVerified]);

  useEffect(() => {
    getVerificationReq();
  }, [getVerificationReq]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Add Your Ticket</h2>
      <p className="text-gray-600 mb-6">Scan this QR code with your phone to verify your ticket details</p>
      
      {requestUrl ? (
        <>
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <QRCode value={requestUrl} size={256} />
          </div>
          <p className="text-gray-600 mb-2">Or use this link to add your ticket:</p>
          <a 
            href={requestUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 underline font-medium"
          >
            Verify and Add Ticket
          </a>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 w-full">
          <p className="text-gray-500">Preparing verification...</p>
        </div>
      )}
    </div>
  );
}

export default TicketVerfierQR;

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Proof, ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import {
  PROVIDER_ID,
  RECLAIM_APP_ID,
  RECLAIM_APP_SECRET,
} from "@/data/constants";

function TicketVerfierQR() {
  // State to store the verification request URL
  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState<string[]>([]);

  useEffect(() => {
    getVerificationReq();
  }, []);

  const getVerificationReq = async () => {
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
          } else if (typeof proofs !== "string") {
            // When using the default callback url, we get a proof object in the response
            if (Array.isArray(proofs)) {
              // when using provider with multiple proofs, we get an array of proofs
              console.log(
                "Verification success",
                JSON.stringify(proofs.map((p) => p.claimData.context))
              );
              // setProofs(proofs);
            } else {
              // when using provider with a single proof, we get a single proof object
              console.log("Verification success", proofs?.claimData.context);
              // setProofs(proofs);
            }
          }
        }
        // Add your success logic here, such as:
        // - Updating UI to show verification success
        // - Storing verification status
        // - Redirecting to another page
      },
      // Called if there's an error during verification
      onError: (error) => {
        console.error("Verification failed", error);

        // Add your error handling logic here, such as:
        // - Showing error message to user
        // - Resetting verification state
        // - Offering retry options
      },
    });
  };

  return (
    <>
      {/* <button onClick={getVerificationReq}>Get Verification Request</button> */}
      {/* Display QR code when URL is available */}
      {requestUrl && (
        <>
          <div style={{ margin: "20px 0" }}>
            <QRCode value={requestUrl} />
          </div>
          <div>Or visit this link: {requestUrl}</div>
        </>
      )}
      {proofs && (
        <div>
          <h2>Verification Successful!</h2>
          <pre>{JSON.stringify(proofs, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default TicketVerfierQR;

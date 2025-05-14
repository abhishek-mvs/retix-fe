import { encodeAbiParameters } from "viem";
import { keccak256 } from "ethers";

export function createPrivateBookingHash(secret: string, bookingId: string, transactionId: string): string {
  const encoded = encodeAbiParameters(
    [
      { name: "secret", type: "string" },
      { name: "bookingId", type: "string" },
      { name: "transactionId", type: "string" },
    ],
    [secret, bookingId, transactionId]
  );
  return keccak256(encoded);
} 
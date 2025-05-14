import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log("pinataJwt", process.env.PINATA_JWT);
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: "coral-additional-weasel-96.mypinata.cloud"
    });
    console.log("pinata", pinata);
    const upload = await pinata.upload.public.file(file);
    const url = `https://coral-additional-weasel-96.mypinata.cloud/ipfs/${upload.cid}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 
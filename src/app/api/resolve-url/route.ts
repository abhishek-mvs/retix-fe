import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

async function getFinalUrl(url: string): Promise<{ url: string; content: string }> {
  let executablePath;
  
  if (process.env.NODE_ENV === 'development') {
    // For local development, use the system's Chrome
    executablePath = process.platform === 'darwin' 
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : process.platform === 'win32'
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : '/usr/bin/google-chrome';
  } else {
    // For production (Vercel), use the AWS Lambda Chrome
    executablePath = await chromium.executablePath();
  }

  const browser = await puppeteer.launch({
    args: process.env.NODE_ENV === 'development' 
      ? [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
        ]
      : chromium.args,
    defaultViewport: { width: 1280, height: 800 },
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    page.setDefaultNavigationTimeout(60000);

    await page.setRequestInterception(true);
    page.on('request', (request) => request.continue());

    const response = await page.goto(url, { 
      waitUntil: ['domcontentloaded', 'networkidle2'],
      timeout: 60000 
    });

    if (!response) {
      throw new Error('No response received from the page');
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    const finalUrl = page.url();
    
    if (finalUrl.includes('bmsurl.co')) {
      const content = await page.content();
      const redirectMatch = content.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
      
      if (redirectMatch) {
        const redirectUrl = redirectMatch[1];
        await page.goto(redirectUrl, { waitUntil: ['domcontentloaded', 'networkidle2'] });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    const content = await page.content();
    return { url: page.url(), content };
  } catch (error) {
    console.error('Puppeteer error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const { url: finalUrl } = await getFinalUrl(url);
    const urlParams = new URL(finalUrl).searchParams;
    const bookingId = urlParams.get('bookingID');
    const transactionId = urlParams.get('transactionID');

    console.log('Extracted bookingId:', bookingId);
    console.log('Extracted transactionId:', transactionId);

    return NextResponse.json({ 
      bookingId,
      transactionId
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to resolve URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
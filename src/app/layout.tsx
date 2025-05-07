import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Providers } from "@/components/providers";
// import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ticket Marketplace",
  description: "Find and buy tickets for your favorite events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* <ThemeProvider attribute="class" defaultTheme="light"> */}
          {children}
          <Toaster />
          {/* </ThemeProvider> */}
        </Providers>
      </body>
    </html>
  );
}

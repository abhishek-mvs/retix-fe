import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
// import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>ReTix</title>

        <meta
          name="description"
          content="Offload your tickets the smart way. Sell unwanted tickets quickly and securely to thousands of buyers."
        />

        <link rel="icon" href="/short-logo.svg" />
      </head>
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

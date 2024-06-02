import { ReactNode } from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
// import NextTopLoader from 'nextjs-toploader'
import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";

// import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CEMI",
  description: "Website voor leerlingen in te schrijven",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="nl" className={`${GeistSans.className}`} suppressHydrationWarning>
      <body>
        {/* <NextTopLoader showSpinner={false} height={2} color="#e18438" /> */}
        <ThemeProvider>
          {children}
          {/* <Toaster /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}

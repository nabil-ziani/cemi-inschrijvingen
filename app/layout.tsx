import { ReactNode } from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

// import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CEMI",
  description: "Website voor leerlingen in te schrijven",
  // icons: {
  //   icon:
  // }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="nl" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

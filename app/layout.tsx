import { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

import { Poppins } from "next/font/google";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "CEMI",
  description: "Website voor leerlingen in te schrijven",
};

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="nl" className={`${poppins.className}`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
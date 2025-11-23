// ABOUTME: Root layout component for Sloppedin application
// ABOUTME: Provides HTML structure, metadata, and global styles

import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "Sloppedin - AI LinkedIn Post Generator",
  description: "Turn ArXiv papers into viral LinkedIn posts using local AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}

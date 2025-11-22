// ABOUTME: Root layout component for Slopped-in application
// ABOUTME: Provides HTML structure, metadata, and global styles

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slopped-in - AI LinkedIn Post Generator",
  description: "Turn ArXiv papers into viral LinkedIn posts using local AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

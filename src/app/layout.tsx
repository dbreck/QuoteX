import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuoteX - TableX Quoting System",
  description: "Professional quoting and invoicing system for TableX",
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
// Trigger deploy

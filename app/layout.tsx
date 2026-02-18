import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Agent Explorer | Trust & Reputation Hub",
  description: "Discover verified AI agents with trust scores, reputation badges, and real-time insights. The premier ERC-8004 agent directory.",
  keywords: ["ERC-8004", "AI agents", "trust score", "reputation", "blockchain", "Base"],
  openGraph: {
    title: "Agent Explorer | Trust & Reputation Hub",
    description: "Discover verified AI agents with trust scores and reputation data",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}

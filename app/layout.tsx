import type { Metadata } from "next";
import { Inter, Syne, Syne_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  preload: true
});

const syneMono = Syne_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-syne-mono",
  display: "swap",
  preload: true
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://surplus.ng"),
  title: "Surplus — Fresh Food. Better Prices. Less Waste.",
  description:
    "Join the Surplus waitlist for near-expiry, near spoilage, and surplus food deals from Nigerian vendors.",
  openGraph: {
    title: "Surplus — Fresh Food. Better Prices. Less Waste.",
    description:
      "Food and edible products should be sold in time, not wasted. Join the Surplus waitlist.",
    images: [{ url: "/og.svg", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Surplus — Fresh Food. Better Prices. Less Waste.",
    description:
      "Join the Surplus waitlist for discounted food and edible products nearby.",
    images: ["/og.svg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${syneMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

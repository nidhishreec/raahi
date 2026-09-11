import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raahi — A Tale of Food",
  description: "Celebrating the flavors of India in JP Nagar, Bengaluru",
  openGraph: {
    title: "Raahi — A Tale of Food",
    description: "Celebrating the flavors of India in JP Nagar, Bengaluru",
    url: "https://raahi-jade.vercel.app",
    siteName: "Raahi Bengaluru",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
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
  title: "Domain Redirecting Service hassle-free - redirect.lazyweb.rocks",
  description: "Get peace of mind when redirecting your domains without the burden of hosting them. We are a domain redirect service with full HTTPS support and API compatibility. Enter your domain names and we'll take care of the rest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} dark ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

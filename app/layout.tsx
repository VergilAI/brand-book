import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Vergil Learn - AI-Powered Personalized Learning",
  description: "Transform your workforce with AI-powered personalized learning. Create custom training paths, track progress, and improve outcomes with Vergil Learn.",
  keywords: "AI learning, personalized training, workforce development, enterprise learning, Vergil, AI education, corporate training, learning analytics",
  authors: [{ name: "Vergil AI" }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "Vergil Learn - AI-Powered Personalized Learning",
    description: "Transform your workforce with AI-powered personalized learning. Create custom training paths, track progress, and improve outcomes.",
    type: "website",
    locale: "en_US",
    siteName: "Vergil Learn",
    url: "https://learn.vergil.ai",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vergil Learn - Transform Your Workforce',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vergil Learn - AI-Powered Personalized Learning",
    description: "Transform your workforce with AI-powered personalized learning. Create custom training paths, track progress, and improve outcomes.",
    images: ['/og-image.png'],
    creator: "@VergilAI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#6366F1',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

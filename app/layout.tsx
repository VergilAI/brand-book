import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Vergil Learn | AI-Powered Enterprise Learning Platform | Personalized Employee Training",
    template: "%s | Vergil Learn - Transform Your Workforce with AI"
  },
  description: "Revolutionize employee training with Vergil Learn's AI-powered learning platform. Create personalized learning paths, boost engagement by 85%, reduce training time by 60%, and track ROI with advanced analytics. Transform your workforce development today.",
  keywords: "AI learning platform, enterprise learning management system, personalized employee training, corporate training software, workforce development platform, AI-powered LMS, employee upskilling, learning analytics, training ROI, adaptive learning technology, corporate education platform, skill gap analysis, employee development software, AI training solutions, learning experience platform, enterprise training automation, workforce transformation, digital learning platform, corporate learning solutions, employee engagement platform",
  authors: [{ name: "Vergil AI" }],
  generator: "Next.js",
  applicationName: "Vergil Learn",
  referrer: "origin-when-cross-origin",
  creator: "Vergil AI",
  publisher: "Vergil AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vergilai.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-bold.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Vergil Learn - AI-Powered Enterprise Learning Platform | Transform Employee Training",
    description: "Boost employee engagement by 85% and reduce training time by 60% with Vergil Learn's AI-powered personalized learning platform. Create custom training paths, track progress, and measure ROI with advanced analytics.",
    type: "website",
    locale: "en_US",
    siteName: "Vergil Learn",
    url: "https://vergilai.com",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vergil Learn - AI-Powered Enterprise Learning Platform',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'Vergil Learn - Transform Your Workforce with AI',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vergil Learn - AI-Powered Enterprise Learning Platform",
    description: "Transform employee training with AI. Boost engagement by 85%, reduce training time by 60%. Personalized learning paths, advanced analytics, proven ROI.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366F1' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  manifest: '/manifest.json',
  category: 'technology',
  classification: 'Business Software',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Vergil Learn',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered enterprise learning platform that creates personalized training paths, boosts engagement, and tracks ROI with advanced analytics.',
    url: 'https://vergilai.com',
    creator: {
      '@type': 'Organization',
      name: 'Vergil AI',
      url: 'https://www.vergilai.com',
      logo: 'https://vergilai.com/logos/vergil-logo.png',
      sameAs: [
        'https://www.linkedin.com/company/103983727',
      ],
    },
    featureList: [
      'AI-Powered Personalization',
      'Real-Time Analytics Dashboard',
      'Custom Learning Paths',
      'Progress Tracking',
      'ROI Measurement',
      'Multi-Format Content Support',
      'Enterprise Integration',
      'Advanced Reporting',
    ],
    screenshot: 'https://vergilai.com/og-image.png',
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vergil AI',
    url: 'https://www.vergilai.com',
    logo: 'https://vergilai.com/logos/vergil-logo.png',
    description: 'Leading AI-powered enterprise learning platform provider',
    email: 'botond.varga@vergilai.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'United Kingdom',
    },
    sameAs: [
      'https://www.linkedin.com/company/103983727',
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://vergilai.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Vergil Learn Platform',
        item: 'https://vergilai.com/vergil-learn',
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DocsLayout } from "@/components/docs/docs-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Vergil Design System",
  description: "A living design system for AI orchestration platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DocsLayout>{children}</DocsLayout>
      </body>
    </html>
  );
}

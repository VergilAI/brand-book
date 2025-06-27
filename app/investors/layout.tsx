import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vergil AI - Investor Portal",
  description: "Financial health dashboard for Vergil AI stakeholders",
};

export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
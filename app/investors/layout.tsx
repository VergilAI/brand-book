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
  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space to-deep-space/90">
      <div className="bg-gradient-to-b from-cosmic-purple/5 to-transparent">
        {children}
      </div>
    </div>
  );
}
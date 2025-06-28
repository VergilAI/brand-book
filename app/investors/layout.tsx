import { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Vergil AI - Investor Portal",
  description: "Financial health dashboard for Vergil AI stakeholders",
  manifest: "/investors/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vergil Investors",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "Vergil Investors",
    "apple-mobile-web-app-title": "Vergil Investors",
    "theme-color": "#6366F1",
    "msapplication-navbutton-color": "#6366F1",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-starturl": "/investors",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function InvestorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Register Service Worker */}
      <Script
        id="register-sw"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/investors-sw.js').then(
                  (registration) => console.log('Investors SW registered:', registration),
                  (error) => console.log('Investors SW registration failed:', error)
                );
              });
            }
          `,
        }}
      />
    </>
  );
}
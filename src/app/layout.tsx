import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { siteData } from "@/data/site";

const siteUrl = "https://www.richardslandmanagementllc.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Land Clearing, Drainage & Tree Work in Greers Ferry, AR | Richards Property Management, LLC",
    template: "%s | Richards Property Management, LLC",
  },
  description:
    "Land clearing, tree work, drainage solutions, erosion control, retaining walls, hauling, welding, water features, and property maintenance around Greers Ferry Lake and Central Arkansas.",
  keywords: [
    "land clearing Greers Ferry AR",
    "tree work Greers Ferry AR",
    "tree removal Greers Ferry Lake",
    "drainage contractor Greers Ferry AR",
    "erosion control Central Arkansas",
    "retaining walls Greers Ferry Lake",
    "property services Greers Ferry Lake",
    "brush clearing Heber Springs AR",
    "property cleanup Fairfield Bay AR",
    "hauling services Central Arkansas",
    "driveway washout repair Arkansas",
    "Airbnb property maintenance Greers Ferry",
  ],
  authors: [{ name: siteData.name }],
  creator: siteData.name,
  publisher: siteData.name,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Land Clearing & Property Services in Greers Ferry Lake, AR",
    description:
      "Land clearing, drainage repair, erosion control, tree work, retaining walls, hauling, welding, and rural property services across the Greers Ferry Lake area.",
    url: siteUrl,
    siteName: siteData.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Richards Property Management land clearing and property work in Central Arkansas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Land Clearing & Property Services in Greers Ferry Lake, AR",
    description:
      "Land clearing, tree work, drainage, erosion control, and property services around Greers Ferry Lake and Central Arkansas.",
    images: ["/images/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import LeadChat from "@/components/lead-chat";\nimport GlobalClickTracker from "@/components/global-click-tracker";
import { siteData } from "@/data/site";
import { getSiteUrl } from "@/lib/site-url";

const headingFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arkansas Land Pros | Land Clearing, Dirt Work & Property Service Requests",
    template: "%s | Arkansas Land Pros",
  },
  description: siteData.description,
  keywords: [
    "Arkansas land clearing",
    "land clearing Arkansas",
    "Arkansas dirt work",
    "Arkansas forestry mulching",
    "Arkansas drainage contractor",
    "gravel driveway repair Arkansas",
    "culvert installation Arkansas",
    "property cleanup Arkansas",
    "Hot Springs land clearing",
    "Glenwood Arkansas land clearing",
    "Greers Ferry land clearing",
    "Arkadelphia dirt work",
  ],
  authors: [{ name: siteData.name }],
  creator: siteData.name,
  publisher: siteData.name,
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
  openGraph: {
    title: "Arkansas Land Pros",
    description: siteData.description,
    url: siteUrl,
    siteName: siteData.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Arkansas land and property work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arkansas Land Pros",
    description: siteData.description,
    images: ["/images/hero/hero.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#171a1d",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        {children}
        <LeadChat />
        <Analytics />
      </body>
    </html>
  );
}

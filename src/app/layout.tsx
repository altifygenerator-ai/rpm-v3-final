import type { Metadata } from "next";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const siteUrl = "https://richardslandmanagementllc.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Land Clearing, Drainage & Tree Work in Greers Ferry, AR | Richards Land Management LLC",
    template: "%s | Richards Land Management LLC",
  },

  description:
    "Land clearing, tree work, drainage solutions, erosion control, retaining walls, hauling, and rural property services across Greers Ferry Lake and Central Arkansas.",

  keywords: [
    // Primary SEO focus
    "land clearing Arkansas",
    "land clearing Greers Ferry",
    "tree work Arkansas",
    "tree removal Greers Ferry",
    "drainage contractor Arkansas",
    "erosion control Arkansas",
    "retaining walls Arkansas",

    // Local intent
    "land clearing Greers Ferry Lake",
    "tree removal Greers Ferry Lake",
    "drainage solutions Greers Ferry Lake",
    "property services Central Arkansas",
    "contractors near Greers Ferry Lake",

    // Long tail
    "how much does land clearing cost Arkansas",
    "yard drainage solutions Arkansas",
    "erosion repair Arkansas",
    "rural property cleanup Arkansas",
    "driveway washout repair Arkansas",

    // Secondary services
    "hauling services Arkansas",
    "welding and fabrication Arkansas",
    "property maintenance Arkansas",
  ],

  authors: [{ name: "Richards Land Management LLC" }],
  creator: "Richards Land Management LLC",
  publisher: "Richards Land Management LLC",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title:
      "Land Clearing & Drainage Services in Central Arkansas",
    description:
      "Land clearing, drainage solutions, erosion control, tree work, retaining walls, hauling, and rural property services across Greers Ferry Lake and Central Arkansas.",
    url: siteUrl,
    siteName: "Richards Land Management LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Land clearing and property services in Central Arkansas",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Land Clearing & Property Services in Central Arkansas",
    description:
      "Land clearing, tree work, drainage, erosion control, and rural property services across Greers Ferry Lake and Central Arkansas.",
    images: ["/images/og-cover.jpg"],
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
      <body className={`${bodyFont.variable} ${headingFont.variable} font-sans`}>
        
        <main>{children}</main>
       <Analytics />
      </body>
    </html>
  );
}
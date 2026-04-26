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
      "Richards Land Management LLC | Land Clearing & Property Services in Central Arkansas",
    template: "%s | Richards Land Management LLC",
  },

  description:
    "Richards Land Management LLC provides land clearing, tree work, drainage, erosion control, retaining walls, hauling, welding, water features, and property maintenance across Central Arkansas.",

 keywords: [
  
  "land clearing Central Arkansas",
  "tree removal Central Arkansas",
  "drainage solutions Arkansas",
  "erosion control Arkansas",
  "retaining walls Arkansas",
  "hauling services Arkansas",
  "welding and fabrication Arkansas",
  "property maintenance Central Arkansas",

 
  "land clearing Greers Ferry Lake",
  "tree removal Greers Ferry Lake",
  "excavation Greers Ferry Lake",
  "drainage contractors Greers Ferry Lake",
  "property maintenance Greers Ferry Lake",
  "contractors near Greers Ferry Lake",

  
  "land clearing near me",
  "tree removal near me",
  "excavation near me",
  "drainage contractor near me",
  "retaining wall builder near me",

  
  "how much does land clearing cost Arkansas",
  "yard drainage solutions near me",
  "fix erosion in yard Arkansas",
  "gravel driveway repair Arkansas",
  "property cleanup near me",

  
  "custom water features Arkansas",
  "pond and waterfall installation Arkansas",
  "Airbnb property maintenance Arkansas",
  "short term rental maintenance Arkansas",
],

  authors: [{ name: "Richards Land Management LLC" }],
  creator: "Richards Land Management LLC",
  publisher: "Richards Land Management LLC",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title:
      "Richards Land Management LLC | Land Clearing & Property Services",
    description:
      "Land clearing, tree work, drainage, erosion control, retaining walls, hauling, welding, water features, and property maintenance across Central Arkansas.",
    url: siteUrl,
    siteName: "Richards Land Management LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Richards Land Management LLC property work in Central Arkansas",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Richards Land Management LLC | Central Arkansas Land Services",
    description:
      "Local land clearing, tree work, drainage, erosion control, hauling, welding, and property maintenance services.",
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
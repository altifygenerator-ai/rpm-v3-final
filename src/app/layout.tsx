import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata = {
  title: "Richards Property Management | Land Clearing, Drainage, Tree Work, Hauling & Welding in Central Arkansas",
  description:
    "Professional land clearing, drainage solutions, tree removal, hauling, welding, and property services across Central Arkansas. Reliable, local, and equipped for residential and commercial projects.",
  
  keywords: [
    "land clearing Arkansas",
    "tree removal Arkansas",
    "drainage solutions",
    "erosion control",
    "hauling services",
    "welding services",
    "property management Arkansas",
    "outdoor builds",
    "retaining walls",
    "Central Arkansas contractors",
  ],

  authors: [{ name: "Richards Property Management" }],
  creator: "Richards Property Management",
  publisher: "Richards Property Management",

  openGraph: {
    title: "Richards Property Management | Land Services & Property Work in Central Arkansas",
    description:
      "Land clearing, drainage, tree work, hauling, welding, and custom outdoor builds. Serving residential and commercial clients across Central Arkansas.",
    url: "https://richardspropertymanagement.com",
    siteName: "Richards Property Management",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Richards Property Management - Land Services in Arkansas",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Richards Property Management | Land Clearing & Property Services",
    description:
      "Local experts in land clearing, drainage, tree work, hauling, welding, and outdoor builds in Central Arkansas.",
    images: ["/images/og-cover.jpg"],
  },

  alternates: {
    canonical: "https://richardspropertymanagement.com",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
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
      <body
        className={`${bodyFont.variable} ${headingFont.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
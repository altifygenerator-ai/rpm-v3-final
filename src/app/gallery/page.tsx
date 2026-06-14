import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import FullGalleryGrid from "@/components/full-gallery-grid";
import { siteData } from "@/data/site";

const baseUrl = "https://www.richardslandmanagementllc.com";

export const metadata: Metadata = {
  title: "Project Gallery | Land Clearing, Drainage & Property Work",
  description:
    "View project photos from Richards Property Management, LLC, including land clearing, drainage, tree work, retaining walls, welding, outdoor builds, and property cleanup around Greers Ferry Lake.",
  alternates: {
    canonical: `${baseUrl}/gallery`,
  },
  openGraph: {
    title: "Project Gallery | Richards Property Management, LLC",
    description:
      "Land clearing, drainage, tree work, retaining walls, outdoor builds, and property cleanup photos from the Greers Ferry Lake area.",
    url: `${baseUrl}/gallery`,
    images: ["/images/og-cover.png"],
  },
};

export default function GalleryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Richards Property Management, LLC Project Gallery",
    url: `${baseUrl}/gallery`,
    description:
      "Project photos from Richards Property Management, LLC showing land clearing, drainage, tree work, retaining walls, welding, outdoor builds, and property cleanup work near Greers Ferry Lake.",
    publisher: {
      "@type": "LocalBusiness",
      name: siteData.name,
      url: baseUrl,
    },
    about: siteData.primaryServices,
  };

  return (
    <>
      <SiteHeader />

      <main className="pt-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <FullGalleryGrid />
      </main>

      <SiteFooter />
    </>
  );
}

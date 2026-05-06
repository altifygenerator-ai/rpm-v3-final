import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import FullGalleryGrid from "@/components/full-gallery-grid";

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />

      <main className="pt-28">
        <FullGalleryGrid />
      </main>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Richards Land Management LLC Project Gallery",
      url: "https://www.richardslandmanagementllc.com/gallery",
      description:
        "Project photos from Richards Land Management LLC showing forestry mulching, land clearing, brush clearing, trail clearing, and property cleanup work near Greers Ferry, Arkansas.",
      publisher: {
        "@type": "LocalBusiness",
        name: "Richards Land Management LLC",
        url: "https://www.richardslandmanagementllc.com/",
      },
      about: [
        "Forestry mulching",
        "Land clearing",
        "Brush clearing",
        "Trail clearing",
        "Underbrush removal",
        "Property cleanup",
        "Greers Ferry Arkansas land services",
      ],
    }),
  }}
/>
      <SiteFooter />
    </>
  );
}
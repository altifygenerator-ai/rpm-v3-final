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

      <SiteFooter />
    </>
  );
}
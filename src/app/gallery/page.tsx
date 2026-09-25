import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import { stockImages } from "@/data/stock-images";

export const metadata: Metadata = {
  title: "Land & Property Work Across Arkansas",
  description:
    "See common land-clearing, dirt-work, grading, driveway, drainage, retaining-wall, cleanup, hauling, and property-work categories.",
  alternates: { canonical: "/gallery" },
};

const references = [
  { image: stockImages.landClearing, title: "Land clearing", href: "/services/land-clearing" },
  { image: stockImages.forestryMulching, title: "Forestry & wooded clearing", href: "/services/forestry-mulching" },
  { image: stockImages.brushClearing, title: "Brush clearing", href: "/services/brush-clearing" },
  { image: stockImages.dirtWork, title: "Dirt work", href: "/services/dirt-work" },
  { image: stockImages.grading, title: "Grading & leveling", href: "/services/grading-leveling" },
  { image: stockImages.drivewayRepair, title: "Driveway repair", href: "/services/driveway-repair" },
  { image: stockImages.culvert, title: "Culvert & drainage work", href: "/services/culvert-installation" },
  { image: stockImages.retaining, title: "Retaining & slope work", href: "/services/retaining-walls" },
  { image: stockImages.cleanup, title: "Property cleanup", href: "/services/cleanup" },
  { image: stockImages.hauling, title: "Hauling", href: "/services/hauling" },
  { image: stockImages.sitePrep, title: "Site preparation", href: "/services/site-prep" },
  { image: stockImages.lightDemolition, title: "Light demolition", href: "/services/light-demolition" },
];

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <VisualHero
          breadcrumbs={[{ href: "/", label: "Home" }, { label: "Project Types" }]}
          eyebrow="COMMON LAND PROJECTS"
          title="See the kinds of work Arkansas property owners need help with."
          description="Clearing, earthwork, access, drainage, cleanup, hauling, and the property jobs that often overlap several trades."
          image={stockImages.outdoorBuilds.src}
          imageAlt={stockImages.outdoorBuilds.alt}
          ctaHref="/contact"
          ctaLabel="Tell us what needs done"
        />

        <section className="index-layout">
          <div className="grid gap-px bg-[#aeb8be] md:grid-cols-2">
            {references.map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className="group relative min-h-[360px] overflow-hidden bg-[var(--iron)]"
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 border-l-[7px] border-[var(--clay)] p-5 text-white">
                  <strong className="font-[var(--font-heading)] text-3xl uppercase">
                    {item.title}
                  </strong>
                </div>
              </Link>
            ))}
          </div>
          <p className="stock-photo-note">
            Photography is representative stock imagery used to show common project types and property conditions.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { stockImages } from "@/data/stock-images";

export const metadata: Metadata = {
  title: "Arkansas Property Work Types & Visual Reference",
  description:
    "Visual examples of land clearing, dirt work, grading, driveways, drainage, retaining walls, cleanup, and other property-work categories.",
  alternates: { canonical: "/gallery" },
};

const references = [
  { image: stockImages.landClearing, title: "Land clearing & overgrowth", href: "/services/land-clearing" },
  { image: stockImages.drainage, title: "Drainage & earthwork", href: "/services/drainage-erosion" },
  { image: stockImages.grading, title: "Dirt work & grading", href: "/services/dirt-work" },
  { image: stockImages.retaining, title: "Retaining & slope work", href: "/services/retaining-walls" },
  { image: stockImages.cleanup, title: "Property cleanup & hauling", href: "/services/cleanup" },
  { image: stockImages.gravelRoad, title: "Gravel driveway work", href: "/services/gravel-driveways" },
  { image: stockImages.ruralRoad, title: "Rural property access", href: "/services/rural-property-prep" },
  { image: stockImages.welding, title: "Property welding & fabrication", href: "/services/welding" },
];

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Work Types" }]} />
          <p className="field-label field-label-light">VISUAL REFERENCE</p>
          <h1>The kinds of property work we can help you get started on.</h1>
          <p>
            These are stock reference photos showing common job types and property conditions,
            not a portfolio of completed Arkansas Land Pros projects.
          </p>
        </section>

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
                  <strong className="font-[var(--font-heading)] text-3xl uppercase">{item.title}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

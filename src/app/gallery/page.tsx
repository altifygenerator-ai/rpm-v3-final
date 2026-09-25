import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Arkansas Property Work Types & Visual Reference",
  description:
    "Visual examples of the kinds of land, drainage, dirt, clearing, retaining, hauling, and property conditions Arkansas Land Pros can accept as service requests.",
  alternates: { canonical: "/gallery" },
};

const references = [
  {
    src: "/images/services/land-clearing.jpg",
    title: "Land clearing & overgrowth",
    href: "/services/land-clearing",
  },
  {
    src: "/images/services/drainage-erosion.jpg",
    title: "Drainage & erosion",
    href: "/services/drainage-erosion",
  },
  {
    src: "/images/work/dirtwork.jpg",
    title: "Dirt work & grade",
    href: "/services/dirt-work",
  },
  {
    src: "/images/services/retaining-walls.jpg",
    title: "Retaining & slope work",
    href: "/services/retaining-walls",
  },
  {
    src: "/images/services/cleanup.jpg",
    title: "Property cleanup",
    href: "/services/cleanup",
  },
  {
    src: "/images/services/hauling.jpg",
    title: "Hauling & material movement",
    href: "/services/hauling",
  },
  {
    src: "/images/work/cleanrock.jpg",
    title: "Gravel & driveway work",
    href: "/services/gravel-driveways",
  },
  {
    src: "/images/services/tree-work.jpg",
    title: "Tree & brush work",
    href: "/services/tree-work",
  },
];

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Work Types" }]} />
          <p className="field-label field-label-light">VISUAL REFERENCE</p>
          <h1>The kinds of property problems this site is built around.</h1>
          <p>
            These images illustrate project categories and property conditions.
            They are not presented as a portfolio of work performed by Arkansas
            Land Pros itself.
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
                  src={item.src}
                  alt={item.title}
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
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import { guides } from "@/data/guides";
import { stockImages } from "@/data/stock-images";

export const metadata: Metadata = {
  title: "Arkansas Land & Property Guides",
  description:
    "Practical Arkansas property-owner guides for land clearing, forestry mulching, gravel driveways, drainage, culverts, homesite preparation, and hunting-property access.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <VisualHero
          breadcrumbs={[{ href: "/", label: "Home" }, { label: "Property Guides" }]}
          eyebrow="LANDOWNER GUIDES"
          title="Know what to look for before the equipment shows up."
          description="Straightforward guides for clearing, driveways, drainage, culverts, site prep, and rural-property work — written to help you describe the job and spot the details that matter."
          image={stockImages.drivewayRepair.src}
          imageAlt={stockImages.drivewayRepair.alt}
          ctaHref="/contact"
          ctaLabel="Have a project? Tell us about it"
        />

        <section className="index-layout">
          <div className="index-lines">
            {guides.map((guide) => (
              <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                <small>{guide.eyebrow}</small>
                <strong>{guide.title}</strong>
                <p>{guide.description}</p>
                <span>↗</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

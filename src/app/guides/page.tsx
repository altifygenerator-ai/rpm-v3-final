import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { guides } from "@/data/guides";

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
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Property Guides" }]} />
          <p className="field-label field-label-light">PROPERTY OWNER NOTES</p>
          <h1>Useful before-and-after-the-rain kind of information.</h1>
          <p>
            No filler articles written to hit a word count. These guides are
            built around the details that make land, driveway, drainage, and
            clearing conversations easier.
          </p>
        </section>

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

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import { services } from "@/data/services";
import { stockImages } from "@/data/stock-images";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Land Clearing, Dirt Work & Property Services in Arkansas",
  description:
    "Find help with land clearing, forestry mulching, dirt work, grading, gravel driveways, culverts, drainage, brush clearing, cleanup, hauling, and more across Arkansas.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const baseUrl = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Land and property services across Arkansas",
    url: `${baseUrl}/services`,
    description:
      "Land clearing, dirt work, drainage, driveways, brush clearing, cleanup, hauling, and related property services across Arkansas.",
  };

  return (
    <>
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <VisualHero
          breadcrumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
          eyebrow="LAND & PROPERTY SERVICES"
          title="Land clearing, dirt work, drainage, driveways & more."
          description="From overgrown acreage to washed-out driveways and drainage trouble, tell us what the property needs and we’ll help get the project in front of someone who can take a look."
          image={stockImages.generalProperty.src}
          imageAlt={stockImages.generalProperty.alt}
          ctaHref="/contact"
          ctaLabel="Tell us about the job"
        />

        <section className="index-layout">
          <div className="index-intro">
            <p className="field-label">WHAT DO YOU NEED DONE?</p>
            <div>
              <h2>Start with the job in front of you.</h2>
              <p>
                Pick the closest fit below. If the project crosses several
                categories, that is fine — describe the whole job and we can
                keep it together.
              </p>
            </div>
          </div>

          <div className="index-lines">
            {services.map((service) => (
              <Link
                href={`/services/${service.slug}`}
                key={service.slug}
                className="has-thumb"
              >
                <div className="index-thumb">
                  <Image
                    src={service.image}
                    alt={`${service.shortTitle} work`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <small>Arkansas</small>
                <strong>{service.shortTitle}</strong>
                <p>{service.summary}</p>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

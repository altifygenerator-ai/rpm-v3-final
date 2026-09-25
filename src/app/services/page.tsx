import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { services } from "@/data/services";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Land & Property Service Requests in Arkansas",
  description:
    "Browse Arkansas Land Pros request categories for land clearing, forestry mulching, dirt work, grading, driveways, culverts, drainage, brush clearing, cleanup, hauling, and more.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const baseUrl = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Arkansas land and property service request categories",
    url: `${baseUrl}/services`,
    description:
      "Service request categories for Arkansas land clearing, dirt work, drainage, driveways, brush, cleanup, hauling, and related property work.",
  };

  return (
    <>
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Services" }]} />
          <p className="field-label field-label-light">LAND WORK / PROPERTY WORK</p>
          <h1>Tell us the problem. We’ll sort the category.</h1>
          <p>
            These pages are built around the work Arkansas property owners
            actually search for — clearing, dirt, water, access, cleanup, and
            getting rough ground usable again.
          </p>
        </section>

        <section className="index-layout">
          <div className="index-intro">
            <div>
              <p className="field-label">REQUEST CATEGORIES</p>
            </div>
            <div>
              <h2>One place to start for the messy property jobs.</h2>
              <p>
                You do not need to diagnose the job before reaching out. Pick the
                closest fit, describe what the property looks like now, and say
                what you want changed.
              </p>
            </div>
          </div>

          <div className="index-lines">
            {services.map((service) => (
              <Link href={`/services/${service.slug}`} key={service.slug}>
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

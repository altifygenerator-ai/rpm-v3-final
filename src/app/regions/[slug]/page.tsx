import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import JobRequestForm from "@/components/job-request-form";
import { regions, regionBySlug } from "@/data/regions";
import { areaBySlug } from "@/data/areas";
import { coreServiceSlugs, serviceBySlug } from "@/data/services";
import { getSiteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return regions.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = regionBySlug.get(slug);
  if (!region) return {};

  return {
    title: `Land Clearing, Dirt Work & Property Services | ${region.name}`,
    description: `${region.summary} Focus areas include ${region.focus}`,
    alternates: { canonical: `/regions/${region.slug}` },
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params;
  const region = regionBySlug.get(slug);
  if (!region) notFound();

  const regionAreas = region.areaSlugs
    .map((areaSlug) => areaBySlug.get(areaSlug))
    .filter((area): area is NonNullable<typeof area> => Boolean(area));
  const coreServices = coreServiceSlugs
    .map((serviceSlug) => serviceBySlug.get(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const baseUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${region.name} land and property service requests`,
    url: `${baseUrl}/regions/${region.slug}`,
    description: region.summary,
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
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/areas", label: "Areas" },
              { label: region.name },
            ]}
          />
          <p className="field-label field-label-light">ARKANSAS REGIONAL HUB</p>
          <h1>{region.name} land & property requests</h1>
          <p>{region.summary}</p>
        </section>

        <section className="page-grid">
          <article className="page-copy">
            <h2>What this region is built to capture</h2>
            <p>{region.focus}</p>
            <p>
              The regional page connects town-level search intent with the
              broader service pages instead of creating hundreds of thin,
              interchangeable location pages.
            </p>

            <h2>Communities in this region</h2>
            <div className="link-board">
              {regionAreas.map((area) => (
                <Link href={`/areas/${area.slug}`} key={area.slug}>
                  <strong>{area.name}</strong>
                  <span>↗</span>
                </Link>
              ))}
            </div>

            <h2>Land-service categories</h2>
            <div className="link-board">
              {coreServices.map((service) => (
                <Link href={`/services/${service.slug}`} key={service.slug}>
                  <strong>{service.shortTitle}</strong>
                  <span>↗</span>
                </Link>
              ))}
            </div>
          </article>

          <aside className="page-aside">
            <JobRequestForm
              source={`region:${region.slug}`}
              heading={`Start a ${region.name} request.`}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

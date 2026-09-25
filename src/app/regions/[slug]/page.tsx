import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import JobRequestForm from "@/components/job-request-form";
import { regions, regionBySlug } from "@/data/regions";
import { areaBySlug } from "@/data/areas";
import { coreServiceSlugs, serviceBySlug } from "@/data/services";
import { imageForRegion } from "@/data/stock-images";

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
    description: `${region.summary} Common work includes ${region.focus}`,
    alternates: { canonical: `/regions/${region.slug}` },
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params;
  const region = regionBySlug.get(slug);
  if (!region) notFound();

  const heroImage = imageForRegion(region.name);
  const regionAreas = region.areaSlugs
    .map((areaSlug) => areaBySlug.get(areaSlug))
    .filter((area): area is NonNullable<typeof area> => Boolean(area));
  const coreServices = coreServiceSlugs
    .map((serviceSlug) => serviceBySlug.get(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  return (
    <>
      <SiteHeader />
      <main>
        <VisualHero
          breadcrumbs={[
            { href: "/", label: "Home" },
            { href: "/areas", label: "Areas" },
            { label: region.name },
          ]}
          eyebrow={`SERVING ${region.name.toUpperCase()}`}
          title={`Land clearing, dirt work & property services in ${region.name}`}
          description={region.summary}
          image={heroImage.src}
          imageAlt={heroImage.alt}
          ctaHref="#region-project"
          ctaLabel="Tell us about the job"
        />

        <section className="page-grid">
          <article className="page-copy">
            <h2>Property work across {region.name}</h2>
            <p>{region.focus}</p>
            <p>
              If the property falls between towns or out on a rural road, that
              is not a problem. Send the closest town, location, and a short
              description of what needs done.
            </p>

            <h2>Communities in this area</h2>
            <div className="link-board">
              {regionAreas.map((area) => (
                <Link href={`/areas/${area.slug}`} key={area.slug}>
                  <strong>{area.name}</strong>
                  <span>↗</span>
                </Link>
              ))}
            </div>

            <h2>Common land & property services</h2>
            <div className="link-board">
              {coreServices.map((service) => (
                <Link href={`/services/${service.slug}`} key={service.slug}>
                  <strong>{service.shortTitle}</strong>
                  <span>↗</span>
                </Link>
              ))}
            </div>
          </article>

          <aside className="page-aside" id="region-project">
            <JobRequestForm
              source={`region:${region.slug}`}
              heading={`Tell us about the job in ${region.name}.`}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

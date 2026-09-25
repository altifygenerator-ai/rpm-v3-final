import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import JobRequestForm from "@/components/job-request-form";
import PublicProStrip from "@/components/public-pro-strip";
import { areas, areaBySlug } from "@/data/areas";
import { coreServiceSlugs, serviceBySlug } from "@/data/services";
import { localLandings } from "@/data/local-landings";
import { imageForRegion } from "@/data/stock-images";
import { getSiteUrl } from "@/lib/site-url";
import { getPublicPros } from "@/lib/public-pros";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = areaBySlug.get(slug);
  if (!area) return {};

  return {
    title: `Land Clearing, Dirt Work & Property Services in ${area.name}, AR`,
    description: `${area.intro} Find help with land clearing, dirt work, drainage, driveways, brush, cleanup, hauling, and related property work in ${area.name}, Arkansas.`,
    alternates: { canonical: `/areas/${area.slug}` },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = areaBySlug.get(slug);
  if (!area) notFound();

  const heroImage = imageForRegion(area.region);
  const coreServices = coreServiceSlugs
    .map((serviceSlug) => serviceBySlug.get(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const localPages = localLandings.filter((landing) => landing.area === area.slug);
  const pros = await getPublicPros({ areaName: area.name, limit: 6 });
  const baseUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Land and property services in ${area.name}, Arkansas`,
    url: `${baseUrl}/areas/${area.slug}`,
    description: area.intro,
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
          breadcrumbs={[
            { href: "/", label: "Home" },
            { href: "/areas", label: "Areas" },
            { label: area.name },
          ]}
          eyebrow={area.region}
          title={`Land & property work in ${area.name}, Arkansas`}
          description={area.intro}
          image={heroImage.src}
          imageAlt={heroImage.alt}
          ctaHref="#area-project"
          ctaLabel={`Get project help in ${area.name}`}
        />

        <section className="page-grid">
          <article className="page-copy">
            <h2>Property work around {area.name}</h2>
            <p>{area.localNote}</p>
            <p>
              Whether you are dealing with overgrown land, rough access, water
              problems, cleanup, or a property that needs to be prepared for its
              next use, start with the condition of the property and what you
              want changed.
            </p>

            {localPages.length > 0 ? (
              <>
                <h2>Popular {area.name} services</h2>
                <div className="link-board">
                  {localPages.map((landing) => {
                    const service = serviceBySlug.get(landing.service);
                    return (
                      <Link
                        href={`/areas/${area.slug}/${landing.service}`}
                        key={landing.service}
                      >
                        <strong>{service?.shortTitle ?? landing.service}</strong>
                        <span>↗</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : null}

            <h2>Land & property services</h2>
            <div className="link-board">
              {coreServices.map((service) => (
                <Link href={`/services/${service.slug}`} key={service.slug}>
                  <strong>{service.shortTitle}</strong>
                  <span>↗</span>
                </Link>
              ))}
            </div>

            <h2>What to have ready</h2>
            <ul>
              <li>The property location or nearest town.</li>
              <li>What needs to change and what you want the finished area used for.</li>
              <li>Approximate acreage, length, width, or other rough size if you know it.</li>
              <li>Photos of the work area, entrance, slope, drainage, or driveway when available.</li>
              <li>Any access, wet-ground, utility, rock, material, or haul-off concerns you already know about.</li>
            </ul>
          </article>

          <aside className="page-aside" id="area-project">
            <JobRequestForm
              source={`area:${area.slug}`}
              areaDefault={area.name}
              heading={`Tell us about the job in ${area.name}.`}
            />
          </aside>
        </section>

        <PublicProStrip
          title={`Contractors serving ${area.name}`}
          pros={pros}
        />
      </main>
      <SiteFooter />
    </>
  );
}

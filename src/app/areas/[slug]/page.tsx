import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import JobRequestForm from "@/components/job-request-form";
import { areas, areaBySlug } from "@/data/areas";
import { services, coreServiceSlugs, serviceBySlug } from "@/data/services";
import { localLandings } from "@/data/local-landings";
import { getSiteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = areaBySlug.get(slug);
  if (!area) return {};

  return {
    title: `Land Clearing, Dirt Work & Property Services in ${area.name}, AR`,
    description: `${area.intro} Request land clearing, dirt work, drainage, driveway, brush, cleanup, hauling, and related property help through Arkansas Land Pros.`,
    alternates: { canonical: `/areas/${area.slug}` },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = areaBySlug.get(slug);
  if (!area) notFound();

  const coreServices = coreServiceSlugs
    .map((serviceSlug) => serviceBySlug.get(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const localPages = localLandings.filter((landing) => landing.area === area.slug);
  const baseUrl = getSiteUrl();

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Land and property service requests in ${area.name}, Arkansas`,
      url: `${baseUrl}/areas/${area.slug}`,
      description: area.intro,
      about: coreServices.map((service) => service.shortTitle),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Areas", item: `${baseUrl}/areas` },
        { "@type": "ListItem", position: 3, name: area.name, item: `${baseUrl}/areas/${area.slug}` },
      ],
    },
  ];

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
              { label: area.name },
            ]}
          />
          <p className="field-label field-label-light">{area.region}</p>
          <h1>Land & property work in {area.name}, Arkansas</h1>
          <p>{area.intro}</p>
        </section>

        <section className="page-grid">
          <article className="page-copy">
            <h2>Why {area.name} is in the target footprint</h2>
            <p>{area.localNote}</p>
            <p>
              Arkansas Land Pros accepts requests from property owners who need
              practical help with land, access, water, overgrowth, cleanup, and
              site preparation. The request is reviewed and may be shared with
              an independent service provider that can evaluate the job.
            </p>

            {localPages.length > 0 && (
              <>
                <h2>Focused {area.name} service pages</h2>
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
            )}

            <h2>Common request categories</h2>
            <div className="link-board">
              {coreServices.map((service) => (
                <Link href={`/services/${service.slug}`} key={service.slug}>
                  <strong>{service.shortTitle}</strong>
                  <span>↗</span>
                </Link>
              ))}
            </div>

            <h2>What to send with the request</h2>
            <ul>
              <li>The property location or nearest town.</li>
              <li>What the ground, brush, driveway, drainage, or cleanup problem looks like now.</li>
              <li>What you want the property to be able to do when the work is finished.</li>
              <li>Approximate acreage, length, width, or other rough size if you know it.</li>
              <li>Any access, slope, utility, wet-ground, disposal, or material concerns you already know about.</li>
            </ul>
          </article>

          <aside className="page-aside">
            <JobRequestForm
              source={`area:${area.slug}`}
              areaDefault={area.name}
              heading={`Start a ${area.name} job request.`}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

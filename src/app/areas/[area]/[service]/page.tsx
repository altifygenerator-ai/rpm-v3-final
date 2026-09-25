import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import JobRequestForm from "@/components/job-request-form";
import PublicProStrip from "@/components/public-pro-strip";
import { areaBySlug } from "@/data/areas";
import { serviceBySlug } from "@/data/services";
import {
  localLandings,
  localLandingKey,
  localLandingMap,
} from "@/data/local-landings";
import { getPublicPros } from "@/lib/public-pros";

type PageProps = {
  params: Promise<{ area: string; service: string }>;
};

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return localLandings.map((landing) => ({
    area: landing.area,
    service: landing.service,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area: areaSlug, service: serviceSlug } = await params;
  const area = areaBySlug.get(areaSlug);
  const service = serviceBySlug.get(serviceSlug);
  const landing = localLandingMap.get(localLandingKey(areaSlug, serviceSlug));

  if (!area || !service || !landing) return {};

  return {
    title: `${service.shortTitle} in ${area.name}, AR`,
    description: `${landing.angle} Find help with ${service.shortTitle.toLowerCase()} in ${area.name}, Arkansas.`,
    alternates: { canonical: `/areas/${area.slug}/${service.slug}` },
    openGraph: {
      title: `${service.shortTitle} in ${area.name}, Arkansas`,
      description: landing.angle,
      images: [{ url: service.image, alt: `${service.shortTitle} work near ${area.name}` }],
    },
  };
}

export default async function LocalServicePage({ params }: PageProps) {
  const { area: areaSlug, service: serviceSlug } = await params;
  const area = areaBySlug.get(areaSlug);
  const service = serviceBySlug.get(serviceSlug);
  const landing = localLandingMap.get(localLandingKey(areaSlug, serviceSlug));

  if (!area || !service || !landing) notFound();

  const pros = await getPublicPros({ serviceSlug: service.slug, areaName: area.name, limit: 6 });

  const locationFaq = {
    q: `Can I get help with ${service.shortTitle.toLowerCase()} around ${area.name}?`,
    a: `Yes. Tell us where the property is and what needs done. Availability and the final scope depend on the service provider reviewing the property and project details.`,
  };
  const faqs = [locationFaq, ...service.faqs.slice(0, 2)];

  return (
    <>
      <SiteHeader />
      <main>
        <VisualHero
          breadcrumbs={[
            { href: "/", label: "Home" },
            { href: "/areas", label: "Areas" },
            { href: `/areas/${area.slug}`, label: area.name },
            { label: service.shortTitle },
          ]}
          eyebrow={`${area.name}, AR • ${service.shortTitle}`}
          title={`${service.shortTitle} in ${area.name}, Arkansas`}
          description={landing.angle}
          image={service.image}
          imageAlt={`${service.shortTitle} work near ${area.name}, Arkansas`}
          ctaHref="#local-project"
          ctaLabel="Tell us about your property"
        />

        <section className="page-grid">
          <article className="page-copy">
            <h2>{service.shortTitle} projects around {area.name}</h2>
            <p>{service.description}</p>
            <p>
              The best place to start is simple: describe what the property
              looks like now, what is getting in the way, and what you need the
              area to do when the work is finished.
            </p>

            <h2>Common jobs</h2>
            <ul>
              {service.requests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Property conditions matter</h2>
            <p>{area.intro}</p>
            <p>
              Travel, slope, wet ground, rock, equipment access, disposal,
              material delivery, and buried utilities can all affect the way a
              job is approached and priced. Photos and rough measurements help,
              but an on-site look may still be needed before a final estimate.
            </p>

            <h2>Questions about {service.shortTitle.toLowerCase()} in {area.name}</h2>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.q}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>

            <h2>More help around {area.name}</h2>
            <div className="link-board">
              <Link href={`/areas/${area.slug}`}>
                <strong>All {area.name} land services</strong>
                <span>↗</span>
              </Link>
              <Link href={`/services/${service.slug}`}>
                <strong>{service.shortTitle} across Arkansas</strong>
                <span>↗</span>
              </Link>
            </div>
          </article>

          <aside className="page-aside" id="local-project">
            <JobRequestForm
              source={`local:${area.slug}:${service.slug}`}
              areaDefault={area.name}
              serviceDefault={service.shortTitle}
              heading={`Tell us about the ${service.shortTitle.toLowerCase()} job.`}
            />
          </aside>
        </section>

        <PublicProStrip
          title={`${service.shortTitle} contractors serving ${area.name}`}
          pros={pros}
        />
      </main>
      <SiteFooter />
    </>
  );
}

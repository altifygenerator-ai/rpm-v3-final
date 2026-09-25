import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import JobRequestForm from "@/components/job-request-form";
import { areaBySlug } from "@/data/areas";
import { serviceBySlug } from "@/data/services";
import {
  localLandings,
  localLandingKey,
  localLandingMap,
} from "@/data/local-landings";
import { getSiteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ area: string; service: string }>;
};

export const dynamicParams = false;

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
    description: `${landing.angle} Submit a ${service.shortTitle.toLowerCase()} request in ${area.name}, Arkansas through Arkansas Land Pros.`,
    alternates: { canonical: `/areas/${area.slug}/${service.slug}` },
  };
}

export default async function LocalServicePage({ params }: PageProps) {
  const { area: areaSlug, service: serviceSlug } = await params;
  const area = areaBySlug.get(areaSlug);
  const service = serviceBySlug.get(serviceSlug);
  const landing = localLandingMap.get(localLandingKey(areaSlug, serviceSlug));

  if (!area || !service || !landing) notFound();

  const baseUrl = getSiteUrl();
  const locationFaq = {
    q: `Can I request ${service.shortTitle.toLowerCase()} in ${area.name} through this page?`,
    a: `Yes. This page is specifically built to collect ${service.shortTitle.toLowerCase()} requests for property in and around ${area.name}, Arkansas. Availability and the final job scope depend on the provider reviewing the request.`,
  };
  const faqs = [locationFaq, ...service.faqs.slice(0, 2)];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${service.shortTitle} in ${area.name}, Arkansas`,
      url: `${baseUrl}/areas/${area.slug}/${service.slug}`,
      description: landing.angle,
      about: [
        service.shortTitle,
        `${area.name}, Arkansas`,
        "Arkansas land services",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Areas", item: `${baseUrl}/areas` },
        { "@type": "ListItem", position: 3, name: area.name, item: `${baseUrl}/areas/${area.slug}` },
        { "@type": "ListItem", position: 4, name: service.shortTitle, item: `${baseUrl}/areas/${area.slug}/${service.slug}` },
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
              { href: `/areas/${area.slug}`, label: area.name },
              { label: service.shortTitle },
            ]}
          />
          <p className="field-label field-label-light">
            {area.region} / {service.shortTitle}
          </p>
          <h1>{service.shortTitle} in {area.name}, Arkansas</h1>
          <p>{landing.angle}</p>
        </section>

        <section className="page-grid">
          <article className="page-copy">
            <h2>The kind of {area.name} property request this page is for</h2>
            <p>{service.description}</p>
            <p>
              Around {area.name}, the starting point is still the same: explain
              what the property looks like, what is getting in the way, and what
              you need the area to do when the job is finished.
            </p>

            <h2>Work that may fit the request</h2>
            <ul>
              {service.requests.map((request) => (
                <li key={request}>{request}</li>
              ))}
            </ul>

            <h2>Local context matters</h2>
            <p>{area.intro}</p>
            <p>
              Travel, access, slope, wet ground, rock, disposal, material
              delivery, buried utilities, and the actual condition of the site
              can all change how a project should be approached. This page is
              for lead intake, not a promise that a job can be priced or scoped
              from search text alone.
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

            <h2>More ways into the site</h2>
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

          <aside className="page-aside">
            <JobRequestForm
              source={`local:${area.slug}:${service.slug}`}
              areaDefault={area.name}
              serviceDefault={service.shortTitle}
              heading={`Request ${service.shortTitle.toLowerCase()} in ${area.name}.`}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

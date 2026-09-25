import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import JobRequestForm from "@/components/job-request-form";
import { services, serviceBySlug } from "@/data/services";
import { priorityAreas } from "@/data/areas";
import { localLandings } from "@/data/local-landings";
import { getSiteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `/services/${service.slug}`,
      images: [{ url: service.image, alt: `${service.shortTitle} property work in Arkansas` }],
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) notFound();

  const related = service.related
    .map((relatedSlug) => serviceBySlug.get(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const localPages = localLandings
    .filter((landing) => landing.service === service.slug)
    .slice(0, 10);

  const baseUrl = getSiteUrl();
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: service.title,
      url: `${baseUrl}/services/${service.slug}`,
      description: service.description,
      isPartOf: { "@type": "WebSite", name: "Arkansas Land Pros", url: baseUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((faq) => ({
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
        { "@type": "ListItem", position: 2, name: "Services", item: `${baseUrl}/services` },
        { "@type": "ListItem", position: 3, name: service.shortTitle, item: `${baseUrl}/services/${service.slug}` },
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
              { href: "/services", label: "Services" },
              { label: service.shortTitle },
            ]}
          />
          <p className="field-label field-label-light">ARKANSAS PROPERTY REQUEST</p>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </section>

        <section className="page-grid">
          <article className="page-copy">
            <div className="relative h-[340px] overflow-hidden border-l-[8px] border-[var(--clay)]">
              <Image
                src={service.image}
                alt={`${service.shortTitle} property work in Arkansas`}
                fill
                priority
                sizes="(min-width: 900px) 65vw, 100vw"
                className="object-cover"
              />
            </div>

            <h2>What this request can cover</h2>
            <p>
              Start with what the property needs to become. The final scope may
              change after access, terrain, drainage, material, utilities, and
              the actual site are reviewed.
            </p>
            <ul>
              {service.requests.map((request) => (
                <li key={request}>{request}</li>
              ))}
            </ul>

            <h2>What helps before someone looks at the job</h2>
            <p>
              Property location, approximate size, access, photos, timing, and
              the end goal are usually more useful than trying to write a
              contractor-style scope yourself. For water or driveway problems,
              photos during or shortly after rain can help show what is actually
              happening.
            </p>

            {localPages.length > 0 && (
              <>
                <h2>Focused Arkansas pages for this work</h2>
                <div className="link-board">
                  {localPages.map((landing) => {
                    const area = priorityAreas.find((item) => item.slug === landing.area);
                    return (
                      <Link
                        href={`/areas/${landing.area}/${landing.service}`}
                        key={`${landing.area}-${landing.service}`}
                      >
                        <strong>
                          {service.shortTitle} in {area?.name ?? landing.area}
                        </strong>
                        <span>↗</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            <h2>Questions property owners ask</h2>
            <div className="faq-list">
              {service.faqs.map((faq) => (
                <details key={faq.q}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>

            {related.length > 0 && (
              <>
                <h2>Related property work</h2>
                <div className="link-board">
                  {related.map((item) => (
                    <Link href={`/services/${item.slug}`} key={item.slug}>
                      <strong>{item.shortTitle}</strong>
                      <span>↗</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </article>

          <aside className="page-aside">
            <JobRequestForm
              source={`service:${service.slug}`}
              serviceDefault={service.shortTitle}
              heading="Start with the property details."
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import JobRequestForm from "@/components/job-request-form";
import { services, serviceBySlug } from "@/data/services";
import { areaBySlug } from "@/data/areas";
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
      images: [{ url: service.image, alt: `${service.shortTitle} in Arkansas` }],
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
      "@type": "Service",
      name: service.title,
      description: service.description,
      areaServed: { "@type": "State", name: "Arkansas" },
      provider: {
        "@type": "Organization",
        name: "Arkansas Land Pros",
        url: baseUrl,
      },
      url: `${baseUrl}/services/${service.slug}`,
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
  ];

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
            { href: "/services", label: "Services" },
            { label: service.shortTitle },
          ]}
          eyebrow="LAND & PROPERTY SERVICES"
          title={service.title}
          description={service.description}
          image={service.image}
          imageAlt={`${service.shortTitle} work in Arkansas`}
          ctaHref="#project-details"
          ctaLabel="Get help with this project"
        />

        <section className="page-grid">
          <article className="page-copy">
            <h2>Common {service.shortTitle.toLowerCase()} jobs</h2>
            <p>
              Every property is different, but these are some of the jobs that
              commonly fall under {service.shortTitle.toLowerCase()}.
            </p>
            <ul>
              {service.requests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>What helps someone understand the job</h2>
            <p>
              The property location, rough size, access, photos, timing, and what
              you want the area to be used for afterward can make the first
              conversation much more useful. For driveway or drainage problems,
              photos during or just after rain can be especially helpful.
            </p>

            {localPages.length > 0 ? (
              <>
                <h2>{service.shortTitle} in Arkansas communities</h2>
                <div className="link-board">
                  {localPages.map((landing) => {
                    const area = areaBySlug.get(landing.area);
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
            ) : null}

            <h2>Questions property owners ask</h2>
            <div className="faq-list">
              {service.faqs.map((faq) => (
                <details key={faq.q}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>

            {related.length > 0 ? (
              <>
                <h2>Related land & property work</h2>
                <div className="link-board">
                  {related.map((item) => (
                    <Link href={`/services/${item.slug}`} key={item.slug}>
                      <strong>{item.shortTitle}</strong>
                      <span>↗</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </article>

          <aside className="page-aside" id="project-details">
            <JobRequestForm
              source={`service:${service.slug}`}
              serviceDefault={service.shortTitle}
              heading={`Tell us about your ${service.shortTitle.toLowerCase()} project.`}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

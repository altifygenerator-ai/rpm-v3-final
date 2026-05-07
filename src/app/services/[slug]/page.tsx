import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import EstimateCTA from "@/components/estimate-cta";
import ContactSection from "@/components/contact-section";
import { servicePages } from "@/data/service-pages";
import { services } from "@/data/services";
import { siteData } from "@/data/site";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const baseUrl = "https://www.richardslandmanagementllc.com";

export async function generateStaticParams() {
  return servicePages.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = servicePages.find((service) => service.slug === slug);

  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `${baseUrl}/services/${page.slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${baseUrl}/services/${page.slug}`,
      images: [page.image],
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const page = servicePages.find((service) => service.slug === slug);

  if (!page) notFound();
  

  const relatedServices = page.related
    .map((relatedSlug) =>
      services.find((service) => service.slug === relatedSlug)
    )
    .filter(Boolean);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      serviceType: page.shortTitle,
      description: page.metaDescription,
      provider: {
        "@type": "LocalBusiness",
        name: siteData.name,
        url: baseUrl,
        telephone: siteData.phone,
        email: siteData.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Greers Ferry",
          addressRegion: "AR",
          addressCountry: "US",
        },
      },
      areaServed: siteData.serviceArea.map((area) => ({
        "@type": "Place",
        name: `${area}, Arkansas`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${baseUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${baseUrl}/#services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: page.shortTitle,
          item: `${baseUrl}/services/${page.slug}`,
        },
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

        <section className="relative min-h-[72vh] overflow-hidden pt-32">
          <Image
            src={page.image}
            alt={`${page.shortTitle} near Greers Ferry Arkansas`}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/70" />

          <div className="container relative z-10 py-24">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">
              {page.eyebrow}
            </p>

            <h1 className="mt-4 max-w-5xl text-4xl font-bold text-white md:text-6xl">
              {page.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              {page.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#contact" className="btn-primary">
                {page.primaryCta}
              </a>

              <a href={siteData.phoneHref} className="btn-secondary">
                Call {siteData.phone}
              </a>
            </div>
          </div>
        </section>

        {page.layoutVariant === "problemSolution" && (
          <section className="section">
            <div className="container grid gap-8 md:grid-cols-3">
              {page.sections.map((section) => (
                <div key={section.heading} className="card">
                  {section.eyebrow && (
                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
                      {section.eyebrow}
                    </p>
                  )}
                  <h2 className="mt-3 text-2xl">{section.heading}</h2>
                  <p className="mt-4 text-neutral-300">{section.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {page.layoutVariant === "safetyCleanup" && (
          <section className="section">
            <div className="container grid items-start gap-12 md:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-4">
                {page.galleryImages.slice(0, 2).map((image, index) => (
                  <div
                    key={image}
                    className={`relative overflow-hidden rounded-lg ${
                      index === 0 ? "h-[340px]" : "h-[220px]"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${page.shortTitle} project in Central Arkansas`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div>
                {page.sections.map((section) => (
                  <div key={section.heading} className="mb-10">
                    {section.eyebrow && (
                      <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
                        {section.eyebrow}
                      </p>
                    )}
                    <h2 className="mt-3">{section.heading}</h2>
                    <p className="mt-4 text-neutral-300">{section.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {page.layoutVariant === "processTerrain" && (
          <section className="section">
            <div className="container grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                {page.sections.map((section) => (
                  <div key={section.heading} className="mb-10">
                    {section.eyebrow && (
                      <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
                        {section.eyebrow}
                      </p>
                    )}
                    <h2 className="mt-3">{section.heading}</h2>
                    <p className="mt-4 text-neutral-300">{section.text}</p>
                  </div>
                ))}
              </div>

              {page.process && (
                <div className="card">
                  <h3>How we approach the job</h3>

                  <div className="mt-6 grid gap-4">
                    {page.process.map((step, index) => (
                      <div key={step} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-black">
                          {index + 1}
                        </span>
                        <p className="text-neutral-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="section bg-[#071b15]">
          <div className="container grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2>{page.bulletsTitle}</h2>
              <p className="mt-4 text-neutral-300">
                Every property is different, but these are some of the common
                jobs we help with around Greers Ferry Lake and Central Arkansas.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {page.bullets.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-neutral-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="grid gap-4 md:grid-cols-3">
              {page.galleryImages.map((image) => (
                <div
                  key={image}
                  className="relative h-[260px] overflow-hidden rounded-lg"
                >
                  <Image
                    src={image}
                    alt={`${page.shortTitle} work near Greers Ferry Arkansas`}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-[#071b15]">
          <div className="container">
            <h2>Service Areas</h2>

            <p className="mt-4 max-w-2xl text-neutral-300">
              We serve property owners around Greers Ferry Lake and Central
              Arkansas, including:
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {siteData.serviceArea.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>Frequently Asked Questions</h2>

            <div className="mt-8 grid gap-5">
              {page.faqs.map((faq) => (
                <div key={faq.q} className="card">
                  <h3>{faq.q}</h3>
                  <p className="mt-3 text-neutral-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {relatedServices.length > 0 && (
          <section className="section bg-[#071b15]">
            <div className="container">
              <h2>Related Property Services</h2>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {relatedServices.map((service: any) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="card group block"
                  >
                    <h3>{service.title}</h3>
                    <p className="mt-2 text-neutral-300">
                      {service.description}
                    </p>
                    <div className="mt-4 text-sm text-[var(--accent)]">
                      View service →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <EstimateCTA />
        <ContactSection />
      </main>

      <SiteFooter />
    </>
  );
}
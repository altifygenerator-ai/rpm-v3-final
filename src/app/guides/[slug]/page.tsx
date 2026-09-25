import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { guides, guideBySlug } from "@/data/guides";
import { getSiteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug.get(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = guideBySlug.get(slug);
  if (!guide) notFound();

  const baseUrl = getSiteUrl();
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      mainEntityOfPage: `${baseUrl}/guides/${guide.slug}`,
      publisher: { "@type": "Organization", name: "Arkansas Land Pros", url: baseUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Property Guides", item: `${baseUrl}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: `${baseUrl}/guides/${guide.slug}` },
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
              { href: "/guides", label: "Property Guides" },
              { label: guide.eyebrow },
            ]}
          />
          <p className="field-label field-label-light">{guide.eyebrow}</p>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
        </section>

        <article className="article-shell">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <div className="mt-14 border-t-2 border-[var(--iron)] pt-6">
            <p className="field-label">HAVE A PROPERTY PROJECT?</p>
            <p>
              Use the request form if you want to turn the planning notes into a
              real job request with the property area and scope attached.
            </p>
            <Link href="/contact" className="work-button mt-5">
              Start a job request
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

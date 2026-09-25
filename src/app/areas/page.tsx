import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import { areas } from "@/data/areas";
import { regions } from "@/data/regions";
import { stockImages } from "@/data/stock-images";

export const metadata: Metadata = {
  title: "Land Clearing, Dirt Work & Property Services Across Arkansas",
  description:
    "Arkansas Land Pros helps property owners find land-service help across Southwest Arkansas, Hot Springs, the Ouachitas, Greers Ferry Lake, Central Arkansas, and surrounding communities.",
  alternates: { canonical: "/areas" },
};

const sections = [
  {
    title: "Southwest Arkansas & Hot Springs",
    description:
      "Amity, Glenwood, Arkadelphia, Hot Springs, Mount Ida, Malvern, Murfreesboro, and nearby rural communities.",
    priorities: ["red-dirt"],
  },
  {
    title: "Greers Ferry Lake area",
    description:
      "Greers Ferry, Heber Springs, Fairfield Bay, Clinton, Quitman, and nearby lake communities.",
    priorities: ["legacy"],
  },
  {
    title: "Central & wider Arkansas",
    description:
      "Benton, Bryant, Little Rock, Conway, Russellville, Searcy, Mountain View, Sheridan, Gurdon, Mena, and surrounding areas.",
    priorities: ["expansion"],
  },
] as const;

export default function AreasPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <VisualHero
          breadcrumbs={[{ href: "/", label: "Home" }, { label: "Areas" }]}
          eyebrow="SERVING ARKANSAS PROPERTY OWNERS"
          title="Land work near home — and across the state."
          description="From the Hot Springs and Glenwood area to Greers Ferry Lake and Central Arkansas, browse the communities we cover in detail or tell us about a project anywhere in Arkansas."
          image={stockImages.ruralPropertyPrep.src}
          imageAlt={stockImages.ruralPropertyPrep.alt}
          ctaHref="/contact"
          ctaLabel="Tell us where the property is"
        />

        <section className="index-layout">
          {sections.map((section) => (
            <div className="mb-16" key={section.title}>
              <div className="index-intro">
                <p className="field-label">{section.title}</p>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>
              </div>

              <div className="index-lines">
                {areas
                  .filter((area) =>
                    section.priorities.includes(area.priority as never)
                  )
                  .map((area) => (
                    <Link href={`/areas/${area.slug}`} key={area.slug}>
                      <small>{area.region}</small>
                      <strong>{area.name}</strong>
                      <p>{area.intro}</p>
                      <span>↗</span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}

          <div className="index-intro mt-20">
            <p className="field-label">BROWSE BY REGION</p>
            <div>
              <h2>Find the part of Arkansas closest to your property.</h2>
              <p>
                Each regional page pulls together nearby communities and the
                land-service work property owners commonly need there.
              </p>
            </div>
          </div>

          <div className="index-lines">
            {regions.map((region) => (
              <Link href={`/regions/${region.slug}`} key={region.slug}>
                <small>Arkansas</small>
                <strong>{region.name}</strong>
                <p>{region.summary}</p>
                <span>↗</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

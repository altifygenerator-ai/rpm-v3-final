import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { areas } from "@/data/areas";
import { regions } from "@/data/regions";

export const metadata: Metadata = {
  title: "Arkansas Land Service Areas",
  description:
    "Arkansas Land Pros targets Southwest Arkansas, Hot Springs, the Ouachitas, Greers Ferry Lake, and selected Central Arkansas markets for land clearing, dirt work, drainage, driveways, cleanup, and related property requests.",
  alternates: { canonical: "/areas" },
};

const sections = [
  {
    title: "Priority lead area",
    description:
      "The heaviest launch focus is the Southwest Arkansas / Hot Springs / Ouachita corridor, where useful leads can be handled locally first.",
    priorities: ["red-dirt"],
  },
  {
    title: "Established Greers Ferry search area",
    description:
      "These pages preserve the former Richards site’s strongest geographic continuity while expanding the content into the Arkansas Land Pros model.",
    priorities: ["legacy"],
  },
  {
    title: "Expansion markets",
    description:
      "These are real search targets, but the site is building them as a second ring rather than pretending every Arkansas town is equally local on day one.",
    priorities: ["expansion"],
  },
] as const;

export default function AreasPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Areas" }]} />
          <p className="field-label field-label-light">ARKANSAS COVERAGE</p>
          <h1>Local pages with an actual reason to exist.</h1>
          <p>
            Arkansas Land Pros is broad enough to grow statewide, but the SEO
            starts in defined regional clusters instead of copy-pasting every
            city in the state.
          </p>
        </section>

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
            <p className="field-label">REGIONAL HUBS</p>
            <div>
              <h2>Browse by Arkansas region.</h2>
              <p>
                Regional pages tie related towns and services together so the
                search structure reflects how the market actually works.
              </p>
            </div>
          </div>

          <div className="index-lines">
            {regions.map((region) => (
              <Link href={`/regions/${region.slug}`} key={region.slug}>
                <small>Region</small>
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

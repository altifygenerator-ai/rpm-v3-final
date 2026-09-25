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
    title: "Southwest Arkansas & Hot Springs",
    description:
      "Coverage around Amity, Glenwood, Arkadelphia, Hot Springs, Mount Ida, Malvern, Murfreesboro, and nearby rural communities.",
    priorities: ["red-dirt"],
  },
  {
    title: "Greers Ferry Lake area",
    description:
      "Land and property requests around Greers Ferry, Heber Springs, Fairfield Bay, Clinton, Quitman, and nearby lake communities.",
    priorities: ["legacy"],
  },
  {
    title: "Central & wider Arkansas",
    description:
      "Additional coverage around Benton, Bryant, Little Rock, Conway, Russellville, Searcy, Mountain View, Sheridan, Gurdon, Mena, and surrounding areas.",
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
            Browse the communities we cover in detail, or send a project request
            from anywhere in Arkansas.
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
                Use the regional pages to find nearby communities and the kinds
                of land and property work commonly requested there.
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

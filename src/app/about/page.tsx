import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { siteData } from "@/data/site";

export const metadata: Metadata = {
  title: "How Arkansas Land Pros Works",
  description:
    "Learn how Arkansas Land Pros collects and routes Arkansas land-service requests, which regions are targeted first, and what the site does and does not promise.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "How It Works" }]} />
          <p className="field-label field-label-light">THE OPERATION</p>
          <h1>A better front door for Arkansas land work.</h1>
          <p>
            Arkansas Land Pros is being built as a focused lead property: useful
            search pages for landowners, clean job intake, and routing that
            starts where the work can actually be handled.
          </p>
        </section>

        <section className="article-shell">
          <section>
            <h2>What Arkansas Land Pros is</h2>
            <p>{siteData.description}</p>
            <p>
              It is not presented as one statewide crew pretending to be local
              in every town. It is a lead and referral service built around
              specific Arkansas property-service searches and a clear intake
              system.
            </p>
          </section>

          <section>
            <h2>Why the launch is regional instead of fake-statewide</h2>
            <p>
              The strongest new focus is Southwest Arkansas, Hot Springs, and
              the Ouachita corridor because those are useful lead markets close
              to the initial service network. The Greers Ferry Lake cluster is
              also retained because the previous site already had search
              relevance around that region.
            </p>
            <p>
              Central Arkansas pages form the next expansion ring. The goal is
              to add depth where there is a real reason for the page instead of
              creating hundreds of identical town pages.
            </p>
          </section>

          <section>
            <h2>What happens to a lead</h2>
            <p>
              The intake captures the project basics plus where the lead came
              from. At launch, requests are delivered for local review and can
              be followed up by a service provider that may be able to handle
              the job. The site itself does not issue the contractor&apos;s
              estimate or guarantee availability.
            </p>
          </section>

          <section>
            <h2>What the site deliberately does not claim</h2>
            <p>
              Arkansas Land Pros does not invent crew size, years in business,
              equipment ownership, licenses, insurance status, customer reviews,
              project counts, or completed-job totals. Those facts belong to the
              contractor that ultimately performs the work.
            </p>
          </section>

          <section>
            <h2>Start with a real property problem</h2>
            <p>
              Land clearing, drainage, gravel access, dirt work, brush, storm
              cleanup, culverts, and rural property jobs usually make more sense
              once the location and site conditions are known.
            </p>
            <Link href="/contact" className="work-button mt-5">
              Start a job request
            </Link>
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { siteData } from "@/data/site";

export const metadata: Metadata = {
  title: "How Arkansas Land Pros Works",
  description:
    "Learn how Arkansas Land Pros helps property owners describe land-service projects and connect with an independent service provider that may be able to help.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "How It Works" }]} />
          <p className="field-label field-label-light">HOW IT WORKS</p>
          <h1>A simple place to start when the property needs work.</h1>
          <p>
            You do not need to know the exact service name before you reach out.
            Tell us what the property looks like now, what you want changed, and
            where it is.
          </p>
        </section>

        <section className="article-shell">
          <section>
            <h2>What Arkansas Land Pros does</h2>
            <p>{siteData.description}</p>
            <p>
              The goal is to make the first conversation easier for property
              owners who need clearing, dirt work, drainage, driveway work,
              cleanup, hauling, or a mix of several things.
            </p>
          </section>

          <section>
            <h2>Start with the problem, not contractor terminology</h2>
            <p>
              A description like “the driveway keeps washing out,” “the lot has
              grown in,” or “I need this area cleared before a mobile home goes
              in” is enough to get started. Acreage, measurements, photos, and
              timing help when you have them, but you do not need a finished
              scope of work.
            </p>
          </section>

          <section>
            <h2>Where requests can come from</h2>
            <p>
              Requests are welcome from anywhere in Arkansas. The site has
              especially detailed area pages for Southwest Arkansas, Hot
              Springs, the Ouachitas, Greers Ferry Lake, and several Central
              Arkansas communities.
            </p>
          </section>

          <section>
            <h2>What happens after you send it</h2>
            <p>
              Your request is reviewed and may be shared with an independent
              service provider that may be able to help. If the project looks
              like a fit, the provider can follow up about the property, an
              estimate, scheduling, and any other details needed before work
              begins.
            </p>
          </section>

          <section>
            <h2>What Arkansas Land Pros does not promise</h2>
            <p>
              Sending a request does not guarantee that a contractor will accept
              the job, a particular price, or a particular schedule. The
              contractor performing the work is responsible for its own
              estimates, licensing, insurance, permits, scheduling, and completed
              work.
            </p>
          </section>

          <section>
            <h2>Have a property project in mind?</h2>
            <p>
              Send the rough details and we can start from there.
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

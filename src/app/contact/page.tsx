import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";
import JobRequestForm from "@/components/job-request-form";

export const metadata: Metadata = {
  title: "Request Land or Property Work in Arkansas",
  description:
    "Send Arkansas Land Pros the property area, work type, timing, and job details for land clearing, dirt work, drainage, driveways, cleanup, hauling, and related property work.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Job Request" }]} />
          <p className="field-label field-label-light">START WITH THE PROPERTY</p>
          <h1>Send the rough details. No polished scope needed.</h1>
          <p>
            Tell us where the property is, what is getting in the way, and what
            you want changed. That is enough to start the lead.
          </p>
        </section>

        <section className="page-grid">
          <article className="page-copy">
            <h2>What makes a useful request</h2>
            <p>
              Land jobs are easier to sort when the basics are clear. A short
              description in normal language is better than guessing at
              contractor terminology.
            </p>
            <ul>
              <li>Town or property area.</li>
              <li>The closest work category.</li>
              <li>What the property looks like now.</li>
              <li>What you want it to look like or do afterward.</li>
              <li>Approximate acreage, driveway length, or project size if known.</li>
              <li>Any slope, access, wet-ground, rock, utility, or disposal issue you already know about.</li>
            </ul>

            <h2>What happens after it is sent</h2>
            <p>
              The request is delivered for review with its source and page
              information attached. It may be shared with an independent
              service provider that may be able to help with the project.
              Estimates, scheduling, licensing, insurance, and the completed
              work remain the responsibility of the contractor that accepts the
              job.
            </p>

            <h2>Not an emergency line</h2>
            <p>
              Do not use this form for downed power lines, active flooding that
              threatens life or safety, gas leaks, fire, or other emergencies.
              Contact the appropriate utility or emergency service first.
            </p>
          </article>

          <aside className="page-aside">
            <JobRequestForm source="contact-page" heading="Send the job details." />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

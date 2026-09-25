import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using Arkansas Land Pros as an Arkansas land-service lead and referral website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Terms" }]} />
          <p className="field-label field-label-light">TERMS</p>
          <h1>Terms of Use</h1>
          <p>What Arkansas Land Pros provides — and what remains between a property owner and the contractor.</p>
        </section>

        <article className="legal-copy">
          <h2>Lead and referral service</h2>
          <p>
            Arkansas Land Pros is a lead and referral website. Submitting a
            request does not create a construction contract, guarantee that a
            provider will accept the job, or guarantee a particular response
            time, price, schedule, or result.
          </p>

          <h2>Independent service providers</h2>
          <p>
            Contractors or service providers that respond to a request operate
            independently. The provider performing the work is responsible for
            its estimates, agreements, licensing, insurance, permits, taxes,
            safety practices, scheduling, workmanship, and completed project.
          </p>

          <h2>Property-owner responsibility</h2>
          <p>
            Property owners are responsible for verifying property boundaries,
            access rights, easements, private utilities, permit requirements,
            and any other information relevant to the work. Underground
            utilities should be properly located before digging or excavation
            begins.
          </p>

          <h2>No emergency service</h2>
          <p>
            The website is not an emergency dispatch service. Do not rely on a
            web form for downed power lines, gas leaks, fire, immediate flood
            danger, or other conditions that require utilities or emergency
            responders.
          </p>

          <h2>Site information</h2>
          <p>
            Guides and service pages provide general information and lead-intake
            context. They are not engineering, legal, surveying, code,
            environmental, or safety advice and should not replace an on-site
            professional evaluation where one is appropriate.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Do not use the site to submit spam, malicious content, false
            requests, automated abuse, or information you are not authorized to
            provide. Requests may be blocked or discarded when abuse is
            suspected.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

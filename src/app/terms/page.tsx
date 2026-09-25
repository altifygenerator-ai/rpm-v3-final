import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for property-owner submissions, contractor profiles, lead purchases, and use of Arkansas Land Pros.",
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
          <p>Terms for property owners, contractor profiles, and paid lead unlocks.</p>
        </section>

        <article className="legal-copy">
          <h2>Arkansas Land Pros</h2>
          <p>
            Arkansas Land Pros helps property owners describe land and property projects and helps independent service providers discover projects that may fit their business. Arkansas Land Pros is not the contractor performing every project and does not guarantee that any project will be accepted, completed, or awarded to a particular provider.
          </p>

          <h2>Property-owner submissions</h2>
          <p>
            By submitting project details, you represent that the information is reasonably accurate and that Arkansas Land Pros may review, classify, store, and share those details with service providers that may be able to help. Direct contact information may be disclosed to service providers that obtain access to the project.
          </p>

          <h2>Independent contractors</h2>
          <p>
            Service providers operate independently. The provider performing the work is responsible for its estimates, agreements, licensing, insurance, permits, taxes, safety practices, scheduling, workmanship, and completed project.
          </p>

          <h2>Contractor profiles</h2>
          <p>
            Contractor accounts may create public business listings showing information the contractor provides, including business name, services, service areas, phone number, website, social links, and description. Contractors are responsible for keeping their public information accurate and for having permission to publish any content they submit.
          </p>

          <h2>Lead previews and purchases</h2>
          <p>
            Contractors may see a limited preview of matching opportunities before purchase. The displayed unlock price is shown before checkout. A successful Stripe payment unlocks the additional homeowner/project information associated with that lead. Standard leads may be made available to more than one contractor and may have a limited number of paid unlocks.
          </p>

          <h2>No guarantee of a sale or response</h2>
          <p>
            Purchasing a lead does not guarantee that the homeowner will answer, request an estimate, hire the contractor, proceed with the project, or choose any particular provider. Contractors are purchasing access to the project/contact information, not a guaranteed job.
          </p>

          <h2>Invalid-lead review</h2>
          <p>
            A contractor may request review of a paid lead when the contact information is invalid, the submission is fake or spam, the lead is a duplicate already purchased by that contractor, or the service/location is materially different from the preview. Arkansas Land Pros may approve or deny a credit or refund after review. Lack of response or losing the job to another provider does not by itself make a lead invalid.
          </p>

          <h2>Payment processing</h2>
          <p>
            Lead purchases are processed by Stripe. Payment information is handled by Stripe rather than stored directly by Arkansas Land Pros. Refunds, when approved, may take additional time to appear depending on the payment method and financial institution.
          </p>

          <h2>Misuse of lead information</h2>
          <p>
            Contractors may use unlocked homeowner information only to respond to the submitted project and reasonably follow up about that work. Do not resell, publish, scrape, or use homeowner contact information for unrelated marketing.
          </p>

          <h2>Property-owner responsibility</h2>
          <p>
            Property owners remain responsible for property boundaries, access rights, easements, private utilities, permit requirements, and other information relevant to the work. Underground utilities should be properly located before excavation begins.
          </p>

          <h2>No emergency service</h2>
          <p>
            The website is not an emergency dispatch service. Do not rely on a web form for downed power lines, gas leaks, fire, immediate flood danger, or other conditions that require utilities or emergency responders.
          </p>

          <h2>Abuse and account access</h2>
          <p>
            Arkansas Land Pros may limit or suspend accounts, marketplace access, listings, or submissions when fraud, abuse, chargeback misuse, scraping, harassment, spam, or other misuse is suspected.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

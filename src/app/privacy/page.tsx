import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for Arkansas Land Pros project submissions, contractor accounts, marketplace payments, analytics, and bot protection.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy" }]} />
          <p className="field-label field-label-light">PRIVACY</p>
          <h1>Privacy Policy</h1>
          <p>How Arkansas Land Pros handles project submissions and contractor marketplace information.</p>
        </section>

        <article className="legal-copy">
          <h2>Property-owner information</h2>
          <p>
            Project submissions may include your name, phone number, email address, property area, project type, timing, approximate size, photos or notes you provide, and information about how you reached the site.
          </p>

          <h2>How project information is used</h2>
          <p>
            Project information is used to review, classify, score, store, match, route, and follow up on the project. Arkansas Land Pros may use automated tools to summarize or categorize a submission. Project previews may be shown to service providers that match the work and area. Direct contact information and fuller project details may be disclosed to providers that obtain access to the lead and to internal operators handling the project.
          </p>

          <h2>Contractor accounts and public profiles</h2>
          <p>
            Contractor accounts may provide business name, contact name, email, phone, website, social links, services, service areas, and business description. Information intended for a public contractor profile is visible to site visitors. Account email and marketplace/payment records are kept for account operation and are not automatically shown on the public profile unless the contractor separately publishes that information.
          </p>

          <h2>Marketplace and payment records</h2>
          <p>
            Arkansas Land Pros records lead matches, purchases, unlocks, outcome updates, and invalid-lead review requests. Stripe processes lead payments and may collect payment, billing, fraud-prevention, and transaction information under Stripe&apos;s own privacy practices.
          </p>

          <h2>Analytics and attribution</h2>
          <p>
            The site may record pages visited, referring pages, campaign tags, and basic interaction events. This information helps measure which pages and campaigns create useful project submissions and contractor activity.
          </p>

          <h2>Spam and security controls</h2>
          <p>
            Cloudflare Turnstile and server-side abuse controls are used to reduce automated submissions and protect account and lead systems. Technical request information such as IP-related data may be processed for verification, rate limiting, fraud prevention, and security.
          </p>

          <h2>Email delivery and account links</h2>
          <p>
            Arkansas Land Pros uses email providers to deliver project notifications, contractor opportunity alerts, and secure passwordless sign-in links. Sign-in links should not be forwarded to other people.
          </p>

          <h2>Retention</h2>
          <p>
            Project, contractor, purchase, and security records may be retained as reasonably necessary to operate the marketplace, handle disputes, prevent abuse, maintain accounting records, and understand marketplace performance.
          </p>

          <h2>Your choices</h2>
          <p>
            Do not submit information you do not want included with a project. Contractors can update their public profile and service-area information from their account. Requests to correct or remove information can be sent through the site&apos;s contact options, subject to records that must reasonably be retained for payment, fraud-prevention, legal, or accounting purposes.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

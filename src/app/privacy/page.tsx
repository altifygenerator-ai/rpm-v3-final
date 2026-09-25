import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Breadcrumbs from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy information for Arkansas Land Pros lead forms, analytics, bot protection, and referral routing.",
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
          <p>How information submitted through Arkansas Land Pros is used.</p>
        </section>

        <article className="legal-copy">
          <h2>Information you provide</h2>
          <p>
            Job-request forms and chat intake may collect your name, phone
            number, email address, property area, requested service, timing,
            approximate project size, and the project details you choose to
            provide.
          </p>

          <h2>Lead and referral use</h2>
          <p>
            Information submitted as a job request is used to review, route,
            respond to, and follow up on the project. A request may be shared
            with an independent service provider that may be able to evaluate or
            perform the requested work.
          </p>

          <h2>Traffic and attribution information</h2>
          <p>
            The site may record the page used to submit a request, referring
            page, campaign tags, and basic analytics events such as form
            submissions or navigation clicks. This helps us understand which
            pages and campaigns generate useful requests.
          </p>

          <h2>Spam and security controls</h2>
          <p>
            Arkansas Land Pros uses Cloudflare Turnstile and server-side abuse
            controls to reduce automated submissions and protect the intake
            system. Technical request data such as IP-related information may be
            processed as part of verification, rate limiting, security, and
            abuse prevention.
          </p>

          <h2>Email delivery</h2>
          <p>
            Lead notifications are delivered through an email service provider.
            Submitted details are included in those notifications so the request
            can be reviewed and followed up.
          </p>

          <h2>Retention and disclosure</h2>
          <p>
            Information may be retained as reasonably needed to handle requests,
            maintain records, prevent abuse, and understand lead performance.
            Information may also be disclosed when required by law or when
            reasonably necessary to protect the service, users, or others.
          </p>

          <h2>Your choices</h2>
          <p>
            Do not submit information you do not want included in a service
            request. If you need to correct or remove information associated
            with a request, use the site contact form and identify the request
            as clearly as possible.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

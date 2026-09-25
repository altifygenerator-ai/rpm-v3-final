import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import JobRequestForm from "@/components/job-request-form";
import { stockImages } from "@/data/stock-images";

export const metadata: Metadata = {
  title: "Get Help With Land & Property Work in Arkansas",
  description:
    "Tell Arkansas Land Pros what needs done, where the property is, and how to reach you for land clearing, dirt work, drainage, driveways, cleanup, hauling, and related property work.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <VisualHero
          breadcrumbs={[{ href: "/", label: "Home" }, { label: "Get Project Help" }]}
          eyebrow="TELL US ABOUT THE PROPERTY"
          title="Need work done? Send the basics and we’ll take it from there."
          description="Where is the property? What needs changed? How soon are you hoping to get it handled? You do not need a polished scope or contractor terminology."
          image={stockImages.generalProperty.src}
          imageAlt={stockImages.generalProperty.alt}
        />

        <section className="page-grid">
          <article className="page-copy">
            <h2>A few details make the first conversation easier</h2>
            <ul>
              <li>The town, property address, or nearest community.</li>
              <li>What the property looks like now and what you want changed.</li>
              <li>Approximate acreage, driveway length, or project size if known.</li>
              <li>Photos of the work area, access, slope, drainage, or driveway if available.</li>
              <li>Any timing, access, utility, wet-ground, rock, or haul-off concerns you already know about.</li>
            </ul>

            <h2>What happens next</h2>
            <p>
              Your project details are reviewed and may be shared with an
              independent service provider that can take a closer look. The
              provider handles its own estimate, scheduling, licensing,
              insurance, permits, and completed work.
            </p>

            <h2>For emergencies, call the right service first</h2>
            <p>
              Do not use this form for downed power lines, gas leaks, fire,
              immediate flood danger, or another emergency. Contact the
              appropriate utility or emergency service first.
            </p>
          </article>

          <aside className="page-aside">
            <JobRequestForm source="contact-page" heading="Tell us what needs done." />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

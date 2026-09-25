import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import VisualHero from "@/components/visual-hero";
import { stockImages } from "@/data/stock-images";
import { siteData } from "@/data/site";

export const metadata: Metadata = {
  title: "How Arkansas Land Pros Works",
  description:
    "Arkansas Land Pros helps property owners describe land-service projects and connect with an independent service provider that may be able to help.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <VisualHero
          breadcrumbs={[{ href: "/", label: "Home" }, { label: "How It Works" }]}
          eyebrow="A SIMPLER START FOR LAND WORK"
          title="You know what the property needs. We help get the conversation started."
          description="Clearing, dirt work, drainage, driveways, cleanup, hauling, and rural-property jobs can be hard to describe if you do not work around equipment every day. Plain language is enough."
          image={stockImages.cabinProperty.src}
          imageAlt={stockImages.cabinProperty.alt}
          ctaHref="/contact"
          ctaLabel="Tell us about your property"
        />

        <section className="article-shell">
          <section>
            <h2>Start with what is wrong — or what you want changed</h2>
            <p>
              “The driveway keeps washing out,” “the back acre has grown up,” or
              “I need this area ready before a mobile home goes in” are all good
              starting points. You do not need to diagnose the job first.
            </p>
          </section>

          <section>
            <h2>Add the details you already know</h2>
            <p>
              Property location, approximate size, photos, access, timing, slope,
              wet areas, rock, and what the land will be used for afterward all
              help someone understand the project faster.
            </p>
          </section>

          <section>
            <h2>Available across Arkansas</h2>
            <p>
              Property owners can reach out from anywhere in the state. We have
              especially detailed coverage around Southwest Arkansas, Hot
              Springs, the Ouachitas, Greers Ferry Lake, and Central Arkansas.
            </p>
          </section>

          <section>
            <h2>Who handles the work?</h2>
            <p>{siteData.disclosure}</p>
          </section>

          <section>
            <h2>Ready to explain the job?</h2>
            <p>
              Send the property area and the rough details. If you are not sure
              which service fits, choose the closest option or use the project
              assistant.
            </p>
            <Link href="/contact" className="work-button mt-5">
              Tell us about the job
            </Link>
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

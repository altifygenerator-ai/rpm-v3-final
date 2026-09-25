import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get Land-Service Leads in Arkansas | Join Arkansas Land Pros",
  description:
    "Create a free Arkansas Land Pros contractor profile, get listed on the site, preview matching property-service leads, and pay only for the opportunities you choose to unlock.",
  alternates: { canonical: "/pros" },
};

export default async function ProsPage() {
  const admin = createAdminClient();
  const { data: pros } = await admin
    .from("contractor_profiles")
    .select("id,business_name,slug,description,city,state,phone,website_url,featured")
    .eq("status", "active")
    .eq("public_profile_enabled", true)
    .order("featured", { ascending: false })
    .order("business_name")
    .limit(24);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="pro-hero">
          <div>
            <p className="field-label field-label-light">FOR ARKANSAS CONTRACTORS</p>
            <h1>Get listed free. Pay only for the leads you want.</h1>
            <p>
              Build a public Arkansas Land Pros profile, choose the work and areas that fit your business,
              and preview matching opportunities before you spend anything.
            </p>
            <div className="pro-hero-actions">
              <Link href="/pros/join" className="work-button">Create my free profile</Link>
              <Link href="/pros/sign-in" className="pro-secondary-link">Contractor sign in →</Link>
            </div>
          </div>
          <div className="pro-value-board">
            <strong>WHAT YOU GET</strong>
            <p>Public business profile with your services, areas, website, and contact information.</p>
            <p>Matching lead previews with job type, area, rough size, timing, quality, and unlock price.</p>
            <p>No monthly fee required to join. Unlock the opportunities that make sense for your business.</p>
            <p>Standard leads are limited rather than being sold over and over indefinitely.</p>
          </div>
        </section>

        <section className="pro-how">
          <div>
            <p className="field-label">HOW IT WORKS</p>
            <h2>Keep the jobs that fit. Skip the ones that don’t.</h2>
          </div>
          <div className="pro-how-steps">
            <article><strong>Set up your profile</strong><p>Choose the work you handle and the Arkansas communities you serve.</p></article>
            <article><strong>Preview matching work</strong><p>See the service, general area, project summary, timing, rough size, quality band, and price before you buy.</p></article>
            <article><strong>Unlock when it makes sense</strong><p>Pay the displayed lead price through secure Stripe checkout. Successful payment reveals the full homeowner contact and project details.</p></article>
          </div>
        </section>

        <section className="pro-directory">
          <div className="pro-directory-head">
            <p className="field-label">ARKANSAS LAND PROS DIRECTORY</p>
            <h2>Contractors already on the site</h2>
          </div>
          {pros?.length ? (
            <div className="pro-directory-grid">
              {pros.map((pro) => (
                <Link href={`/pros/${pro.slug}`} key={pro.id} className="pro-directory-card">
                  <span>{pro.city ? `${pro.city}, ${pro.state}` : pro.state}</span>
                  <strong>{pro.business_name}</strong>
                  <p>{pro.description || "Land and property services in Arkansas."}</p>
                  <b>View contractor profile →</b>
                </Link>
              ))}
            </div>
          ) : (
            <p>Contractor profiles are opening now.</p>
          )}
        </section>

        <section className="pro-final-cta">
          <h2>Want your business on Arkansas Land Pros?</h2>
          <p>Create the profile free. You decide which matching leads are worth unlocking.</p>
          <Link href="/pros/join" className="work-button">Join Arkansas Land Pros</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { createAdminClient } from "@/lib/supabase/admin";
import { serviceBySlug } from "@/data/services";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data } = await admin
    .from("contractor_profiles")
    .select("business_name,description,city,state")
    .eq("slug", slug)
    .eq("status", "active")
    .eq("public_profile_enabled", true)
    .maybeSingle();
  if (!data) return {};
  return {
    title: `${data.business_name} | Arkansas Land Pro`,
    description: data.description || `${data.business_name} provides land and property services in ${data.city || data.state}.`,
    alternates: { canonical: `/pros/${slug}` },
  };
}

export default async function PublicProPage({ params }: Props) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data: pro } = await admin
    .from("contractor_profiles")
    .select("id,business_name,slug,contact_name,phone,website_url,facebook_url,description,logo_url,city,state,zip,insurance_verified,license_verified")
    .eq("slug", slug)
    .eq("status", "active")
    .eq("public_profile_enabled", true)
    .maybeSingle();
  if (!pro) notFound();

  const [{ data: serviceRows }, { data: territories }] = await Promise.all([
    admin.from("contractor_services").select("service_slug").eq("contractor_id", pro.id).eq("enabled", true),
    admin.from("contractor_territories").select("city,county,zip").eq("contractor_id", pro.id),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="pro-public-hero">
          <div className="pro-public-title">
            {pro.logo_url ? (
              // Contractor-provided HTTPS logo; server validation restricts the URL scheme.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pro.logo_url}
                alt={`${pro.business_name} logo`}
                className="pro-public-logo"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div>
              <p className="field-label field-label-light">ARKANSAS LAND PRO</p>
              <h1>{pro.business_name}</h1>
              <p>{pro.city ? `${pro.city}, ${pro.state}` : pro.state}</p>
              {pro.insurance_verified || pro.license_verified ? (
                <div className="pro-verification-badges">
                  {pro.insurance_verified ? <span>Insurance verified</span> : null}
                  {pro.license_verified ? <span>License verified</span> : null}
                </div>
              ) : null}
            </div>
          </div>
          <div className="pro-public-contact">
            {pro.phone ? <a href={`tel:${pro.phone}`}>Call {pro.phone}</a> : null}
            {pro.website_url ? <a href={pro.website_url} target="_blank" rel="noreferrer">Visit website</a> : null}
            {pro.facebook_url ? <a href={pro.facebook_url} target="_blank" rel="noreferrer">Facebook</a> : null}
          </div>
        </section>

        <section className="pro-public-body">
          <article>
            <h2>About {pro.business_name}</h2>
            <p>{pro.description || "Land and property services in Arkansas."}</p>
            <h2>Services</h2>
            <div className="pro-tags">
              {(serviceRows || []).map((row) => (
                <span key={row.service_slug}>{serviceBySlug.get(row.service_slug)?.shortTitle || row.service_slug}</span>
              ))}
            </div>
            <h2>Areas served</h2>
            <div className="pro-tags">
              {(territories || []).map((territory, index) => (
                <span key={index}>{territory.city || territory.county || territory.zip}</span>
              ))}
            </div>
          </article>
          <aside className="pro-profile-note">
            <strong>Need property work?</strong>
            <p>You can also tell Arkansas Land Pros about the project and we’ll help get the details in front of a provider that may be able to help.</p>
            <Link href="/contact" className="work-button">Tell us about the job</Link>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

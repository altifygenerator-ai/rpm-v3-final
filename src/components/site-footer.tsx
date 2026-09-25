import Link from "next/link";
import { services } from "@/data/services";
import { priorityAreas } from "@/data/areas";
import { siteData } from "@/data/site";

export default function SiteFooter() {
  const serviceLinks = services
    .filter((service) =>
      ["land-clearing", "dirt-work", "drainage-erosion", "driveway-repair", "forestry-mulching", "cleanup"].includes(service.slug)
    )
    .slice(0, 6);

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-stamp">ARKANSAS LAND PROS</div>
          <h2>Have land that needs work? Start with the basics.</h2>
          <p>{siteData.description}</p>
          <Link href="/contact" className="work-button inline-flex">
            Tell us about the job
          </Link>
        </div>

        <div className="footer-links">
          <div>
            <strong>LAND WORK</strong>
            {serviceLinks.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                {service.shortTitle}
              </Link>
            ))}
          </div>

          <div>
            <strong>POPULAR AREAS</strong>
            {priorityAreas.slice(0, 8).map((area) => (
              <Link key={area.slug} href={`/areas/${area.slug}`}>
                {area.name}
              </Link>
            ))}
          </div>

          <div>
            <strong>HELP & INFO</strong>
            <Link href="/about">How it works</Link>
            <Link href="/guides">Property guides</Link>
            <Link href="/areas">Areas we cover</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/pros">For contractors</Link>
            <Link href="/pros/sign-in">Contractor sign in</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>

      <div className="footer-disclosure">
        <p>{siteData.disclosure}</p>
        <span>© {new Date().getFullYear()} Arkansas Land Pros</span>
      </div>
    </footer>
  );
}

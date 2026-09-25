import Link from "next/link";
import TrackedLink from "@/components/tracked-link";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas" },
  { href: "/guides", label: "Property Guides" },
  { href: "/about", label: "How It Works" },
  { href: "/pros", label: "For Contractors" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="route-strip">
        <span>LAND CLEARING • DIRT WORK • DRAINAGE • DRIVEWAYS</span>
        <span className="route-strip-wide">
          SOUTHWEST ARKANSAS / HOT SPRINGS / OUACHITAS / GREERS FERRY LAKE
        </span>
      </div>

      <div className="masthead">
        <Link href="/" className="brand-lockup" aria-label="Arkansas Land Pros home">
          <span className="brand-mark">ALP</span>
          <span className="brand-copy">
            <strong>ARKANSAS</strong>
            <strong>LAND PROS</strong>
            <small>LAND WORK STARTS HERE</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <TrackedLink
          href="/contact"
          className="header-request"
          eventName="CTA Click"
          eventDetail="header-request"
        >
          GET PROJECT HELP
        </TrackedLink>

        <details className="mobile-menu">
          <summary>MENU</summary>
          <div className="mobile-menu-panel">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact">Get project help</Link>
          </div>
        </details>
      </div>
    </header>
  );
}

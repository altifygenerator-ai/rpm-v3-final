import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import JobRequestForm from "@/components/job-request-form";
import { services } from "@/data/services";
import { regions } from "@/data/regions";
import { guides } from "@/data/guides";
import { siteData } from "@/data/site";
import { getSiteUrl } from "@/lib/site-url";

const featuredServiceSlugs = [
  "land-clearing",
  "dirt-work",
  "drainage-erosion",
  "driveway-repair",
  "forestry-mulching",
  "cleanup",
];

export default function Home() {
  const baseUrl = getSiteUrl();
  const featuredServices = services.filter((service) =>
    featuredServiceSlugs.includes(service.slug)
  );

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteData.name,
      url: baseUrl,
      description: siteData.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteData.name,
      url: baseUrl,
      description: siteData.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What kind of work can I request through Arkansas Land Pros?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Property owners can submit requests for land clearing, forestry mulching, brush clearing, dirt work, grading, driveways, culverts, drainage, cleanup, hauling, site preparation, and related Arkansas land work.",
          },
        },
        {
          "@type": "Question",
          name: "What parts of Arkansas are targeted first?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The heaviest launch focus is Southwest Arkansas, the Hot Springs area, the Ouachitas, and the existing Greers Ferry Lake search cluster, with additional Central Arkansas expansion pages.",
          },
        },
        {
          "@type": "Question",
          name: "Is Arkansas Land Pros the contractor performing every job?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Arkansas Land Pros is a lead and referral service. Requests may be shared with an independent service provider that may be able to help with the project.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <SiteHeader />

      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <section className="hero-yard">
          <div className="hero-image-wrap">
            <Image
              src="/images/hero/hero.jpg"
              alt="Arkansas land and property work"
              fill
              priority
              sizes="(min-width: 1100px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="hero-image-wash" />
            <div className="hero-stamp">
              ARKANSAS
              <span>LAND / WATER / ACCESS / CLEANUP</span>
            </div>
          </div>

          <div className="hero-copy-panel">
            <p className="field-label">PROPERTY WORK REQUESTS ACROSS ARKANSAS</p>
            <h1>
              Got land that
              <span>needs work?</span>
              Start here.
            </h1>
            <p className="hero-lede">
              Land clearing, dirt work, drainage, driveways, brush, cleanup, and
              the rough property jobs that are hard to explain in one phone call.
            </p>
            <div className="hero-links">
              <Link href="#request" className="work-button">
                Send the job details
              </Link>
              <Link href="/areas" className="plain-link">
                Check your area →
              </Link>
            </div>
            <div className="coverage-note">
              <strong>HEAVIEST LAUNCH FOCUS</strong>
              <span>
                Amity / Glenwood / Hot Springs / Mount Ida / Arkadelphia /
                Malvern / Murfreesboro — plus the established Greers Ferry Lake
                search area.
              </span>
            </div>
          </div>

          <aside className="hero-request" id="request">
            <JobRequestForm compact source="homepage-hero" />
          </aside>
        </section>

        <section className="service-ledger" aria-labelledby="work-heading">
          <div className="ledger-intro">
            <p className="field-label">WHAT PEOPLE COME HERE FOR</p>
            <h2 id="work-heading">
              Start with the property problem, not the perfect service name.
            </h2>
            <p>
              The site is built around the way landowners actually describe a
              job: the drive keeps washing out, the lot has grown in, the brush
              is taking over, or the property needs cleaned up before something
              else can happen.
            </p>
          </div>

          <div className="ledger-list">
            {featuredServices.map((service) => (
              <Link
                href={`/services/${service.slug}`}
                className="ledger-row"
                key={service.slug}
              >
                <div className="ledger-photo">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 900px) 250px, 38vw"
                    className="object-cover"
                  />
                </div>
                <div className="ledger-title">
                  <span>{service.shortTitle}</span>
                  <strong>{service.summary}</strong>
                </div>
                <p>{service.description}</p>
                <span className="ledger-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>

          <div className="ledger-foot">
            <Link href="/services">See every service request category →</Link>
          </div>
        </section>

        <section className="route-board">
          <div className="route-board-heading">
            <p className="field-label field-label-light">TARGET MARKETS</p>
            <h2>Built statewide. Focused where the leads are useful first.</h2>
            <p>
              We are not trying to fake a hundred identical city pages. The
              launch starts with distinct regional clusters and grows outward
              from there.
            </p>
          </div>

          <div className="route-columns">
            {regions.map((region) => (
              <article className="route-region" key={region.slug}>
                <Link href={`/regions/${region.slug}`} className="route-region-title">
                  <span>{region.name}</span>
                  <b>VIEW REGION</b>
                </Link>
                <p>{region.summary}</p>
                <small>{region.focus}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="routing-story">
          <div className="routing-label">HOW A REQUEST MOVES</div>
          <div className="routing-copy">
            <h2>No directory maze. No ten-company quote form.</h2>
            <p>
              You send the property area, the kind of work, and a plain-English
              description. The request is reviewed and routed to a service
              provider that may be able to help. Southwest Arkansas is the
              priority routing area at launch.
            </p>
          </div>
          <div className="routing-details">
            <div>
              <strong>START SIMPLE</strong>
              <p>
                A phone number, town, work type, and short description are enough
                to open the request.
              </p>
            </div>
            <div>
              <strong>KEEP THE SOURCE</strong>
              <p>
                Landing page, referrer, and campaign tags stay with the lead so
                we can see what actually creates useful work.
              </p>
            </div>
            <div>
              <strong>CUT THE SPAM</strong>
              <p>
                Turnstile, form traps, validation, timing checks, and rate limits
                are built into the intake instead of being added later.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-yard">
          <div className="guide-yard-head">
            <p className="field-label">PROPERTY OWNER NOTES</p>
            <h2>Useful information before the equipment ever shows up.</h2>
          </div>

          <div className="guide-lines">
            {guides.slice(0, 4).map((guide) => (
              <Link href={`/guides/${guide.slug}`} key={guide.slug}>
                <small>{guide.eyebrow}</small>
                <strong>{guide.title}</strong>
                <p>{guide.description}</p>
              </Link>
            ))}
          </div>

          <Link href="/guides" className="plain-link dark-link">
            Browse the full property guide →
          </Link>
        </section>

        <section className="home-faq">
          <div className="faq-label">
            <span>STRAIGHT ANSWERS</span>
            <h2>Before you send the job.</h2>
          </div>

          <div className="faq-list">
            <details>
              <summary>Does Arkansas Land Pros perform every job?</summary>
              <p>{siteData.disclosure}</p>
            </details>
            <details>
              <summary>Can I request work outside the highlighted towns?</summary>
              <p>
                Yes. Requests can come from anywhere in Arkansas. The highlighted
                areas are simply where the site is putting the most SEO and lead
                routing effort first.
              </p>
            </details>
            <details>
              <summary>What if I do not know exactly what service I need?</summary>
              <p>
                Choose the closest category or “not sure” and describe the
                property problem. A useful job description matters more than
                picking the perfect label.
              </p>
            </details>
            <details>
              <summary>Why do you ask for the property area up front?</summary>
              <p>
                Land work is heavily affected by travel, access, terrain,
                disposal, materials, and equipment logistics. Location is one of
                the first details needed to decide whether a request is a fit.
              </p>
            </details>
          </div>
        </section>

        <section className="final-request">
          <div>
            <p className="field-label field-label-light">READY WHEN THE PROPERTY IS</p>
            <h2>Send the rough details. We can sort out the category after.</h2>
          </div>
          <Link href="/contact" className="work-button light-button">
            Start a job request
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

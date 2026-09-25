import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import JobRequestForm from "@/components/job-request-form";
import { services } from "@/data/services";
import { regions } from "@/data/regions";
import { guides } from "@/data/guides";
import { siteData } from "@/data/site";
import { stockImages } from "@/data/stock-images";
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
          name: "What kinds of land work can Arkansas Land Pros help with?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arkansas Land Pros can help connect property owners with pros for land clearing, forestry mulching, brush clearing, dirt work, grading, driveways, culverts, drainage, cleanup, hauling, site preparation, and related land work.",
          },
        },
        {
          "@type": "Question",
          name: "Where is Arkansas Land Pros available?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Property owners can reach out from anywhere in Arkansas, with detailed coverage around Southwest Arkansas, Hot Springs, the Ouachitas, Greers Ferry Lake, and Central Arkansas.",
          },
        },
        {
          "@type": "Question",
          name: "Who handles the actual work?",
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
              src={stockImages.hero.src}
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
            <p className="field-label">LAND CLEARING • DIRT WORK • DRAINAGE • DRIVEWAYS</p>
            <h1>
              Land work
              <span>without the runaround.</span>
              Across Arkansas.
            </h1>
            <p className="hero-lede">
              Tell us what needs cleared, graded, drained, repaired, hauled, or
              cleaned up. We’ll help get the job in front of a land-service pro
              who can take a look.
            </p>
            <div className="hero-links">
              <Link href="#request" className="work-button">
                Tell us about the job
              </Link>
              <Link href="/areas" className="plain-link">
                See areas we cover →
              </Link>
            </div>
            <div className="coverage-note">
              <strong>SERVING PROPERTY OWNERS ACROSS ARKANSAS</strong>
              <span>
                Amity / Glenwood / Hot Springs / Mount Ida / Arkadelphia /
                Malvern / Murfreesboro — plus Greers Ferry Lake and communities
                across Central Arkansas.
              </span>
            </div>
          </div>

          <aside className="hero-request" id="request">
            <JobRequestForm compact source="homepage-hero" />
          </aside>
        </section>

        <section className="service-ledger" aria-labelledby="work-heading">
          <div className="ledger-intro">
            <p className="field-label">COMMON LAND PROJECTS</p>
            <h2 id="work-heading">
              Clearing, dirt, drainage, driveways — and the jobs in between.
            </h2>
            <p>
              You do not need to know the trade name for the work. Tell us the
              driveway keeps washing out, the lot has grown in, the brush is
              taking over, or the property needs cleaned up before the next step.
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
            <Link href="/services">See all land & property services →</Link>
          </div>
        </section>

        <section className="route-board">
          <div className="route-board-heading">
            <p className="field-label field-label-light">AREAS WE COVER</p>
            <h2>Land & property help across Arkansas.</h2>
            <p>
              Browse the regions and communities we cover in more detail, or
              tell us about a project from anywhere in Arkansas.
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
          <div className="routing-label">HOW IT WORKS</div>
          <div className="routing-copy">
            <h2>Tell us what’s going on. We’ll help move the job forward.</h2>
            <p>
              Tell us where the property is, what needs done, and anything you
              already know about the size, access, or timing. We review the
              request and connect it with a service provider that may be able to
              help.
            </p>
          </div>
          <div className="routing-details">
            <div>
              <strong>START SIMPLE</strong>
              <p>
                A phone number, town, work type, and short description are enough
                to get started.
              </p>
            </div>
            <div>
              <strong>ADD WHAT YOU KNOW</strong>
              <p>
                Acreage, driveway length, photos, access issues, timing, or a
                simple description can all help someone understand the job.
              </p>
            </div>
            <div>
              <strong>ONE REQUEST IS ENOUGH</strong>
              <p>
                If the job touches clearing, dirt, drainage, hauling, or another
                category, put it all in one message. We can sort out the details.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-yard">
          <div className="guide-yard-head">
            <p className="field-label">LANDOWNER GUIDES</p>
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
            Browse all property guides →
          </Link>
        </section>

        <section className="home-faq">
          <div className="faq-label">
            <span>STRAIGHT ANSWERS</span>
            <h2>What property owners usually want to know.</h2>
          </div>

          <div className="faq-list">
            <details>
              <summary>Does Arkansas Land Pros perform every job?</summary>
              <p>{siteData.disclosure}</p>
            </details>
            <details>
              <summary>Can I get help outside the highlighted towns?</summary>
              <p>
                Yes. You can reach out from anywhere in Arkansas. The highlighted
                areas are communities we cover in more detail, but they are not
                the only places you can tell us about a project.
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
            <p className="field-label field-label-light">HAVE LAND THAT NEEDS WORK?</p>
            <h2>Tell us what you’re dealing with and where the property is.</h2>
          </div>
          <Link href="/contact" className="work-button light-button">
            Tell us about the job
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

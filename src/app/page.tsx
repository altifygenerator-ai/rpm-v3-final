import SiteHeader from "@/components/site-header";
import Hero from "@/components/hero";
import TrustBar from "@/components/trust-bar";
import ServicesGrid from "@/components/services-grid";
import FeaturedWork from "@/components/featured-work";
import WhyChooseUs from "@/components/why-choose-us";
import Testimonials from "@/components/testimonials";
import EstimateCTA from "@/components/estimate-cta";
import ContactSection from "@/components/contact-section";
import SiteFooter from "@/components/site-footer";
import SeoFocusSection from "@/components/seo-focus-section";
import SeasonalWork from "@/components/seasonal-work";
import FAQSection from "@/components/FAQSection";
export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Richards Land Management LLC",
        url: "https://www.richardslandmanagementllc.com/",
        areaServed: [
          "Greers Ferry, Arkansas",
          "Heber Springs, Arkansas",
          "Fairfield Bay, Arkansas",
          "Quitman, Arkansas",
          "Clinton, Arkansas",
          "Cleburne County, Arkansas",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Greers Ferry",
          addressRegion: "AR",
          addressCountry: "US",
        },
        description:
          "Land management, forestry mulching, land clearing, brush clearing, trail clearing, and property cleanup services near Greers Ferry, Arkansas.",
        serviceType: [
          "Forestry Mulching",
          "Land Clearing",
          "Brush Clearing",
          "Underbrush Removal",
          "Trail Clearing",
          "Property Cleanup",
          "Hunting Property Clearing",
          "Skid Steer Services",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Forestry Mulching and Land Clearing in Greers Ferry, Arkansas",
        provider: {
          "@type": "LocalBusiness",
          name: "Richards Land Management LLC",
          url: "https://www.richardslandmanagementllc.com/",
        },
        areaServed: {
          "@type": "Place",
          name: "Greers Ferry, Arkansas and surrounding areas",
        },
        serviceType: [
          "Forestry Mulching",
          "Land Clearing",
          "Brush Clearing",
          "Trail Clearing",
          "Underbrush Removal",
          "Hunting Property Clearing",
        ],
        description:
          "Forestry mulching, brush clearing, underbrush removal, trail clearing, and land clearing services for rural properties, hunting land, overgrown lots, and acreage near Greers Ferry, Arkansas.",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is forestry mulching?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Forestry mulching uses specialized equipment to grind brush, small trees, and overgrowth into mulch, helping clear land without hauling away large amounts of debris.",
            },
          },
          {
            "@type": "Question",
            name: "Do you clear overgrown land near Greers Ferry?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Richards Land Management LLC provides land clearing, brush clearing, underbrush removal, and property cleanup services near Greers Ferry, Arkansas and surrounding areas.",
            },
          },
          {
            "@type": "Question",
            name: "Can forestry mulching help hunting property?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Forestry mulching can help open trails, clear shooting lanes, reduce thick underbrush, improve access, and make hunting property easier to use and maintain.",
            },
          },
        ],
      },
    ]),
  }}
/>
        <Hero />
        <TrustBar />
        <ServicesGrid />
<SeoFocusSection />
<SeasonalWork />
<FeaturedWork />
        <WhyChooseUs />
        <Testimonials />
        <EstimateCTA />
        <FAQSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </>
  );
}
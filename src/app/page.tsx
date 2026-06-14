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
import { siteData } from "@/data/site";

const baseUrl = "https://www.richardslandmanagementllc.com";

export default function Home() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: siteData.name,
      url: baseUrl,
      telephone: siteData.phone,
      email: siteData.email,
      image: `${baseUrl}/images/og-cover.png`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Greers Ferry",
        addressRegion: "AR",
        addressCountry: "US",
      },
      areaServed: siteData.serviceArea.map((area) => ({
        "@type": "Place",
        name: area,
      })),
      description: siteData.description,
      sameAs: [siteData.socials.facebook],
      makesOffer: siteData.primaryServices.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
          areaServed: "Greers Ferry Lake and Central Arkansas",
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What property services do you offer around Greers Ferry Lake?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Richards Property Management, LLC offers land clearing, tree work, drainage solutions, erosion control, retaining walls, hauling, welding, water features, Airbnb maintenance, and general property services around Greers Ferry Lake and Central Arkansas.",
          },
        },
        {
          "@type": "Question",
          name: "Do you help with drainage and driveway washouts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Richards Property Management, LLC helps with drainage correction, runoff control, culvert work, erosion repair, grading, and driveway washout issues.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer free estimates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Property owners can call or send a message to request a free estimate for land clearing, tree work, drainage, hauling, cleanup, retaining walls, and other property services.",
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

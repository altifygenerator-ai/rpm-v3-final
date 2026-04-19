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

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <Hero />
        <TrustBar />
        <ServicesGrid />
        <FeaturedWork />
        <WhyChooseUs />
        <Testimonials />
        <EstimateCTA />
        <ContactSection />
      </main>

      <SiteFooter />
    </>
  );
}
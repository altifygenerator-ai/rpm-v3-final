import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="inner-hero">
          <p className="field-label field-label-light">NOT FOUND</p>
          <h1>That page is not on the route board.</h1>
          <p>
            The service or location may have moved. Use the main service and
            area indexes to get back to the right property-work page.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/services" className="work-button">Browse services</Link>
            <Link href="/areas" className="work-button light-button">Browse areas</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

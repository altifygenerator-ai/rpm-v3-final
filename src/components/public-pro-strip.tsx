import Link from "next/link";
import type { PublicPro } from "@/lib/public-pros";

export default function PublicProStrip({
  title,
  pros,
}: {
  title: string;
  pros: PublicPro[];
}) {
  if (!pros.length) return null;

  return (
    <section className="public-pro-strip">
      <div className="public-pro-strip-head">
        <div>
          <p className="field-label">ARKANSAS LAND PROS DIRECTORY</p>
          <h2>{title}</h2>
        </div>
        <Link href="/pros">Browse contractor directory →</Link>
      </div>

      <div className="public-pro-grid">
        {pros.map((pro) => (
          <Link href={`/pros/${pro.slug}`} key={pro.id}>
            <span>{pro.city ? `${pro.city}, ${pro.state}` : pro.state}</span>
            <strong>{pro.business_name}</strong>
            <p>
              {pro.description ||
                "Independent land and property service provider in Arkansas."}
            </p>
            <div>
              {pro.insurance_verified ? <b>Insurance verified</b> : null}
              {pro.license_verified ? <b>License verified</b> : null}
            </div>
            <em>View profile →</em>
          </Link>
        ))}
      </div>
      <small>
        Contractors listed here are independent businesses. Arkansas Land Pros
        does not guarantee availability, pricing, licensing requirements, or
        completed work.
      </small>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";

type Crumb = {
  href?: string;
  label: string;
};

type Props = {
  breadcrumbs: Crumb[];
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function VisualHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  ctaHref,
  ctaLabel,
}: Props) {
  return (
    <section className="visual-hero">
      <div className="visual-hero-copy">
        <Breadcrumbs items={breadcrumbs} />
        <p className="field-label field-label-light">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="visual-hero-lede">{description}</p>
        {ctaHref && ctaLabel ? (
          <Link href={ctaHref} className="work-button visual-hero-cta">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
      <div className="visual-hero-media">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 1000px) 44vw, 100vw"
          className="object-cover"
        />
        <div className="visual-hero-shade" />
      </div>
    </section>
  );
}

import { services } from "@/data/services";
import { areas } from "@/data/areas";
import { regions } from "@/data/regions";
import { guides } from "@/data/guides";
import { localLandings } from "@/data/local-landings";
import { areaBySlug } from "@/data/areas";
import { serviceBySlug } from "@/data/services";
import { imageForRegion, stockImages } from "@/data/stock-images";

export const dynamic = "force-static";

const ORIGIN = "https://www.arkansaslandpros.com";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type SitemapEntry = {
  path: string;
  priority: number;
  changefreq: "weekly" | "monthly";
  image?: string;
  imageTitle?: string;
};

export async function GET() {
  const entries: SitemapEntry[] = [
    { path: "", priority: 1, changefreq: "weekly", image: stockImages.hero.src, imageTitle: "Arkansas land and property work" },
    { path: "/services", priority: 0.9, changefreq: "monthly", image: stockImages.generalProperty.src, imageTitle: "Land and property services in Arkansas" },
    { path: "/areas", priority: 0.85, changefreq: "monthly", image: stockImages.ruralPropertyPrep.src, imageTitle: "Arkansas land service areas" },
    { path: "/guides", priority: 0.72, changefreq: "monthly", image: stockImages.drivewayRepair.src, imageTitle: "Arkansas landowner guides" },
    { path: "/about", priority: 0.65, changefreq: "monthly", image: stockImages.cabinProperty.src, imageTitle: "How Arkansas Land Pros works" },
    { path: "/contact", priority: 0.92, changefreq: "monthly", image: stockImages.generalProperty.src, imageTitle: "Get help with Arkansas property work" },
    { path: "/gallery", priority: 0.72, changefreq: "monthly", image: stockImages.outdoorBuilds.src, imageTitle: "Arkansas land and property project types" },
    { path: "/privacy", priority: 0.3, changefreq: "monthly" },
    { path: "/terms", priority: 0.3, changefreq: "monthly" },
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      priority: 0.88,
      changefreq: "monthly" as const,
      image: service.image,
      imageTitle: service.title,
    })),
    ...areas.map((area) => {
      const image = imageForRegion(area.region);
      return {
        path: `/areas/${area.slug}`,
        priority: area.priority === "expansion" ? 0.68 : 0.82,
        changefreq: "monthly" as const,
        image: image.src,
        imageTitle: `Land and property work in ${area.name}, Arkansas`,
      };
    }),
    ...regions.map((region) => {
      const image = imageForRegion(region.name);
      return {
        path: `/regions/${region.slug}`,
        priority: 0.78,
        changefreq: "monthly" as const,
        image: image.src,
        imageTitle: `${region.name} land and property services`,
      };
    }),
    ...localLandings.map((landing) => {
      const service = serviceBySlug.get(landing.service);
      const area = areaBySlug.get(landing.area);
      return {
        path: `/areas/${landing.area}/${landing.service}`,
        priority: 0.84,
        changefreq: "monthly" as const,
        image: service?.image,
        imageTitle:
          service && area
            ? `${service.shortTitle} in ${area.name}, Arkansas`
            : "Arkansas land services",
      };
    }),
    ...guides.map((guide) => ({
      path: `/guides/${guide.slug}`,
      priority: 0.7,
      changefreq: "monthly" as const,
    })),
  ];

  const body = entries
    .map((entry) => {
      const imageXml = entry.image
        ? `
    <image:image>
      <image:loc>${xmlEscape(entry.image)}</image:loc>
      <image:title>${xmlEscape(entry.imageTitle || "Arkansas land and property work")}</image:title>
    </image:image>`
        : "";

      return `  <url>
    <loc>${ORIGIN}${entry.path}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>${imageXml}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}

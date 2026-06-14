import { MetadataRoute } from "next";
import { servicePages } from "@/data/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.richardslandmanagementllc.com";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...servicePages.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: service.slug === "land-clearing" || service.slug === "tree-work" || service.slug === "drainage-erosion" ? 0.9 : 0.75,
    })),
  ];
}

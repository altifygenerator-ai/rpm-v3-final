import { MetadataRoute } from "next";
import { servicePages } from "@/data/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.richardslandmanagementllc.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
    },
    ...servicePages.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(),
    })),
  ];
}
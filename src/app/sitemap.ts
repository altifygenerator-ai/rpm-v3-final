import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { areas } from "@/data/areas";
import { regions } from "@/data/regions";
import { guides } from "@/data/guides";
import { localLandings } from "@/data/local-landings";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const staticRoutes = [
    "",
    "/services",
    "/areas",
    "/guides",
    "/about",
    "/contact",
    "/gallery",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/contact" ? 0.9 : 0.7,
    })),
    ...services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...areas.map((area) => ({
      url: `${baseUrl}/areas/${area.slug}`,
      changeFrequency: "monthly" as const,
      priority: area.priority === "expansion" ? 0.65 : 0.8,
    })),
    ...regions.map((region) => ({
      url: `${baseUrl}/regions/${region.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...localLandings.map((landing) => ({
      url: `${baseUrl}/areas/${landing.area}/${landing.service}`,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...guides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

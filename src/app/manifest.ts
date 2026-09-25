import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arkansas Land Pros",
    short_name: "Arkansas Land Pros",
    description:
      "Land clearing, dirt work, drainage, driveway, cleanup, and Arkansas property-service request intake.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f4f5",
    theme_color: "#171a1d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

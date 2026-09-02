import type { MetadataRoute } from "next";
import { config } from "@/data/config";

// Required by `output: "export"` — generated at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: config.websiteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
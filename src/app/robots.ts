import type { MetadataRoute } from "next";
import { config } from "@/data/config";

// Required by `output: "export"` — generated at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${config.websiteUrl}/sitemap.xml`,
  };
}
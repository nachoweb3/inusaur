import type { NextConfig } from "next";

// Static export for GitHub Pages (project site at /<repo>/).
// Override with NEXT_PUBLIC_BASE_PATH="" when a custom domain is used.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true }, // required for static export
  // Baked into the client bundle at build time so <img> helpers can
  // build asset URLs that work under the Pages subpath.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
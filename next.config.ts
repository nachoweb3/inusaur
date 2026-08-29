import type { NextConfig } from "next";

// Static export for GitHub Pages (project site at /<repo>/).
// Override with NEXT_PUBLIC_BASE_PATH="" when a custom domain is used.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/shinycapibara";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true }, // required for static export
};

export default nextConfig;
import type { NextConfig } from "next";

const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  // Server-rendered by default (needed for API routes + Briefings module)
  // Set DEPLOY_TARGET=gh-pages for static export to GitHub Pages
  ...(isGhPages && { output: "export" }),
  ...(!isGhPages && { output: "standalone" }),
  basePath: isGhPages ? "/CAIP-MissionControl" : "",
  images: { unoptimized: true },
};

export default nextConfig;

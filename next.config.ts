import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGhPages ? "/CAIP-MissionControl" : "",
  images: { unoptimized: true },
};

export default nextConfig;

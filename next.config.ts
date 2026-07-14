import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  }
} as any;

(nextConfig as any).allowedDevOrigins = ["192.168.0.105"];

export default nextConfig;

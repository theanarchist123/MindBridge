import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
} as any;

(nextConfig as any).allowedDevOrigins = ["192.168.0.105"];

export default nextConfig;

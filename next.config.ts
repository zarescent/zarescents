import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "semolpvwbthtzikqlfbt.supabase.co",
      },
    ],
  },
};

export default nextConfig;

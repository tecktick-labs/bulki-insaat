import type { NextConfig } from "next";
import planRoutes from "./src/data/plan-routes.json";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/elysprime.firebasestorage.app/o/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Proje konumu Pendik değil Sultanbeyli olarak düzeltildi; yayında olan eski
  // blog adresi 308 ile yeni adrese taşınır.
  async redirects() {
    return [
      ...planRoutes.map((route) => ({
        source: `/daire-planlari/${route.id}`,
        destination: `/daireler/${route.slug}`,
        permanent: true,
      })),
      { source: "/daire-planlari", destination: "/sultanbeyli-satilik-daire", permanent: true },
      {
        source: "/blog/pendikte-yasam-ulasim-ve-gunluk-hayat",
        destination: "/blog/sultanbeylide-yasam-ulasim-ve-gunluk-hayat",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

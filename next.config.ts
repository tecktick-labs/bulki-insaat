import type { NextConfig } from "next";

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
      {
        source: "/blog/pendikte-yasam-ulasim-ve-gunluk-hayat",
        destination: "/blog/sultanbeylide-yasam-ulasim-ve-gunluk-hayat",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

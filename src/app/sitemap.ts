import type { MetadataRoute } from "next";
import { plans } from "@/lib/plans";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/proje", priority: 0.9, changeFrequency: "monthly" },
    { path: "/daire-planlari", priority: 0.9, changeFrequency: "monthly" },
    { path: "/proje-durumu", priority: 0.8, changeFrequency: "weekly" },
    { path: "/konum", priority: 0.7, changeFrequency: "yearly" },
    { path: "/iletisim", priority: 0.7, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...plans.map((plan) => ({
      url: absoluteUrl(`/daire-planlari/${plan.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}

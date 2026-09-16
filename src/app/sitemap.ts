import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content.server";
import { postUrl } from "@/lib/content-types";
import { campaignUrl } from "@/lib/campaigns";
import { getSection } from "@/lib/sections.server";
import { plans } from "@/lib/plans";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [posts, campaigns] = await Promise.all([getPosts(), getSection("campaigns")]);

  const staticRoutes: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/proje", priority: 0.9, changeFrequency: "monthly" },
    { path: "/daire-planlari", priority: 0.9, changeFrequency: "monthly" },
    { path: "/tanitimlar", priority: 0.8, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
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
    ...campaigns.map((campaign) => ({
      url: absoluteUrl(campaignUrl(campaign)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...plans.map((plan) => ({
      url: absoluteUrl(`/daire-planlari/${plan.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(postUrl(post)),
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

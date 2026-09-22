import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content.server";
import { postUrl } from "@/lib/content-types";
import { campaignUrl } from "@/lib/campaigns";
import { getSection } from "@/lib/sections.server";
import { plans } from "@/lib/plans";
import { absoluteUrl } from "@/lib/site";
import { getUpdatedAtMap, latestOf, type DocKey } from "@/lib/updated-at.server";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

/** `lastmod` için okunacak dokümanlar — her rota kendi içeriğinin kaynağına bağlanır. */
const SOURCES: DocKey[] = [
  "projectData/website",
  "pages/proje",
  "pages/daire-planlari",
  "pages/konum",
  "pages/iletisim",
  "pages/blog",
  "pages/tanitimlar",
  "sections/campaigns",
  "sections/gallery",
  "sections/plan-rooms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, campaigns, dates] = await Promise.all([getPosts(), getSection("campaigns"), getUpdatedAtMap(SOURCES)]);

  const latest = (...keys: DocKey[]) => latestOf(dates, ...keys);
  /** Bir yazı türünün en son güncellenme tarihi — liste sayfalarının lastmod'u. */
  const newestPost = (type: "blog" | "tanitim") => {
    const times = posts.filter((post) => post.type === type).map((post) => new Date(post.updatedAt).getTime());
    return times.length ? new Date(Math.max(...times)) : undefined;
  };

  // Plan sayfalarının içeriği iki kaynaktan gelir: daire kayıtları (sections/plan-rooms)
  // ve kat/konum ailesine ait ortak metinler (pages/daire-planlari).
  const planDate = latest("sections/plan-rooms", "pages/daire-planlari");

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: Entry["changeFrequency"];
    lastModified?: Date;
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly", lastModified: latest("projectData/website", "sections/campaigns", "sections/gallery", "sections/plan-rooms") },
    { path: "/proje", priority: 0.9, changeFrequency: "monthly", lastModified: latest("pages/proje") },
    { path: "/daire-planlari", priority: 0.9, changeFrequency: "monthly", lastModified: planDate },
    { path: "/tanitimlar", priority: 0.8, changeFrequency: "weekly", lastModified: maxDate(latest("pages/tanitimlar"), newestPost("tanitim")) },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly", lastModified: maxDate(latest("pages/blog"), newestPost("blog")) },
    { path: "/konum", priority: 0.7, changeFrequency: "yearly", lastModified: latest("pages/konum") },
    { path: "/iletisim", priority: 0.7, changeFrequency: "yearly", lastModified: latest("pages/iletisim") },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...campaigns.map((campaign) => ({
      url: absoluteUrl(campaignUrl(campaign)),
      lastModified: latest("sections/campaigns"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...plans.map((plan) => ({
      url: absoluteUrl(`/daire-planlari/${plan.slug}`),
      lastModified: planDate,
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

function maxDate(...values: (Date | undefined)[]): Date | undefined {
  const times = values.filter((value): value is Date => value instanceof Date).map((value) => value.getTime());
  return times.length ? new Date(Math.max(...times)) : undefined;
}

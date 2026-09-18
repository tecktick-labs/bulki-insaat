import "server-only";
import type { SiteSections } from "@/components/SiteContent";
import { getSection } from "./sections.server";

/** Ana sayfanın ihtiyaç duyduğu tüm bölümleri tek seferde okur. */
export async function getSiteSections(): Promise<SiteSections> {
  const [campaigns, gallery, documents, plans] = await Promise.all([
    getSection("campaigns"),
    getSection("gallery"),
    getSection("documents"),
    getSection("plan-rooms"),
  ]);

  return { campaigns, gallery, documents, plans };
}

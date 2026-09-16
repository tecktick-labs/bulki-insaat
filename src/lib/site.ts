export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://elysprime.com").replace(/\/+$/, "");

export const siteName = "Elys Prime";
export const companyName = "BÜLKİ YAPI ve ÇÖZÜM KONUT Ortaklığı";
export const locale = "tr_TR";

/** Canonical etiketiyle sitemap'in birebir aynı URL'i üretmesi için kök "/" sondaki eğik çizgisiz döner. */
export function absoluteUrl(path = "/") {
  if (path === "/" || path === "") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.elysprime.com").replace(/\/+$/, "");

export const siteName = "Elys Prime";
export const companyName = "Bulki Yapı Limited Şirketi";
export const locale = "tr_TR";

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

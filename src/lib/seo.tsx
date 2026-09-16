import type { Metadata } from "next";
import { absoluteUrl, companyName, locale, siteName } from "./site";
import type { ProjectContent } from "./project-content";

/**
 * Sayfa metadata'sını tek yerden kurar.
 *
 * Next'te bir sayfa `openGraph` döndürdüğünde üst katmandaki openGraph'ı
 * TAMAMEN değiştirir: dosya tabanlı opengraph-image, site adı ve dil
 * bilgisi sessizce kaybolur. Bu yüzden her sayfa bu yardımcıyı kullanır;
 * paylaşım görseli ve twitter kartı hiçbir sayfada eksik kalmaz.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const images = [{ url: image || absoluteUrl("/opengraph-image"), alt: imageAlt || title }];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName,
      locale,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pendik",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
  };
}

export function residenceSchema(content: ProjectContent) {
  const { general, location } = content;
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: siteName,
    url: absoluteUrl("/"),
    description: location.description,
    numberOfAccommodationUnits: general.totalUnits,
    numberOfAvailableAccommodationUnits: Math.max(0, general.totalUnits - general.unitsSold),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pendik",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.latitude,
      longitude: location.longitude,
    },
    developer: { "@type": "Organization", name: companyName },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function JsonLd({ schema }: { schema: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

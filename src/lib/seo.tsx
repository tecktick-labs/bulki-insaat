import { absoluteUrl, companyName, siteName } from "./site";
import type { ProjectContent } from "./project-content";

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

import { Bus, CarFront, ExternalLink, TrainFront } from "lucide-react";
import type { Metadata } from "next";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import BlockRenderer from "@/components/BlockRenderer";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { getPageCopy } from "@/lib/content.server";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl, companyName } from "@/lib/site";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy("konum");
  return pageMetadata({ title: copy.seoTitle, description: copy.seoDescription, path: "/konum" });
}

export default async function KonumPage() {
  const [content, copy] = await Promise.all([getProjectContent(), getPageCopy("konum")]);
  const { location, general } = content;
  const mapEmbedUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=16&output=embed`;
  const mapDetailUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

  const cards = [
    { icon: TrainFront, label: location.metrics.metro.label, value: location.metrics.metro.walkMin, unit: "yürüyerek" },
    { icon: Bus, label: location.metrics.bus.label, value: location.metrics.bus.walkMin, unit: "yürüyerek" },
    { icon: CarFront, label: location.metrics.center.label, value: location.metrics.center.driveMin, unit: "araçla" },
  ];

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Konum" title={copy.title} lead={copy.lead}>
        <Breadcrumbs trail={[{ name: "Konum", path: "/konum" }]} />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <dl className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="flex items-center justify-between gap-4 bg-[#1f221f] px-5 py-7 lg:px-8">
              <div className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-[#181a18] text-[#d8b792]">
                  <card.icon size={18} />
                </span>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[.14em] text-white/60">{card.label}</dt>
                  <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.12em] text-white/30">{card.unit}</span>
                </div>
              </div>
              <dd className="flex items-baseline gap-1">
                <strong className="display-font text-4xl font-semibold leading-none">{card.value}</strong>
                <span className="display-font text-base italic text-[#d8b792]">dk</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-2xl text-[15px] leading-8 text-white/60">{location.description}</p>
      </Container>

      <Container className="max-w-3xl pb-4 lg:pb-8">
        <BlockRenderer blocks={copy.blocks} />
      </Container>

      <Container className="py-12 lg:py-16">
        <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-4xl">Harita üzerinde</h2>
        <div className="relative mt-8 aspect-[16/10] overflow-hidden bg-[#c9c2b5] lg:aspect-[16/7]">
          <iframe
            src={mapEmbedUrl}
            title="Elys Prime Google konum haritası"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        </div>
        <a
          href={mapDetailUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 border border-white/20 px-5 py-4 text-[10px] font-bold uppercase tracking-[.14em] transition-colors hover:bg-[#d8b792] hover:text-[#181a18]"
        >
          Google Maps&apos;te aç <ExternalLink size={13} />
        </a>
      </Container>

      <CallToAction whatsappLink={general.whatsappLink} email={general.email} />

      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Konum", path: "/konum" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Place",
            name: "Elys Prime",
            url: absoluteUrl("/konum"),
            address: {
              "@type": "PostalAddress",
              streetAddress: "Akşemsettin Mah.",
              addressLocality: "Sultanbeyli",
              addressRegion: "İstanbul",
              addressCountry: "TR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: location.latitude,
              longitude: location.longitude,
            },
            containedInPlace: { "@type": "Organization", name: companyName },
          },
        ]}
      />
    </PageShell>
  );
}

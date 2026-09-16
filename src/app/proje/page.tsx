import type { Metadata } from "next";
import Image from "next/image";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import BlockRenderer from "@/components/BlockRenderer";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { getBuildImage } from "@/lib/media";
import { getPageCopy } from "@/lib/content.server";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, breadcrumbSchema, residenceSchema } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy("proje");
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
    alternates: { canonical: "/proje" },
    openGraph: { url: "/proje", title: copy.seoTitle, description: copy.seoDescription },
  };
}

const highlightImages = [3, 5, 6, 9];

export default async function ProjePage() {
  const [content, copy] = await Promise.all([getProjectContent(), getPageCopy("proje")]);
  const { general } = content;

  const facts = [
    { value: general.constructionArea.toLocaleString("tr-TR"), label: "m² inşaat alanı" },
    { value: String(content.blocks.length), label: "blok" },
    { value: String(general.totalUnits), label: "daire" },
    { value: "16", label: "farklı daire tipi" },
  ];

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Proje" title={copy.title} lead={copy.lead}>
        <Breadcrumbs trail={[{ name: "Proje", path: "/proje" }]} />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <dl className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-[#1f221f] px-5 py-7 lg:px-8">
              <dd className="display-font text-4xl font-medium tracking-[-.04em] text-[#d8b792] lg:text-5xl">{fact.value}</dd>
              <dt className="mt-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/45">{fact.label}</dt>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="max-w-3xl pb-4 lg:pb-8">
        <BlockRenderer blocks={copy.blocks} />
      </Container>

      <Container className="py-12 lg:py-16">
        <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-4xl">Projeden görseller</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {highlightImages.map((index) => (
            <div key={index} className="relative aspect-[4/3] overflow-hidden bg-black">
              <Image
                src={getBuildImage(index)}
                alt={`Elys Prime projesinden görsel ${index}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>

      <CallToAction whatsappLink={general.whatsappLink} email={general.email} />

      <JsonLd
        schema={[
          residenceSchema(content),
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Proje", path: "/proje" },
          ]),
        ]}
      />
    </PageShell>
  );
}

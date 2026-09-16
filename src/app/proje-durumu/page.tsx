import type { Metadata } from "next";
import Image from "next/image";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import BlockRenderer from "@/components/BlockRenderer";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { BUILD_IMAGE_COUNT, getBuildImage } from "@/lib/media";
import { getPageCopy } from "@/lib/content.server";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy("proje-durumu");
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
    alternates: { canonical: "/proje-durumu" },
    openGraph: { url: "/proje-durumu", title: copy.seoTitle, description: copy.seoDescription },
  };
}

export default async function ProjeDurumuPage() {
  const [content, copy] = await Promise.all([getProjectContent(), getPageCopy("proje-durumu")]);
  const { general, blocks } = content;
  const remaining = Math.max(0, general.totalUnits - general.unitsSold);

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Güncel Durum" title={copy.title} lead={copy.lead}>
        <Breadcrumbs trail={[{ name: "Proje Durumu", path: "/proje-durumu" }]} />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <dl className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-4">
          {[
            { value: `%${general.completionRate}`, label: "tamamlandı" },
            { value: String(general.totalUnits), label: "toplam daire" },
            { value: String(general.unitsSold), label: "satılan daire" },
            { value: String(remaining), label: "satıştaki daire" },
          ].map((item) => (
            <div key={item.label} className="bg-[#1f221f] px-5 py-7 lg:px-8">
              <dd className="display-font text-4xl font-medium tracking-[-.04em] text-[#d8b792] lg:text-5xl">{item.value}</dd>
              <dt className="mt-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/45">{item.label}</dt>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="max-w-3xl pb-4 lg:pb-8">
        <BlockRenderer blocks={copy.blocks} />
      </Container>

      <Container className="py-12 lg:py-16">
        <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-4xl">Blok bazlı durum</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Elys Prime blok bazlı daire ve satış durumu</caption>
            <thead>
              <tr className="border-b border-white/15 text-[10px] font-bold uppercase tracking-[.14em] text-white/45">
                <th scope="col" className="py-4 pr-4">Blok</th>
                <th scope="col" className="py-4 pr-4">Toplam daire</th>
                <th scope="col" className="py-4 pr-4">Satılan</th>
                <th scope="col" className="py-4 pr-4">Kalan</th>
                <th scope="col" className="py-4">Satış oranı</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => {
                const rate = block.total ? Math.round((block.sold / block.total) * 100) : 0;
                return (
                  <tr key={block.name} className="border-b border-white/[.07] text-white/70">
                    <th scope="row" className="py-4 pr-4 font-semibold text-[#f6f1eb]">{block.name}</th>
                    <td className="py-4 pr-4">{block.total}</td>
                    <td className="py-4 pr-4">{block.sold}</td>
                    <td className="py-4 pr-4">{Math.max(0, block.total - block.sold)}</td>
                    <td className="py-4">
                      <span className="flex items-center gap-3">
                        <span className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
                          <span className="block h-full rounded-full bg-[#d8b792]" style={{ width: `${rate}%` }} />
                        </span>
                        <span className="text-[#d8b792]">%{rate}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>

      <Container className="py-12 lg:py-16">
        <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-4xl">Proje galerisi</h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-8 text-white/55">
          Aşağıdaki görseller projenin mimari kurgusunu, peyzaj alanlarını ve cephe detaylarını gösteriyor.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: BUILD_IMAGE_COUNT }, (_, index) => index + 1).map((index) => (
            <div key={index} className="relative aspect-[4/3] overflow-hidden bg-black">
              <Image
                src={getBuildImage(index)}
                alt={`Elys Prime proje görseli ${index}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>

      <CallToAction whatsappLink={general.whatsappLink} email={general.email} />

      <JsonLd
        schema={breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: "Proje Durumu", path: "/proje-durumu" },
        ])}
      />
    </PageShell>
  );
}

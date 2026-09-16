import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { planlarPage } from "@/data/copy";
import { blockNames, planImage, planTitle, plans } from "@/lib/plans";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daire Planları",
  description:
    "Elys Prime'ın 4 bloğundaki 16 daire tipi: normal kat köşe ve orta tipler, çatı katı ve dubleks planlar. Tüm kat planlarını büyüterek inceleyin.",
  alternates: { canonical: "/daire-planlari" },
  openGraph: { url: "/daire-planlari", title: "Elys Prime Daire Planları" },
};

export default async function DairePlanlariPage() {
  const content = await getProjectContent();

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Daire Planları" title={planlarPage.title} lead={planlarPage.lead}>
        <Breadcrumbs trail={[{ name: "Daire Planları", path: "/daire-planlari" }]} />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <div className="max-w-3xl space-y-5">
          {planlarPage.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-[15px] leading-8 text-white/60">{paragraph}</p>
          ))}
        </div>
      </Container>

      {blockNames.map((block) => (
        <Container key={block} className="border-t border-white/[.07] py-10 lg:py-14">
          <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-4xl">{block} Blok</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {plans.filter((plan) => plan.block === block).map((plan) => (
              <Link
                key={plan.slug}
                href={`/daire-planlari/${plan.slug}`}
                className="group flex flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#252825] transition-colors hover:border-[#d8b792]/45"
              >
                <div className="relative aspect-[4/3] bg-[#eeece7]">
                  <Image
                    src={planImage(plan)}
                    alt={`${planTitle(plan)} daire planı`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-4"
                  />
                </div>
                <div className="flex items-end justify-between gap-3 border-t border-white/10 p-4">
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-[.16em] text-[#d8b792]">{plan.block} Blok</span>
                    <h3 className="mt-1 text-lg font-semibold">{plan.floor}</h3>
                    <p className="text-[11px] text-white/45">{plan.position}</p>
                  </div>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 transition-colors group-hover:bg-[#d8b792] group-hover:text-[#181a18]">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      ))}

      <CallToAction whatsappLink={content.general.whatsappLink} email={content.general.email} />

      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Daire Planları", path: "/daire-planlari" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Elys Prime daire planları",
            numberOfItems: plans.length,
            itemListElement: plans.map((plan, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: planTitle(plan),
              url: absoluteUrl(`/daire-planlari/${plan.slug}`),
            })),
          },
        ]}
      />
    </PageShell>
  );
}

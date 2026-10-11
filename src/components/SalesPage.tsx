import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import BlockRenderer from "@/components/BlockRenderer";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { getProjectContent } from "@/lib/project-content.server";
import { getSection } from "@/lib/sections.server";
import { getPageCopy } from "@/lib/content.server";
import { formatArea, planImage, planImageAlt } from "@/lib/plans";
import { planUrl, planSalesName, salesCategories, salesPath } from "@/lib/plan-routes";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const salesTitle = "Sultanbeyli Satılık Daireler";
export const salesDescription = "Elys Prime Sultanbeyli satılık 2+1, 3+1 ve dubleks daire seçeneklerini inceleyin. Planları karşılaştırın; güncel fiyat, ödeme planı ve randevu için bize ulaşın.";

const guidance: Record<string, { title: string; text: string }> = {
  "2-1": { title: "2+1 daire seçerken nelere bakmalı?", text: "Açık mutfaklı veya ayrı mutfaklı bir yaşam alanı mı tercih ediyorsunuz? Balkon ve teras seçeneklerini, oda ölçülerini ve depolama alanlarını birlikte karşılaştırın. Seçtiğiniz planın proje içindeki konumu ve güncel müsaitliği için satış ekibinden bilgi alın." },
  "3-1": { title: "Ailenize uygun 3+1 planı seçin", text: "Üç odalı daire seçeneklerinde mutfağın açık veya kapalı olması, ebeveyn banyosu ve giyinme odası günlük kullanımda fark yaratır. Plan çizimlerini inceleyerek odaların yerleşimini karşılaştırın; aile ihtiyaçlarınıza uygun daire için satış ekibimizle görüşün." },
  "dubleks": { title: "Dubleks dairelerde iki katı birlikte değerlendirin", text: "Dubleks seçerken yalnızca toplam alana bakmayın. Odaların katlara dağılımı, iç merdivenin konumu, her kattaki yaşam alanları ve teras ölçüleri kullanımınızı belirler. Her planın iki katını da inceleyin ve güncel seçenekleri satış ekibimizden öğrenin." },
};

export default async function SalesPage({ categorySlug }: { categorySlug?: string }) {
  const [content, plans, copy] = await Promise.all([getProjectContent(), getSection("plan-rooms"), getPageCopy("daire-planlari")]);
  const category = salesCategories.find((item) => item.slug === categorySlug);
  const selected = category ? plans.filter((plan) => plan.rooms === category.rooms) : plans;
  const title = category?.title ?? salesTitle;
  const description = category?.description ?? salesDescription;
  const path = category ? `${salesPath}/${category.slug}` : salesPath;
  const trail = [
    { name: "Satılık Daireler", path: salesPath },
    ...(category ? [{ name: category.name, path }] : []),
  ];

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Elys Prime · Sultanbeyli" title={title} lead={description}>
        <Breadcrumbs trail={trail} />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <nav aria-label="Daire seçenekleri" className="flex flex-wrap gap-3">
          {[{ name: "Tüm Daireler", path: salesPath }, ...salesCategories.map((item) => ({ name: item.name, path: `${salesPath}/${item.slug}` }))].map((item) => (
            <Link key={item.path} href={item.path} aria-current={item.path === path ? "page" : undefined} className={`border px-5 py-3 text-sm transition-colors ${item.path === path ? "border-[#d8b792] bg-[#d8b792] text-[#181a18]" : "border-white/15 text-white/65 hover:border-[#d8b792]"}`}>
              {item.name}
            </Link>
          ))}
        </nav>

        {!category && (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {salesCategories.map((item) => (
              <Link key={item.slug} href={`${salesPath}/${item.slug}`} className="border border-white/10 bg-[#1f221f] p-6 transition-colors hover:border-[#d8b792]/45">
                <h2 className="display-font text-2xl text-[#d8b792]">{item.name}</h2>
                <p className="mt-4 text-sm leading-7 text-white/60">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm">Seçenekleri inceleyin <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        )}

        {!category && <div className="mt-10 max-w-3xl"><BlockRenderer blocks={copy.blocks} /></div>}

        {category && (
          <div className="mt-10 max-w-3xl">
            <h2 className="display-font text-2xl sm:text-3xl">{guidance[category.slug].title}</h2>
            <p className="mt-4 text-sm leading-8 text-white/60">{guidance[category.slug].text}</p>
          </div>
        )}
      </Container>

      <Container className="border-t border-white/[.07] py-10 lg:py-14">
        <h2 className="display-font text-3xl">{category ? `${category.rooms} daire planları` : "Daire planlarını karşılaştırın"}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">Plan detaylarından oda dağılımını ve net alanları inceleyebilirsiniz. Güncel satış fiyatı, ödeme koşulları ve müsaitlik bilgisi için satış ekibimizle iletişime geçin.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {selected.map((plan) => (
            <Link key={plan.slug} href={planUrl(plan)} className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#252825] transition-colors hover:border-[#d8b792]/45">
              <div className="relative aspect-[4/3] bg-[#eeece7]">
                <Image src={planImage(plan)} alt={planImageAlt(plan)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-contain p-4" />
              </div>
              <div className="border-t border-white/10 p-5">
                <h3 className="text-lg font-semibold">{planSalesName(plan)}</h3>
                {plan.areas.netArea !== null && <p className="mt-2 text-sm text-[#d8b792]">{formatArea(plan.areas.netArea)} net alan</p>}
                <p className="mt-2 text-xs text-white/45">{plan.block} Blok · {plan.roomLayout || plan.rooms}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs text-white/70">Planı incele <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      <CallToAction whatsappLink={content.general.whatsappLink} email={content.general.email} />
      <JsonLd schema={[
        breadcrumbSchema([{ name: "Ana Sayfa", path: "/" }, ...trail]),
        {
          "@context": "https://schema.org", "@type": "ItemList", name: title, url: absoluteUrl(path), numberOfItems: selected.length,
          itemListElement: selected.map((plan, index) => ({ "@type": "ListItem", position: index + 1, name: planSalesName(plan), url: absoluteUrl(planUrl(plan)) })),
        },
      ]} />
    </PageShell>
  );
}

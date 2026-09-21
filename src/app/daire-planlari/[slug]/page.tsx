import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { formatArea, planFloorAreas, planHeading, planImage, planImageAlt, planTitle } from "@/lib/plans";
import { getSection } from "@/lib/sections.server";
import { getPageCopy } from "@/lib/content.server";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 86400;

export async function generateStaticParams() {
  const plans = await getSection("plan-rooms");
  return plans.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = (await getSection("plan-rooms")).find((item) => item.slug === slug);
  if (!plan) return {};

  const title = plan.seoTitle.trim() || planHeading(plan);
  const description =
    plan.seoDescription.trim() ||
    plan.lead.trim() ||
    `Elys Prime ${plan.block} Blok ${plan.floor} ${plan.position} daire planı. Kat planını büyüterek inceleyin, teknik detaylar için satış ekibiyle iletişime geçin.`;

  return pageMetadata({
    title,
    description,
    path: `/daire-planlari/${plan.slug}`,
    image: planImage(plan),
    imageAlt: planImageAlt(plan),
  });
}

export default async function PlanDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [content, copy, plans] = await Promise.all([
    getProjectContent(),
    getPageCopy("daire-planlari"),
    getSection("plan-rooms"),
  ]);

  const plan = plans.find((item) => item.slug === slug);
  if (!plan) notFound();
  // Panelden bu tipe özel paragraf girilmişse o kullanılır; yoksa kat/konum
  // grubunun ortak metnine (`copy.planTypes`) düşülür.
  const paragraphs = plan.description.length > 0 ? plan.description : copy.planTypes?.[`${plan.floor}|${plan.position}`] ?? [];
  const floorAreas = planFloorAreas(plan);
  const measurements = [
    { label: "Net alan", value: plan.areas.netArea },
    { label: "Brüt alan", value: plan.areas.grossArea },
    { label: "Balkon", value: plan.areas.balconyArea },
    { label: "Teras", value: plan.areas.terraceArea },
  ].filter((entry) => entry.value !== null);
  const index = plans.indexOf(plan);
  const previous = plans[(index - 1 + plans.length) % plans.length];
  const next = plans[(index + 1) % plans.length];
  const siblings = plans.filter((item) => item.block === plan.block && item.slug !== plan.slug);

  return (
    <PageShell content={content}>
      <PageHeader
        eyebrow={`${plan.block} Blok`}
        title={plan.title.trim() || `${plan.floor} · ${plan.position}`}
        lead={plan.lead.trim() || `Elys Prime ${plan.block} Blok ${plan.floor.toLowerCase()} ${plan.position.toLowerCase()} daire planı.`}
      >
        <Breadcrumbs
          trail={[
            { name: "Daire Planları", path: "/daire-planlari" },
            { name: planTitle(plan), path: `/daire-planlari/${plan.slug}` },
          ]}
        />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[#eeece7]">
            <Image
              src={planImage(plan)}
              alt={planImageAlt(plan)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-5"
            />
          </div>

          <div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4">
              {[
                { label: "Blok", value: `${plan.block} Blok` },
                { label: "Kat", value: plan.floor },
                { label: "Konum", value: plan.position },
                { label: "Oda tipi", value: plan.rooms },
              ].map((item) => (
                <div key={item.label} className="bg-[#1f221f] px-4 py-5">
                  <dt className="text-[9px] font-bold uppercase tracking-[.16em] text-white/40">{item.label}</dt>
                  <dd className="display-font mt-2 text-lg font-medium text-[#d8b792]">{item.value}</dd>
                </div>
              ))}
            </dl>

            {measurements.length > 0 && (
              <dl className="mt-px grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4">
                {measurements.map((item) => (
                  <div key={item.label} className="bg-[#1f221f] px-4 py-5">
                    <dt className="text-[9px] font-bold uppercase tracking-[.16em] text-white/40">{item.label}</dt>
                    <dd className="display-font mt-2 text-lg font-medium text-[#d8b792]">{formatArea(item.value)}</dd>
                  </div>
                ))}
              </dl>
            )}

            {plan.features.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="border border-white/12 px-3 py-1.5 text-[11px] leading-5 text-white/55">
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 space-y-5">
              {paragraphs.map((paragraph: string) => (
                <p key={paragraph.slice(0, 40)} className="text-[15px] leading-8 text-white/60">{paragraph}</p>
              ))}
              <p className="text-[13px] leading-7 text-white/35">
                Planlar bilgilendirme amaçlıdır. Net ve brüt alan ölçüleri, oda boyutları ve teknik detaylar için
                satış ekibimizden onaylı proje dosyasını talep edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {plan.roomList.length > 0 && (
        <Container className="border-t border-white/[.07] py-10 lg:py-14">
          <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-3xl">Oda ölçüleri</h2>
          <p className="mt-3 max-w-2xl text-[13px] leading-7 text-white/40">
            Plan çizimi üzerindeki net ölçüler. {plan.roomLayout && <>Oda dağılımı: {plan.roomLayout}.</>}
          </p>

          <div className="mt-7 grid gap-8 sm:grid-cols-2">
            {(floorAreas.length > 0 ? floorAreas.map((entry) => entry.level) : [""]).map((level) => (
              <div key={level || "tek-kat"}>
                {level && (
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">
                    {level}
                    <span className="ml-3 font-medium normal-case tracking-normal text-white/35">
                      {formatArea(floorAreas.find((entry) => entry.level === level)?.area)} net
                    </span>
                  </h3>
                )}
                <dl className="divide-y divide-white/[.07] border-y border-white/[.07]">
                  {plan.roomList
                    .filter((room) => (floorAreas.length > 0 ? room.level === level : true))
                    .map((room, roomIndex) => (
                      <div key={`${room.name}-${roomIndex}`} className="flex items-baseline justify-between gap-4 py-3">
                        <dt className="text-[14px] text-white/60">
                          {room.name}
                          {room.outdoor && <span className="ml-2 text-[10px] uppercase tracking-[.12em] text-white/25">dış mekân</span>}
                        </dt>
                        <dd className="shrink-0 text-[14px] tabular-nums text-[#d8b792]">{formatArea(room.area) || "—"}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            ))}
          </div>
        </Container>
      )}

      {siblings.length > 0 && (
        <Container className="border-t border-white/[.07] py-10 lg:py-14">
          <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-3xl">{plan.block} Blok&apos;taki diğer tipler</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {siblings.map((sibling) => (
              <Link key={sibling.slug} href={`/daire-planlari/${sibling.slug}`} className="group flex flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#252825] transition-colors hover:border-[#d8b792]/45">
                <div className="relative aspect-[4/3] bg-[#eeece7]">
                  <Image src={planImage(sibling)} alt={planImageAlt(sibling)} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-contain p-4" />
                </div>
                <div className="border-t border-white/10 p-4">
                  <h3 className="text-base font-semibold">{sibling.floor}</h3>
                  <p className="text-[11px] text-white/45">{sibling.position}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      )}

      <Container className="border-t border-white/[.07] py-8">
        <nav aria-label="Diğer daire planları" className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[.14em]">
          <Link href={`/daire-planlari/${previous.slug}`} className="inline-flex items-center gap-2 text-white/55 transition-colors hover:text-[#d8b792]">
            <ArrowLeft size={14} /> {planTitle(previous)}
          </Link>
          <Link href="/daire-planlari" className="text-white/40 transition-colors hover:text-white">Tüm planlar</Link>
          <Link href={`/daire-planlari/${next.slug}`} className="inline-flex items-center gap-2 text-white/55 transition-colors hover:text-[#d8b792]">
            {planTitle(next)} <ArrowRight size={14} />
          </Link>
        </nav>
      </Container>

      <CallToAction whatsappLink={content.general.whatsappLink} email={content.general.email} />

      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Daire Planları", path: "/daire-planlari" },
            { name: planTitle(plan), path: `/daire-planlari/${plan.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Accommodation",
            name: `Elys Prime ${planTitle(plan)}`,
            url: absoluteUrl(`/daire-planlari/${plan.slug}`),
            image: planImage(plan),
            floorLevel: plan.floor,
            // Ölçü bilinmiyorsa alan hiç yazılmaz; uydurma değer zengin sonuçta yanlış bilgi olur.
            ...(plan.areas.netArea !== null && {
              floorSize: { "@type": "QuantitativeValue", value: plan.areas.netArea, unitCode: "MTK" },
            }),
            // schema.org numberOfRooms banyo ve depoları saymaz: "3+1" → salon + 3 oda.
            // Dubleks tiplerde oda sayısı tek bir etiketten türetilemediği için yazılmaz.
            ...(roomCount(plan.rooms) !== null && { numberOfRooms: roomCount(plan.rooms) }),
            containedInPlace: { "@type": "ApartmentComplex", name: "Elys Prime" },
          },
        ]}
      />
    </PageShell>
  );
}

/** "2+1" → 3 (salon + odalar). Dubleks gibi sayıya çevrilemeyen etiketlerde null. */
function roomCount(rooms: string): number | null {
  const match = /^(\d+)\+(\d+)$/.exec(rooms);
  if (!match) return null;
  return Number(match[1]) + Number(match[2]);
}

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { planDescriptions } from "@/data/copy";
import { findPlan, planImage, planTitle, plans } from "@/lib/plans";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 86400;

export function generateStaticParams() {
  return plans.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = findPlan(slug);
  if (!plan) return {};

  const title = `${planTitle(plan)} Daire Planı`;
  const description = `Elys Prime ${plan.block} Blok ${plan.floor} ${plan.position} daire planı. Kat planını büyüterek inceleyin, teknik detaylar için satış ekibiyle iletişime geçin.`;

  return {
    title,
    description,
    alternates: { canonical: `/daire-planlari/${plan.slug}` },
    openGraph: {
      url: `/daire-planlari/${plan.slug}`,
      title,
      description,
      images: [{ url: planImage(plan), alt: `${planTitle(plan)} daire planı` }],
    },
  };
}

export default async function PlanDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = findPlan(slug);
  if (!plan) notFound();

  const content = await getProjectContent();
  const paragraphs = planDescriptions[`${plan.floor}|${plan.position}`] ?? [];
  const index = plans.indexOf(plan);
  const previous = plans[(index - 1 + plans.length) % plans.length];
  const next = plans[(index + 1) % plans.length];
  const siblings = plans.filter((item) => item.block === plan.block && item.slug !== plan.slug);

  return (
    <PageShell content={content}>
      <PageHeader
        eyebrow={`${plan.block} Blok`}
        title={`${plan.floor} · ${plan.position}`}
        lead={`Elys Prime ${plan.block} Blok ${plan.floor.toLowerCase()} ${plan.position.toLowerCase()} daire planı.`}
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
              alt={`${planTitle(plan)} daire planı çizimi`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-5"
            />
          </div>

          <div>
            <dl className="grid grid-cols-3 gap-px overflow-hidden border border-white/10 bg-white/10">
              {[
                { label: "Blok", value: `${plan.block} Blok` },
                { label: "Kat", value: plan.floor },
                { label: "Konum", value: plan.position },
              ].map((item) => (
                <div key={item.label} className="bg-[#1f221f] px-4 py-5">
                  <dt className="text-[9px] font-bold uppercase tracking-[.16em] text-white/40">{item.label}</dt>
                  <dd className="display-font mt-2 text-lg font-medium text-[#d8b792]">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 space-y-5">
              {paragraphs.map((paragraph) => (
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

      {siblings.length > 0 && (
        <Container className="border-t border-white/[.07] py-10 lg:py-14">
          <h2 className="display-font text-2xl font-medium tracking-[-.03em] sm:text-3xl">{plan.block} Blok&apos;taki diğer tipler</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {siblings.map((sibling) => (
              <Link key={sibling.slug} href={`/daire-planlari/${sibling.slug}`} className="group flex flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#252825] transition-colors hover:border-[#d8b792]/45">
                <div className="relative aspect-[4/3] bg-[#eeece7]">
                  <Image src={planImage(sibling)} alt={`${planTitle(sibling)} daire planı`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-contain p-4" />
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
            containedInPlace: { "@type": "ApartmentComplex", name: "Elys Prime" },
          },
        ]}
      />
    </PageShell>
  );
}

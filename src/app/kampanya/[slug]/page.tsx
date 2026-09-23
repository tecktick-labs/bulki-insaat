import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { Breadcrumbs } from "@/components/PageShell";
import { CallToAction, Container, PageHeader } from "@/components/Prose";
import { campaignUrl } from "@/lib/campaigns";
import { getSection } from "@/lib/sections.server";
import { getProjectContent } from "@/lib/project-content.server";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const campaigns = await getSection("campaigns");
  return campaigns.map((campaign) => ({ slug: campaign.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const campaigns = await getSection("campaigns");
  const campaign = campaigns.find((item) => item.slug === slug);
  if (!campaign) return {};

  return pageMetadata({
    title: campaign.seoTitle,
    description: campaign.seoDescription,
    path: campaignUrl(campaign),
    image: campaign.poster.startsWith("http") ? campaign.poster : absoluteUrl(campaign.poster),
    imageAlt: campaign.posterAlt,
  });
}

export default async function KampanyaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [campaigns, content] = await Promise.all([getSection("campaigns"), getProjectContent()]);
  const campaign = campaigns.find((item) => item.slug === slug);
  if (!campaign) notFound();

  const others = campaigns.filter((item) => item.slug !== campaign.slug);

  return (
    <PageShell content={content}>
      <PageHeader eyebrow="Lansman Kampanyası" title={campaign.title} lead={campaign.lead}>
        <Breadcrumbs trail={[{ name: campaign.title, path: campaignUrl(campaign) }]} />
      </PageHeader>

      <Container className="py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-[#0f110f]">
            <Image
              src={campaign.poster}
              alt={campaign.posterAlt}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <div>
            {/* Dar ekranda üç kolon "Tanımlanabilir" gibi uzun değerleri kesiyordu;
                mobilde her satır etiket–değer çifti olarak alt alta dizilir. */}
            <dl className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
              {campaign.highlights.map((item) => (
                <div key={item.label} className="flex min-w-0 items-baseline justify-between gap-4 bg-[#1f221f] px-4 py-4 sm:block sm:py-5">
                  <dt className="shrink-0 text-[9px] font-bold uppercase tracking-[.16em] text-white/40">{item.label}</dt>
                  <dd className="display-font min-w-0 text-right text-lg font-semibold break-words hyphens-auto text-[#d8b792] sm:mt-2 sm:text-left">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 space-y-5">
              {campaign.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-[15px] leading-8 break-words hyphens-auto text-white/60">{paragraph}</p>
              ))}
              <p className="text-[13px] leading-7 text-white/35">
                Kampanya koşulları lansman dönemiyle sınırlıdır ve önceden haber verilmeksizin değiştirilebilir.
                Güncel geçerlilik durumu ve ödeme planı için satış ekibimizle görüşmenizi öneririz.
              </p>
            </div>

            <Link href="/daire-planlari" className="mt-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#d8b792] underline-offset-4 hover:underline">
              Daire planlarını inceleyin <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>

      <Container className="border-t border-white/[.07] py-10 lg:py-14">
        <h2 className="display-font text-2xl font-semibold tracking-[-.03em] sm:text-3xl">Diğer kampanyalar</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {others.map((other) => (
            <Link key={other.slug} href={campaignUrl(other)} className="group flex items-center gap-4 border border-white/10 bg-[#1f221f] p-4 sm:gap-5 sm:p-5 transition-colors hover:border-[#d8b792]/45">
              <span className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-[#0f110f]">
                <Image src={other.poster} alt={other.posterAlt} fill unoptimized sizes="80px" className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block text-[9px] font-bold uppercase tracking-[.18em] text-[#d8b792]">{other.hint}</span>
                <span className="mt-1 block text-lg font-semibold break-words hyphens-auto">{other.title}</span>
              </span>
              <ArrowRight size={16} className="ml-auto shrink-0 text-white/40 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </Container>

      <CallToAction whatsappLink={content.general.whatsappLink} email={content.general.email} />

      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: campaign.title, path: campaignUrl(campaign) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Offer",
            name: campaign.title,
            description: campaign.seoDescription,
            url: absoluteUrl(campaignUrl(campaign)),
            category: "Konut satış kampanyası",
            itemOffered: { "@type": "ApartmentComplex", name: "Elys Prime" },
            seller: { "@type": "Organization", name: content.general.companyName },
          },
        ]}
      />
    </PageShell>
  );
}

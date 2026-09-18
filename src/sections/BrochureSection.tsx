"use client";
import Filmstrip from "@/components/Filmstrip";
import { campaignUrl, type Campaign } from "@/lib/campaigns";
import { getBuildImage } from "@/lib/media";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  key: string;
  image: string;
  /** Kampanya broşürleri SVG; next/image optimizasyonuna sokulmaz. */
  vector: boolean;
  badge: string;
  title: string;
  note: string;
  href: string;
};

/** SVG broşürler next/image optimizasyonundan geçmez; yüklenen raster görseller geçer. */
function isVector(url: string) {
  return url.split("?")[0].toLowerCase().endsWith(".svg");
}

export default function BrochureSection({ campaigns }: { campaigns: Campaign[] }) {
  const slides: Slide[] = [
    ...campaigns.map((campaign) => ({
      key: campaign.slug,
      image: campaign.poster,
      vector: isVector(campaign.poster),
      badge: campaign.badge,
      title: campaign.title,
      note: campaign.hint,
      href: campaignUrl(campaign),
    })),
    { key: "kunye", image: getBuildImage(3), vector: false, badge: "PROJE", title: "Proje Künyesi", note: "4 blok · 192 daire", href: "/proje" },
    { key: "planlar", image: getBuildImage(7), vector: false, badge: "PLAN", title: "Daire Planları", note: "16 daire tipi", href: "/daire-planlari" },
  ];

  return <section id="brosurler" className="h-dvh snap-start snap-always overflow-hidden bg-[#141614] text-white">
    <div className="mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-5 pt-24 sm:px-9 sm:pb-8 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="grid shrink-0 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow text-[#d8b792]">Broşürler &amp; Kampanyalar</p>
          <h2 className="mt-3 text-4xl font-semibold leading-[.95] tracking-[-.04em] sm:text-5xl lg:text-6xl">Lansmana özel <em className="font-light">fırsatlar.</em></h2>
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        <Filmstrip
          items={slides}
          itemKey={(slide) => slide.key}
          initialIndex={0}
          label="Broşür ve kampanya şeridi"
          renderItem={(slide, isActive) => (
            <Link
              href={slide.href}
              draggable={false}
              tabIndex={isActive ? 0 : -1}
              className={`group flex h-full flex-col overflow-hidden border transition-colors ${
                isActive ? "border-[#d8b792]/55 shadow-[0_28px_70px_rgba(0,0,0,.5)]" : "border-white/10"
              }`}
            >
              <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0f110f]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  draggable={false}
                  unoptimized={slide.vector}
                  sizes="(max-width: 640px) 76vw, (max-width: 1024px) 50vw, 30rem"
                  /* Kampanya broşürleri 3:4 dikey tasarım; kart alanı yatay
                     kaldığında `cover` posteri yarıdan fazla kırpıyordu.
                     Vektör broşürler tam görünür, fotoğraflar alanı doldurur. */
                  className={`transition-transform duration-700 group-hover:scale-[1.03] ${slide.vector ? "object-contain p-3" : "object-cover"}`}
                />
                <span className="absolute left-4 top-4 bg-[#181a18]/85 px-3 py-2 text-[9px] font-bold uppercase tracking-[.18em] text-[#d8b792] backdrop-blur">{slide.badge}</span>
              </div>
              <div className="flex shrink-0 items-end justify-between gap-3 border-t border-white/10 bg-[#1d201d] p-4 sm:p-5">
                <div className="min-w-0">
                  <span className="block text-[8px] font-bold uppercase tracking-[.18em] text-white/40">{slide.note}</span>
                  <h3 className="mt-1 text-lg font-semibold leading-snug sm:text-xl">{slide.title}</h3>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 transition-colors group-hover:bg-[#d8b792] group-hover:text-[#181a18]"><ArrowUpRight size={15}/></span>
              </div>
            </Link>
          )}
        />
      </div>
    </div>
  </section>;
}

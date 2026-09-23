"use client";
import { campaignUrl, type Campaign } from "@/lib/campaigns";
import { getBuildImage, pickHeroVideo, type HeroVideo } from "@/lib/media";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const posterSrc = getBuildImage(1);

export default function HeroSection({ projectName, title, campaigns, videos }: { projectName: string; title: string; campaigns: Campaign[]; videos: HeroVideo[] }) {
  const [video, setVideo] = useState<HeroVideo | null>(null);

  // Poster görsel LCP'yi taşır; video sayfa boşa düştükten sonra yüklenir.
  // Mobil ve masaüstü havuzundan (panel → Hero Videoları) oturum başına
  // rastgele bir video seçilir; yalnızca seçilen video indirilir.
  // "Hareketi azalt" tercihi veya veri tasarrufu açıksa video hiç indirilmez.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const next = window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1200));
    const handle = idle(() => setVideo(pickHeroVideo(videos, next)));
    return () => window.clearTimeout(handle as number);
  }, [videos]);

  const discover = () => document.getElementById("brosurler")?.scrollIntoView({ behavior: "smooth" });

  return <section id="giris" className="relative h-dvh snap-start snap-always overflow-hidden bg-[#121412] text-white">
    <Image src={posterSrc} alt="Elys Prime projesinin genel görünümü" fill priority sizes="100vw" className="object-cover" />
    {video && <video key={video.key} autoPlay muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" aria-label="Elys Prime proje tanıtım videosu">
      {video.sources.map((source) => <source key={source.type} src={source.src} type={source.type}/>) }
    </video>}
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,10,.82)_0%,rgba(10,12,10,.45)_45%,rgba(10,12,10,.12)_78%),linear-gradient(0deg,rgba(10,12,10,.78)_0%,transparent_52%)]" />
    <div className="ambient-grid absolute inset-0 opacity-30" />

    {/* Başlık, kampanya kutuları ve "Keşfedelim" tek bir dikey akışta durur.
        Daha önce kutular mutlak konumluydu; kısa telefonlarda (ör. 667 px)
        başlığın üstüne biniyordu. Akışta durunca hiçbir boyda çakışmıyor. */}
    <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-7 pt-24 sm:px-9 sm:pb-10 sm:pt-32 lg:px-14 lg:pb-12 lg:pt-[18vh]">
      <div className="shrink-0">
        <p className="eyebrow reveal-up text-[#d8b792]">Bulki Yapı &amp; Çözüm Konut</p>
        <h1 className="reveal-up reveal-delay-1 mt-4 text-[clamp(2.9rem,12vw,8rem)] font-semibold leading-[.86] tracking-[-.055em] sm:mt-5 sm:text-[clamp(3.4rem,9vw,8rem)] sm:leading-[.84]">
          {projectName.split(" ")[0]}<br/>
          <span className="ml-[.05em] font-light italic text-[#d8b792]">{projectName.split(" ").slice(1).join(" ")}</span>
        </h1>
        <p className="reveal-up reveal-delay-2 mt-4 max-w-xl text-[15px] leading-6 text-white/80 sm:mt-6 sm:text-lg sm:leading-8">{title}</p>
      </div>

      {/* Kampanya kutuları — her biri kendi SEO sayfasına gider. Izgara üç
          kolonlu ve hero yalnızca ilk üç kampanyayı gösterir. Sıralama panelden
          değiştirilebilir; tüm kampanyalar broşür şeridinde, footer menüsünde
          ve sitemap'te yer alır. */}
      <div className="reveal-up reveal-delay-3 mt-auto grid w-full max-w-4xl grid-cols-1 gap-2 pt-6 sm:mx-auto sm:grid-cols-3 sm:gap-4 sm:pt-10">
        {campaigns.slice(0, 3).map((campaign) => (
          <Link
            key={campaign.slug}
            href={campaignUrl(campaign)}
            className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/25 bg-white/[.08] p-3.5 pr-12 text-left shadow-[0_18px_45px_rgba(0,0,0,.35)] backdrop-blur-xl transition-all duration-400 hover:-translate-y-1 hover:border-[#d8b792]/80 hover:bg-white/[.14] hover:shadow-[0_26px_60px_rgba(0,0,0,.5)] sm:flex-col sm:items-start sm:gap-3 sm:p-5 sm:pr-5"
          >
            {/* Üst kenardaki bakır ışık çizgisi */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8b792] to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
            {/* Rozet metni "0 FARK" gibi uzun olabilir: kutu sabit kare değil,
                en az kare boyunda ama içeriğe göre genişleyen bir kapsül. */}
            <span className="grid h-11 min-w-11 shrink-0 place-items-center rounded-xl bg-[#d8b792] px-2 text-[12px] font-extrabold leading-none tracking-tight whitespace-nowrap text-[#181a18] shadow-[0_6px_18px_rgba(216,183,146,.35)] transition-transform duration-400 group-hover:scale-110 sm:h-12 sm:min-w-12 sm:px-2.5 sm:text-sm">
              {campaign.badge}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[8px] font-bold uppercase tracking-[.2em] text-[#d8b792]">{campaign.hint}</span>
              <span className="mt-1 block text-[14px] font-semibold leading-snug text-white sm:mt-1.5 sm:text-base">{campaign.label}</span>
            </span>
            <span className="absolute right-3.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/25 text-white transition-colors group-hover:border-[#d8b792] group-hover:bg-[#d8b792] group-hover:text-[#181a18] sm:right-5 sm:top-auto sm:bottom-5 sm:translate-y-0">
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>

      {/* Keşfedelim — bir alttaki broşür section'ına yumuşak kaydırır. */}
      <button
        onClick={discover}
        className="group mx-auto mt-4 inline-flex w-fit shrink-0 items-center gap-4 px-5 py-2 text-sm font-bold uppercase tracking-[.22em] text-white transition-colors hover:text-[#d8b792] sm:mt-7 sm:py-3 sm:text-base"
      >
        Keşfedelim
        <span className="grid size-10 place-items-center rounded-full border border-white/40 transition-colors group-hover:border-[#d8b792] sm:size-11">
          <ArrowDown size={18} className="nudge-down" />
        </span>
      </button>
    </div>

  </section>;
}

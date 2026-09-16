"use client";
import { campaignUrl, type Campaign } from "@/lib/campaigns";
import { getBuildImage, getPromotionVideos } from "@/lib/media";
import { ArrowDown, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const posterSrc = getBuildImage(1);

export default function HeroSection({ projectName, title, campaigns }: { projectName: string; title: string; campaigns: Campaign[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [loadVideo, setLoadVideo] = useState(false);

  // Video 16 MB. Poster görsel LCP'yi taşır; video ancak geniş ekranda,
  // veri tasarrufu kapalıyken ve sayfa boşa düştükten sonra indirilir.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 1200));
    const handle = idle(() => setLoadVideo(true));
    return () => window.clearTimeout(handle as number);
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
    void video.play();
  };

  const discover = () => document.getElementById("brosurler")?.scrollIntoView({ behavior: "smooth" });

  return <section id="giris" className="relative h-dvh snap-start snap-always overflow-hidden bg-[#121412] text-white">
    <Image src={posterSrc} alt="Elys Prime projesinin genel görünümü" fill priority sizes="100vw" className="object-cover" />
    {loadVideo && <video ref={videoRef} autoPlay muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" aria-label="Elys Prime proje tanıtım videosu">
      {getPromotionVideos().map((video) => <source key={video.type} src={video.src} type={video.type}/>) }
    </video>}
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,10,.82)_0%,rgba(10,12,10,.45)_45%,rgba(10,12,10,.12)_78%),linear-gradient(0deg,rgba(10,12,10,.78)_0%,transparent_52%)]" />
    <div className="ambient-grid absolute inset-0 opacity-30" />

    {/* Başlık bloğu: dikey ortanın belirgin biçimde üstünde durur. */}
    <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-start px-5 pt-28 sm:px-9 sm:pt-32 lg:px-14 lg:pt-[18vh]">
      <p className="eyebrow reveal-up text-[#d8b792]">Bulki Yapı &amp; Çözüm Konut</p>
      <h1 className="reveal-up reveal-delay-1 mt-5 text-[clamp(3.4rem,9vw,8rem)] font-semibold leading-[.84] tracking-[-.055em]">
        {projectName.split(" ")[0]}<br/>
        <span className="ml-[.05em] font-light italic text-[#d8b792]">{projectName.split(" ").slice(1).join(" ")}</span>
      </h1>
      <p className="reveal-up reveal-delay-2 mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{title}</p>
    </div>

    {/* Kampanya kutuları — alt ortanın biraz üstünde, her biri kendi SEO sayfasına gider. */}
    <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 px-5 sm:bottom-36 sm:px-9 lg:px-14">
      <div className="reveal-up reveal-delay-3 pointer-events-auto mx-auto grid max-w-4xl grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.slug}
            href={campaignUrl(campaign)}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/25 bg-white/[.08] p-4 pr-12 text-left shadow-[0_18px_45px_rgba(0,0,0,.35)] backdrop-blur-xl transition-all duration-400 hover:-translate-y-1 hover:border-[#d8b792]/80 hover:bg-white/[.14] hover:shadow-[0_26px_60px_rgba(0,0,0,.5)] sm:flex-col sm:items-start sm:gap-3 sm:p-5 sm:pr-5"
          >
            {/* Üst kenardaki bakır ışık çizgisi */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8b792] to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#d8b792] text-[13px] font-extrabold leading-none tracking-tight text-[#181a18] shadow-[0_6px_18px_rgba(216,183,146,.35)] transition-transform duration-400 group-hover:scale-110 sm:size-12 sm:text-sm">
              {campaign.badge}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[8px] font-bold uppercase tracking-[.2em] text-[#d8b792]">{campaign.hint}</span>
              <span className="mt-1.5 block text-[15px] font-semibold leading-snug text-white sm:text-base">{campaign.label}</span>
            </span>
            <span className="absolute right-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/25 text-white transition-colors group-hover:border-[#d8b792] group-hover:bg-[#d8b792] group-hover:text-[#181a18] sm:right-5 sm:top-auto sm:bottom-5 sm:translate-y-0">
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>

    {/* Keşfedelim — bir alttaki broşür section'ına yumuşak kaydırır. */}
    <button
      onClick={discover}
      className="group absolute inset-x-0 bottom-7 z-10 mx-auto inline-flex w-fit items-center gap-4 px-5 py-3 text-sm font-bold uppercase tracking-[.22em] text-white transition-colors hover:text-[#d8b792] sm:bottom-10 sm:text-base"
    >
      Keşfedelim
      <span className="grid size-10 place-items-center rounded-full border border-white/40 transition-colors group-hover:border-[#d8b792] sm:size-11">
        <ArrowDown size={18} className="nudge-down" />
      </span>
    </button>

    {loadVideo && <button onClick={toggleSound} className="absolute right-5 top-24 z-10 grid size-11 place-items-center rounded-full border border-white/35 bg-black/10 backdrop-blur transition-colors hover:bg-white hover:text-[#181a18] sm:right-9 lg:right-14" aria-label={muted ? "Videonun sesini aç" : "Videonun sesini kapat"}>{muted ? <VolumeX size={17}/> : <Volume2 size={17}/>}</button>}
  </section>;
}

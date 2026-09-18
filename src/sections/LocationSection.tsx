"use client";
import { getBuildImage } from "@/lib/media";
import { Bus, ExternalLink, Home, Minus, Navigation, Plane, Plus, TrainFront, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Metrics = {
  metro: { label: string; walkMin: number };
  bus: { label: string; walkMin: number };
  center: { label: string; walkMin: number; driveMin: number };
  airport?: { label: string; driveMin: number };
};

export default function LocationSection({ description, metrics, latitude, longitude }: { description: string; metrics: Metrics; latitude: number; longitude: number }) {
  const [zoom, setZoom] = useState(16);
  // `q=` Google'ın kendi kırmızı işaretçisini basar; `ll=` yalnızca haritayı
  // ortalar ve işaretçi çizmez — tek işaretçi bizim ev rozetimiz olur.
  const mapEmbedUrl = `https://www.google.com/maps?ll=${latitude},${longitude}&z=${zoom}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cards = [
    { icon: TrainFront, label: metrics.metro.label, value: metrics.metro.walkMin, unit: "dk yürüyerek" },
    { icon: Bus, label: metrics.bus.label, value: metrics.bus.walkMin, unit: "dk yürüyerek" },
    metrics.airport
      ? { icon: Plane, label: metrics.airport.label, value: metrics.airport.driveMin, unit: "dk araçla" }
      : { icon: Navigation, label: metrics.center.label, value: metrics.center.driveMin, unit: "dk araçla" },
  ];

  return <section id="konum" className="relative h-dvh snap-start snap-always overflow-hidden bg-[#202320] text-[#f6f1eb]">
    {/*
      Harita section'ın tamamını kaplar. Google embed'i kendi işaretçisini
      değiştirmeye izin vermediği için iframe etkileşime kapalı tutulur ve
      konum, üstüne bindirdiğimiz ev işaretçisiyle gösterilir; böylece
      işaretçi her zaman doğru noktada durur. Gezinme için alttaki iki buton var.
    */}
    <div className="absolute inset-0 overflow-hidden">
      <iframe
        src={mapEmbedUrl}
        title="Elys Prime konum haritası"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
        /* Mobilde harita bölümden %24 yukarı taşırılır: merkezi (ve dolayısıyla
           üstüne bindirdiğimiz ev işaretçisi) alttaki mesafe kartlarının değil,
           boş alanın ortasına denk gelsin. Alt kenar yine bölümle hizalı kalır. */
        className="pointer-events-none absolute -top-[20%] left-0 h-[120%] w-full border-0 grayscale-[.25] sm:top-0 sm:h-full"
      />
    </div>

    {/* Mobilde dikey orta, alttaki mesafe kartlarının üstüne denk geliyordu;
        telefonlarda haritanın üst çeyreğinde durur, sm'den itibaren ortada. */}
    <div className="absolute right-5 top-[28%] z-10 flex flex-col gap-1.5 sm:right-9 sm:top-1/2 sm:-translate-y-1/2 lg:right-14">
      <button
        type="button"
        onClick={() => setZoom((value) => Math.min(19, value + 1))}
        disabled={zoom >= 19}
        className="grid size-10 place-items-center rounded-full border border-white/25 bg-[#12140f]/80 text-white backdrop-blur-md transition-colors hover:border-[#d8b792] hover:bg-[#d8b792] hover:text-[#181a18] disabled:opacity-35 disabled:hover:border-white/25 disabled:hover:bg-[#12140f]/80 disabled:hover:text-white"
        aria-label="Haritayı yakınlaştır"
      ><Plus size={17}/></button>
      <button
        type="button"
        onClick={() => setZoom((value) => Math.max(12, value - 1))}
        disabled={zoom <= 12}
        className="grid size-10 place-items-center rounded-full border border-white/25 bg-[#12140f]/80 text-white backdrop-blur-md transition-colors hover:border-[#d8b792] hover:bg-[#d8b792] hover:text-[#181a18] disabled:opacity-35 disabled:hover:border-white/25 disabled:hover:bg-[#12140f]/80 disabled:hover:text-white"
        aria-label="Haritayı uzaklaştır"
      ><Minus size={17}/></button>
    </div>

    <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,rgba(16,18,16,.8)_0%,rgba(16,18,16,.45)_45%,transparent_100%)]" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[linear-gradient(0deg,rgba(16,18,16,.94)_0%,rgba(16,18,16,.6)_50%,transparent_100%)]" />

    {/* Ev işaretçisi — haritanın merkezinde, tıklanınca görsel modalı açar. */}
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group absolute left-1/2 top-[40%] z-10 -translate-x-1/2 -translate-y-full sm:top-1/2"
      aria-label="Elys Prime konumu — proje görselini aç"
    >
      <span className="relative grid size-14 place-items-center rounded-full border-2 border-white bg-[#d8b792] text-[#181a18] shadow-[0_10px_30px_rgba(0,0,0,.45)] transition-transform duration-300 group-hover:scale-110 sm:size-20">
        <Home size={24} className="sm:hidden" />
        <Home size={34} className="hidden sm:block" />
        <span aria-hidden="true" className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-white bg-[#d8b792]" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#d8b792]/40" />
      </span>
      <span className="mt-4 hidden whitespace-nowrap rounded-full sm:block bg-[#181a18]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur">
        Elys Prime
      </span>
    </button>

    <div className="pointer-events-none absolute inset-0 mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 pb-6 pt-24 sm:px-9 sm:pb-8 lg:px-14 lg:pb-10 lg:pt-28">
      {/* Başlığın arkasına okunurluk için koyu panel. */}
      <div className="pointer-events-auto w-fit max-w-2xl rounded-2xl border border-white/10 bg-[#12140f]/75 p-4 backdrop-blur-xl sm:p-7">
        <p className="eyebrow text-[#d8b792]">Konum</p>
        <h2 className="mt-2 whitespace-nowrap text-xl font-semibold tracking-[-.02em] sm:text-2xl lg:text-3xl">Her yere <em className="font-light">birkaç dakika.</em></h2>
        <p className="mt-3 hidden max-w-md text-sm leading-6 text-white/65 sm:block">{description}</p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Yatay, uzun mesafe kartları. */}
        <div className="pointer-events-auto grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          {cards.map((card) => (
            <div key={card.label} className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/15 bg-[#161816]/85 px-4 py-3.5 backdrop-blur-md sm:px-5 sm:py-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-[#202320] text-[#d8b792] sm:size-12"><card.icon size={19}/></span>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-bold uppercase tracking-[.14em] text-white/60">{card.label}</span>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <strong className="display-font text-2xl font-semibold leading-none sm:text-3xl">{card.value}</strong>
                  <span className="truncate text-[10px] font-bold uppercase tracking-[.1em] text-[#d8b792]">{card.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-auto flex flex-col gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
          <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-[#161816]/85 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-[#181a18]">
            <ExternalLink size={15}/> Haritada aç
          </a>
          <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#d8b792] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#181a18] transition-colors hover:bg-white">
            <Navigation size={15}/> Yol tarifi al
          </a>
        </div>
      </div>
    </div>

    {open && (
      <div className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-4 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" aria-label="Elys Prime proje görseli">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#161816]">
          <div className="relative aspect-[16/10]">
            <Image src={getBuildImage(7)} alt="Elys Prime genel görünümü" fill sizes="(max-width: 768px) 100vw, 48rem" className="object-cover"/>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#d8b792]">Pendik / İstanbul</span>
              <h3 className="mt-1 text-xl font-semibold sm:text-2xl">Elys Prime</h3>
              <p className="mt-1 text-xs text-white/50">4 blok · 192 daire · Metroya {metrics.metro.walkMin} dk</p>
            </div>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#d8b792] px-5 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#181a18] transition-colors hover:bg-white">
              <Navigation size={14}/> Yol tarifi al
            </a>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-white text-black" aria-label="Kapat"><X/></button>
      </div>
    )}
  </section>;
}

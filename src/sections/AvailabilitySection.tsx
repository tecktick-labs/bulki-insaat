"use client";
import type { ProjectBlock } from "@/lib/project-content";
import { Building2, CheckCircle2, Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startedAt = performance.now();
      const duration = 950;
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: .35 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);

  return <span ref={ref}>{display.toLocaleString("tr-TR")}{suffix}</span>;
}

export default function AvailabilitySection({ totalUnits, unitsSold, blocks }: { totalUnits: number; unitsSold: number; blocks: ProjectBlock[] }) {
  const remaining = Math.max(0, totalUnits - unitsSold);
  const soldRate = totalUnits > 0 ? Math.round((unitsSold / totalUnits) * 100) : 0;
  const stats = [
    { value: totalUnits, label: "Toplam Daire", icon: Building2 },
    { value: unitsSold, label: "Satılan", icon: CheckCircle2 },
    { value: remaining, label: "Satışta", icon: Home },
  ];

  return <section id="durum" className="flex h-dvh snap-start snap-always overflow-hidden bg-[#181a18] text-[#f7eee7]">
    <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 pb-5 pt-24 sm:px-9 sm:pb-8 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="grid shrink-0 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="eyebrow text-[#e4c5a9]">Güncel Proje Durumu</p><h2 className="mt-3 text-4xl font-medium leading-[.9] tracking-[-.045em] text-[#fff8f1] sm:text-6xl lg:text-7xl">Rakamlarla <em>Elys Prime.</em></h2></div>
        <div className="grid grid-cols-3 gap-2">
          {stats.map((stat, statIndex) => <div key={stat.label} className={`min-w-0 rounded-2xl border px-3 py-3 shadow-[0_12px_35px_rgba(25,12,5,.12)] backdrop-blur sm:min-w-32 sm:px-4 ${statIndex === 2 ? "border-[#d8b792]/45 bg-[#d8b792]/15" : "border-white/15 bg-white/10"}`}>
            <div className="flex items-center justify-between gap-2"><strong className={`display-font font-semibold text-[#fff8f1] ${statIndex === 2 ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}><AnimatedNumber value={stat.value}/></strong><stat.icon size={15} className="hidden text-[#e4c5a9] sm:block"/></div>
            <span className="mt-1 block truncate text-[7px] font-bold uppercase tracking-[.12em] text-white/55 sm:text-[9px]">{stat.label}</span>
          </div>)}
        </div>
      </div>

      <div className="mt-4 grid h-[52vh] min-h-[320px] max-h-[540px] shrink-0 grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        {blocks.map((item, index) => {
          const left = Math.max(0, item.total - item.sold);
          const rate = item.total ? Math.round((item.sold / item.total) * 100) : 0;
          return <article key={item.name} className="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#232623] p-3 text-[#f7eee7] shadow-[0_14px_35px_rgba(0,0,0,.20)] transition-all duration-500 hover:border-[#d8b792]/35 sm:rounded-2xl sm:p-4 lg:p-5">
            <span className="pointer-events-none absolute -right-2 -top-8 display-font text-[7rem] font-semibold leading-none text-white/[.025]">{item.name.charAt(0)}</span>
            <div className="relative flex items-start justify-between"><div><span className="text-[6px] font-bold uppercase tracking-[.16em] text-[#d8b792] sm:text-[7px]">Blok durumu</span><h3 className="text-xl font-semibold sm:mt-1 sm:text-2xl">{item.name}</h3></div><div className="rounded-full bg-[#d8b792] px-2 py-1.5 text-[6px] font-bold uppercase tracking-[.1em] text-[#181a18] sm:px-3 sm:py-2 sm:text-[7px]"><AnimatedNumber value={left}/> daire</div></div>
            <div className="relative my-auto flex items-end gap-3 py-1"><div><strong className="display-font block text-3xl font-medium leading-none tracking-[-.04em] text-[#d8b792] sm:text-4xl lg:text-5xl"><AnimatedNumber value={rate} suffix="%"/></strong><span className="hidden text-[6px] font-bold uppercase tracking-[.13em] text-white/40 sm:block">Satış tamamlandı</span></div><div className="mb-1 h-1 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#d8b792] transition-[width] duration-1000" style={{ width: `${rate}%`, transitionDelay: `${index * 100}ms` }}/></div></div>
            <dl className="relative grid grid-cols-3 gap-1 border-t border-white/10 pt-2 text-center sm:gap-2"><div><dd className="display-font text-base font-semibold sm:text-xl">{item.normalCorner}</dd><dt className="text-[5px] font-bold uppercase leading-3 tracking-[.05em] text-white/40 sm:text-[6px]">Normal · Köşe</dt></div><div className="border-x border-white/10"><dd className="display-font text-base font-semibold sm:text-xl">{item.normalMiddle}</dd><dt className="text-[5px] font-bold uppercase leading-3 tracking-[.05em] text-white/40 sm:text-[6px]">Normal · Orta</dt></div><div><dd className="display-font text-base font-semibold sm:text-xl">{item.special}</dd><dt className="text-[5px] font-bold uppercase leading-3 tracking-[.05em] text-white/40 sm:text-[6px]">Çatı / Dubleks</dt></div></dl>
          </article>;
        })}
      </div>
      <div className="mt-2 flex shrink-0 items-center justify-between text-[8px] font-bold uppercase tracking-[.14em] text-white/45"><span>Genel satış oranı <AnimatedNumber value={soldRate} suffix="%"/></span><span className="sm:hidden">Bloklar için kaydırın →</span></div>
    </div>
  </section>;
}

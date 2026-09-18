"use client";
import { blockNames, planImage, planImageAlt, type Plan, type RoomType } from "@/lib/plans";
import { roomTypesForBlock } from "@/lib/sections";
import { ArrowRight, Expand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
import { useMemo, useState } from "react";

export default function ApartmentsSection({ plans }: { plans: Plan[] }) {
  const [block, setBlock] = useState<Plan["block"]>("A");
  const [room, setRoom] = useState<RoomType | "all">("all");

  const availableRooms = useMemo(() => roomTypesForBlock(plans, block), [plans, block]);
  const filtered = useMemo(
    () => plans.filter((plan) => plan.block === block && (room === "all" || plan.rooms === room)),
    [plans, block, room],
  );

  const [selected, setSelected] = useState<Plan | null>(null);

  // Blok değişince önceki oda filtresi o blokta yoksa "Tümü"ne dönülür.
  const pickBlock = (next: Plan["block"]) => {
    setBlock(next);
    if (room !== "all" && !roomTypesForBlock(plans, next).includes(room)) setRoom("all");
  };


  const chip = (isActive: boolean) =>
    `shrink-0 border px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.16em] transition-colors sm:px-4 sm:py-2.5 ${
      isActive ? "border-[#d8b792] bg-[#d8b792] text-[#181a18]" : "border-white/15 text-white/60 hover:border-white/45 hover:text-white"
    }`;

  return <section id="planlar" className="h-dvh snap-start snap-always overflow-hidden bg-[#1d201d] text-[#f6f1eb]">
    <div className="mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-4 pt-20 sm:px-9 sm:pb-8 sm:pt-24 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="grid shrink-0 gap-3 border-b border-white/10 pb-3 sm:gap-4 sm:pb-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow text-[#d8b792]">Daire Planları</p>
          <h2 className="mt-2 text-[1.75rem] font-semibold leading-[.95] tracking-[-.04em] sm:mt-3 sm:text-4xl lg:text-5xl">Size uyan yaşamı <em className="font-light">inceleyin.</em></h2>
          <Link href="/daire-planlari" className="mt-2 inline-flex sm:mt-3 items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792] underline-offset-4 hover:underline">16 daire tipinin tamamı <ArrowRight size={13}/></Link>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Blok seçimi">
            {blockNames.map((item) => (
              <button key={item} onClick={() => pickBlock(item)} aria-pressed={block === item} className={chip(block === item)}>{item} Blok</button>
            ))}
          </div>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Daire tipi seçimi">
            <button onClick={() => setRoom("all")} aria-pressed={room === "all"} className={chip(room === "all")}>Tümü</button>
            {availableRooms.map((item) => (
              <button key={item} onClick={() => setRoom(item)} aria-pressed={room === item} className={chip(room === item)}>{item}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Plan görselleri 1449x1600 (0.906). Kart yatay kurgulu: görsel kutusu
          tam bu orana sahip ve kart yüksekliğini doldurur, yani içinde boşluk kalmaz. */}
      <div className="mt-4 grid min-h-0 flex-1 auto-rows-[minmax(10.5rem,26vh)] grid-cols-1 content-start gap-3 overflow-y-auto py-1 no-scrollbar sm:grid-cols-2 sm:gap-4 lg:gap-5">
        {filtered.map((plan) => (
          <button
            key={plan.slug}
            onClick={() => setSelected(plan)}
            className="group flex min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-[#252825] text-left shadow-[0_18px_42px_rgba(0,0,0,.24)] transition-all duration-500 hover:border-[#d8b792]/45 hover:shadow-[0_24px_55px_rgba(0,0,0,.38)]"
          >
            <div className="relative aspect-[1449/1600] h-full shrink-0 overflow-hidden bg-[#f4f2ee]">
              <Image
                src={planImage(plan)}
                alt={planImageAlt(plan)}
                fill
                sizes="(max-width: 640px) 60vw, 26vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#d8b792] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-[#181a18]">{plan.block} Blok · {plan.rooms}</span>
                <h3 className="mt-3 truncate text-xl font-semibold sm:text-2xl">{plan.floor}</h3>
                <p className="mt-1 truncate text-[12px] text-white/45">{plan.position}</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.14em] text-white/40"><Expand size={13}/> Büyüt</span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 transition-colors group-hover:bg-[#d8b792] group-hover:text-[#181a18]"><ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5"/></span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-2 shrink-0 border-t border-white/10 pt-2 text-[9px] leading-4 text-white/35">Planlar bilgilendirme amaçlıdır.<span className="hidden sm:inline"> Teknik detaylar için satış ekibimizle iletişime geçebilirsiniz.</span></p>
    </div>

    <Lightbox
      content={selected && {
        src: planImage(selected),
        alt: planImageAlt(selected),
        title: `${selected.floor} · ${selected.position}`,
        subtitle: `${selected.block} Blok · ${selected.rooms}`,
      }}
      onClose={() => setSelected(null)}
    />
  </section>;
}

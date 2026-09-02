import Image, { type StaticImageData } from "@/app/components/ResponsiveImage";
import { getFloorPlan } from "@/app/lib/mediaAssets";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Plan = { block: string; floor: string; position: string; image: StaticImageData };
const plans: Plan[] = [
  { block: "A", floor: "Normal Kat", position: "Köşe Tip", image: getFloorPlan("a-blok-normal-kat-kose-tip") }, { block: "A", floor: "Normal Kat", position: "Orta Tip", image: getFloorPlan("a-blok-normal-kat-orta-tip") },
  { block: "A", floor: "Çatı Katı", position: "Köşe Tip", image: getFloorPlan("a-blok-cati-kat-kose-tip") }, { block: "A", floor: "Çatı Katı", position: "Orta Tip", image: getFloorPlan("a-blok-cati-kat-orta-tip") },
  { block: "B", floor: "Normal Kat", position: "Köşe Tip", image: getFloorPlan("b-blok-normal-kat-kose-tip") }, { block: "B", floor: "Normal Kat", position: "Orta Tip", image: getFloorPlan("b-blok-normal-kat-orta-tip") },
  { block: "B", floor: "Dubleks", position: "Köşe Tip", image: getFloorPlan("b-blok-dubleks-kose-tip") }, { block: "B", floor: "Dubleks", position: "Orta Tip", image: getFloorPlan("b-blok-dubleks-orta-tip") },
  { block: "C", floor: "Normal Kat", position: "Köşe Tip", image: getFloorPlan("c-blok-normal-kat-kose-tip") }, { block: "C", floor: "Normal Kat", position: "Orta Tip", image: getFloorPlan("c-blok-normal-kat-orta-tip") },
  { block: "C", floor: "Çatı Katı", position: "Köşe Tip", image: getFloorPlan("c-blok-cati-kat-kose-tip") }, { block: "C", floor: "Çatı Katı", position: "Orta Tip", image: getFloorPlan("c-blok-cati-kat-orta-tip") },
  { block: "D", floor: "Normal Kat", position: "Köşe Tip", image: getFloorPlan("d-blok-normal-kat-kose-tip") }, { block: "D", floor: "Normal Kat", position: "Orta Tip", image: getFloorPlan("d-blok-normal-kat-orta-tip") },
  { block: "D", floor: "Dubleks", position: "Köşe Tip", image: getFloorPlan("d-blok-dubleks-kat-kose-tip") }, { block: "D", floor: "Dubleks", position: "Orta Tip", image: getFloorPlan("d-blok-dubleks-orta-tip") },
];

export default function ApartmentsSection() {
  const [block, setBlock] = useState("A");
  const filtered = useMemo(() => plans.filter((plan) => plan.block === block), [block]);
  const [selected, setSelected] = useState<Plan | null>(null);
  const selectedIndex = selected ? plans.indexOf(selected) : -1;
  const move = (direction: number) => setSelected(plans[(selectedIndex + direction + plans.length) % plans.length]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const direction = event.key === "ArrowRight" ? 1 : -1;
        setSelected((current) => {
          if (!current) return null;
          const currentIndex = plans.indexOf(current);
          return plans[(currentIndex + direction + plans.length) % plans.length];
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return <section id="planlar" className="h-dvh snap-start snap-always overflow-hidden bg-[#1d201d] text-[#f6f1eb]">
    <div className="mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-5 pt-24 sm:px-9 sm:pb-8 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="grid shrink-0 gap-4 border-b border-white/10 pb-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><p className="eyebrow text-[#d8b792]">Daire Planları</p><h2 className="mt-3 text-3xl font-medium leading-[.9] tracking-[-.045em] sm:text-5xl lg:text-6xl">Size uyan yaşamı <em>inceleyin.</em></h2></div>
        <div className="flex flex-wrap gap-2">{["A","B","C","D"].map((item) => <button key={item} onClick={() => setBlock(item)} className={`min-w-14 border px-4 py-3 text-[10px] font-bold uppercase tracking-[.16em] transition-colors ${block === item ? "border-[#d8b792] bg-[#d8b792] text-[#181a18]" : "border-white/15 text-white/60 hover:border-white/45 hover:text-white"}`}>{item} Blok</button>)}</div>
      </div>

      <div className="perspective-stage mt-4 flex h-[50vh] max-h-[455px] min-h-[310px] shrink-0 snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-2 no-scrollbar sm:grid sm:h-[48vh] sm:grid-cols-2 sm:overflow-visible lg:h-[43vh] lg:max-h-[420px] lg:grid-cols-4 lg:gap-5">
        {filtered.map((plan) => <button key={`${plan.block}-${plan.floor}-${plan.position}`} onClick={() => setSelected(plan)} className="plan-card group flex min-w-[72vw] snap-start flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#252825] text-left shadow-[0_18px_42px_rgba(0,0,0,.24)] transition-all duration-500 sm:min-w-0">
          <div className="relative min-h-0 flex-1 overflow-hidden bg-[#eeece7]"><Image src={plan.image} alt={`${plan.block} Blok ${plan.floor} ${plan.position} planı`} fill sizes="(max-width: 640px) 72vw, 25vw" className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.025] sm:p-4"/><span className="absolute left-3 top-3 rounded-full bg-[#181a18] px-3 py-2 text-[7px] font-bold uppercase tracking-[.14em] text-[#d8b792]">{plan.block} Blok</span><span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-[#181a18]/90 text-white shadow-md backdrop-blur transition-transform group-hover:scale-110"><Expand size={14}/></span></div>
          <div className="flex shrink-0 items-end justify-between gap-3 border-t border-white/10 p-3 sm:p-4"><div><span className="text-[7px] font-bold uppercase tracking-[.18em] text-[#d8b792]">Daire Planı</span><h3 className="mt-0.5 text-lg font-semibold sm:text-xl">{plan.floor}</h3><p className="text-[9px] text-white/45">{plan.position}</p></div><span className="grid size-8 place-items-center rounded-full border border-white/15 transition-colors group-hover:bg-[#d8b792] group-hover:text-[#181a18]"><ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5"/></span></div>
        </button>)}
      </div>
      <p className="mt-2 shrink-0 text-[9px] leading-4 text-white/35">Planlar bilgilendirme amaçlıdır. Teknik detaylar için satış ekibimizle iletişime geçebilirsiniz. <span className="sm:hidden">Planlar için yana kaydırın.</span></p>
    </div>

    {selected && <div className="fixed inset-0 z-[80] bg-[#111311] p-3 sm:p-7" role="dialog" aria-modal="true" aria-label="Daire planı tam ekran görünümü"><div className="relative h-full w-full"><Image src={selected.image} alt={`${selected.block} Blok ${selected.floor} ${selected.position} planı`} fill sizes="100vw" className="object-contain"/></div><div className="absolute left-5 top-5 bg-[#f2efe8] px-5 py-4 sm:left-8 sm:top-8"><span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#8a5f3d]">{selected.block} Blok</span><p className="display-font mt-1 text-xl font-semibold">{selected.floor} · {selected.position}</p></div><button onClick={() => setSelected(null)} className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-[#f2efe8] text-black sm:right-8 sm:top-8" aria-label="Planı kapat"><X/></button><button onClick={() => move(-1)} className="absolute bottom-5 left-5 grid size-12 place-items-center bg-[#f2efe8] text-black sm:bottom-8 sm:left-8" aria-label="Önceki plan"><ArrowLeft/></button><button onClick={() => move(1)} className="absolute bottom-5 right-5 grid size-12 place-items-center bg-[#f2efe8] text-black sm:bottom-8 sm:right-8" aria-label="Sonraki plan"><ArrowRight/></button></div>}
  </section>;
}

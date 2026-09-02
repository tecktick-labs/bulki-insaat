import { Bus, CarFront, ExternalLink, MapPin, Plane, TrainFront } from "lucide-react";

export default function LocationSection({ description, metrics, latitude, longitude }: { description: string; metrics: { metro: { label: string; walkMin: number }; bus: { label: string; walkMin: number }; center: { label: string; walkMin: number; driveMin: number }; airport?: { label: string; driveMin: number } }; latitude: number; longitude: number }) {
  const mapEmbedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
  const mapDetailUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const cards = [
    { icon: TrainFront, label: metrics.metro.label, value: metrics.metro.walkMin, unit: "yürüyerek" },
    { icon: Bus, label: metrics.bus.label, value: metrics.bus.walkMin, unit: "yürüyerek" },
    { icon: CarFront, label: metrics.center.label, value: metrics.center.driveMin, unit: "araçla" },
    metrics.airport ? { icon: Plane, label: metrics.airport.label, value: metrics.airport.driveMin, unit: "araçla" } : null,
  ].filter((card): card is NonNullable<typeof card> => card !== null);

  return <section id="konum" className="h-dvh snap-start snap-always overflow-hidden bg-[#202320] text-[#f6f1eb]">
    <div className="mx-auto grid h-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)] gap-4 px-5 pb-5 pt-24 sm:px-9 sm:pb-8 lg:grid-cols-[.9fr_1.1fr] lg:grid-rows-1 lg:gap-10 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="flex min-h-0 flex-col lg:justify-between">
        <div><p className="eyebrow text-[#d8b792]">Konum</p><h2 className="mt-3 text-4xl font-medium leading-[.9] tracking-[-.045em] sm:text-6xl lg:text-7xl">Her yere<br/><em>birkaç dakika.</em></h2><p className="mt-3 hidden max-w-md text-xs leading-6 text-white/45 sm:block lg:mt-5 lg:text-sm">{description}</p></div>
        <div className="mt-4 grid gap-2.5">{cards.map((card, cardIndex) => <div key={card.label} className="group flex items-center justify-between gap-5 rounded-xl border border-white/10 bg-[#292c29] px-4 py-3 shadow-[0_10px_28px_rgba(0,0,0,.14)] transition-colors hover:border-[#d8b792]/30 sm:rounded-2xl sm:px-5 sm:py-3.5 lg:px-6"><div className="flex min-w-0 items-center gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-[#202320] text-[#d8b792] sm:size-11"><card.icon size={18}/></span><div><span className="block truncate text-[9px] font-bold uppercase tracking-[.12em] text-white/70 sm:text-[10px]">{card.label}</span><span className="mt-0.5 block text-[7px] font-bold uppercase tracking-[.1em] text-white/25 sm:text-[8px]">{String(cardIndex + 1).padStart(2, "0")} · {card.unit}</span></div></div><div className="flex shrink-0 items-baseline gap-1"><strong className="display-font text-3xl font-semibold leading-none text-[#f6f1eb] sm:text-4xl lg:text-5xl">{card.value}</strong><span className="display-font text-base italic text-[#d8b792] sm:text-lg">dk</span></div></div>)}</div>
      </div>

      <div className="relative min-h-0 overflow-hidden bg-[#c9c2b5]">
        <iframe src={mapEmbedUrl} title="Elys Prime Google konum haritası" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" allowFullScreen />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10"/>
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 bg-[#181a18] px-3 py-2 text-white sm:left-5 sm:top-5 sm:px-4 sm:py-3"><MapPin size={14} className="text-[#d8b792]"/><span className="text-[8px] font-bold uppercase tracking-[.14em] sm:text-[10px]">Elys Prime</span></div>
        <a href={mapDetailUrl} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-[#181a18] px-4 py-3 text-[8px] font-bold uppercase tracking-[.12em] text-white transition-colors hover:bg-[#d8b792] hover:text-[#181a18] sm:bottom-5 sm:right-5 sm:text-[9px]">Google Maps&apos;te aç <ExternalLink size={13}/></a>
      </div>
    </div>
  </section>;
}

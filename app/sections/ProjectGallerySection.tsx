import Image, { type StaticImageData } from "@/app/components/ResponsiveImage";
import { getBuildImage } from "@/app/lib/mediaAssets";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useEffect, useState } from "react";
const slides: { image: StaticImageData; title: string; note: string }[] = [
  { image: getBuildImage(1), title: "Peyzajla bütünleşen yaşam", note: "İç Bahçe" },
  { image: getBuildImage(2), title: "Her mevsim nefes alan avlular", note: "Sosyal Yaşam" },
  { image: getBuildImage(3), title: "Modern çizgiler, sıcak dokular", note: "Mimari" },
  { image: getBuildImage(4), title: "Günün her saatinde sakin", note: "Cephe" },
  { image: getBuildImage(5), title: "Aileler için güvenli alanlar", note: "Peyzaj" },
  { image: getBuildImage(6), title: "Hareket yaşamın içinde", note: "Spor Alanı" },
  { image: getBuildImage(7), title: "Dengeli ve çağdaş bir silüet", note: "Genel Görünüm" },
  { image: getBuildImage(8), title: "Detaylarda seçkin bir yaklaşım", note: "Mimari Detay" },
  { image: getBuildImage(9), title: "Akşamları başka bir atmosfer", note: "Gece Görünümü" },
  { image: getBuildImage(10), title: "Elys Prime'a hoş geldiniz", note: "Giriş" },
];

export default function ProjectGallerySection() {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const active = slides[index];
  const move = (direction: number) => setIndex((current) => (current + direction + slides.length) % slides.length);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setFullscreen(false); if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  return <section id="vizyon" className="h-dvh snap-start snap-always overflow-hidden bg-[#181a18] text-white">
    <div className="mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-5 pt-24 sm:px-9 sm:pb-8 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="mb-5 grid shrink-0 gap-4 lg:grid-cols-2 lg:items-end">
        <div><p className="eyebrow text-[#d8b792]">Proje Vizyonu</p><h2 className="mt-3 max-w-2xl text-4xl font-medium leading-[.9] tracking-[-.04em] sm:text-6xl lg:text-7xl">Yaşamın yeni <em>perspektifi.</em></h2></div>
        <p className="max-w-md text-sm leading-7 text-white/55 lg:justify-self-end">Modern mimariyi geniş peyzaj alanları, sosyal yaşam ve aile sıcaklığıyla bir araya getiren bütüncül bir proje.</p>
      </div>

      <div className="group relative min-h-0 flex-1 overflow-hidden bg-black">
        <Image key={index} src={active.image} alt={active.title} fill priority={index === 0} sizes="100vw" className="object-contain" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"/>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-8 lg:p-10">
          <div><span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#d8b792]">{active.note}</span><h3 className="mt-1 max-w-2xl text-2xl font-medium sm:text-4xl">{active.title}</h3></div>
          <button onClick={() => setFullscreen(true)} className="grid size-12 shrink-0 place-items-center border border-white/45 bg-black/10 backdrop-blur hover:bg-white hover:text-black" aria-label="Görseli tam ekran aç"><Expand size={18}/></button>
        </div>
        <div className="absolute right-5 top-5 text-xs tracking-[.16em] sm:right-8 sm:top-8"><span className="text-white">{String(index + 1).padStart(2,"0")}</span><span className="text-white/40"> / {String(slides.length).padStart(2,"0")}</span></div>
      </div>

      <div className="mt-3 flex shrink-0 items-center gap-3">
        <button onClick={() => move(-1)} className="grid size-12 place-items-center border border-white/20 transition-colors hover:border-[#d8b792] hover:text-[#d8b792]" aria-label="Önceki görsel"><ArrowLeft size={18}/></button>
        <button onClick={() => move(1)} className="grid size-12 place-items-center border border-white/20 transition-colors hover:border-[#d8b792] hover:text-[#d8b792]" aria-label="Sonraki görsel"><ArrowRight size={18}/></button>
        <div className="ml-3 flex flex-1 gap-1">{slides.map((slide, slideIndex) => <button key={slide.note} onClick={() => setIndex(slideIndex)} aria-label={`${slideIndex + 1}. görsele git`} className={`h-px flex-1 transition-colors ${slideIndex === index ? "bg-[#d8b792]" : "bg-white/20 hover:bg-white/50"}`}/>)}</div>
      </div>
    </div>

    {fullscreen && <div className="fixed inset-0 z-[80] bg-black p-4 sm:p-8" role="dialog" aria-modal="true"><Image src={active.image} alt={active.title} fill sizes="100vw" className="object-contain"/><button onClick={() => setFullscreen(false)} className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-white text-black" aria-label="Tam ekran görünümü kapat"><X/></button><button onClick={() => move(-1)} className="absolute left-5 top-1/2 grid size-12 -translate-y-1/2 place-items-center bg-white/90 text-black" aria-label="Önceki görsel"><ArrowLeft/></button><button onClick={() => move(1)} className="absolute right-5 top-1/2 grid size-12 -translate-y-1/2 place-items-center bg-white/90 text-black" aria-label="Sonraki görsel"><ArrowRight/></button></div>}
  </section>;
}

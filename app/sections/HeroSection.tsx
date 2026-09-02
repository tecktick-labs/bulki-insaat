import { getBuildImage, getPromotionVideos } from "@/app/lib/mediaAssets";
import { ArrowDown, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

export default function HeroSection({ projectName, title, completionRate, unitsSold, constructionArea, whatsappLink }: { projectName: string; title: string; completionRate: number; unitsSold: number; constructionArea: number; whatsappLink: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
    void video.play();
  };

  return <section id="giris" className="relative h-dvh snap-start snap-always overflow-hidden bg-[#121412] text-white">
    <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster={getBuildImage(1)} className="absolute inset-0 h-full w-full object-cover" aria-label="Elys Prime proje tanıtım videosu">
      {getPromotionVideos().map((video) => <source key={video.type} src={video.src} type={video.type}/>) }
    </video>
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,10,.82)_0%,rgba(10,12,10,.45)_45%,rgba(10,12,10,.12)_78%),linear-gradient(0deg,rgba(10,12,10,.7)_0%,transparent_45%)]" />
    <div className="ambient-grid absolute inset-0 opacity-30" />

    <div className="relative mx-auto flex min-h-dvh max-w-[1440px] items-end px-5 pb-10 pt-32 sm:px-9 sm:pb-14 lg:items-center lg:px-14 lg:pb-0">
      <div className="max-w-4xl">
        <p className="eyebrow reveal-up text-[#d8b792]">Bulki Yapı & Çözüm Konut</p>
        <h1 className="reveal-up reveal-delay-1 mt-6 text-[clamp(4rem,11vw,9.5rem)] font-medium leading-[.76] tracking-[-.065em]">{projectName.split(" ")[0]}<br/><span className="ml-[.45em] italic text-[#d8b792]">{projectName.split(" ").slice(1).join(" ")}</span></h1>
        <p className="reveal-up reveal-delay-2 mt-8 max-w-xl text-base leading-7 text-white/80 sm:text-xl sm:leading-8">{title}</p>
        <div className="reveal-up reveal-delay-3 mt-8 flex flex-wrap gap-3">
          <a href="#vizyon" className="inline-flex items-center gap-4 bg-[#d8b792] px-6 py-4 text-[11px] font-bold uppercase tracking-[.16em] text-[#181a18] transition-colors hover:bg-white">Projeyi Keşfet <ArrowDown size={16}/></a>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 border border-white/45 px-6 py-4 text-[11px] font-bold uppercase tracking-[.16em] backdrop-blur transition-colors hover:bg-white hover:text-[#181a18]">Bilgi Al <ArrowUpRight size={16}/></a>
        </div>
      </div>

      <div className="absolute bottom-10 right-5 hidden items-end gap-10 sm:flex sm:right-9 lg:right-14">
        {[{ value: `%${completionRate}`, label: "Tamamlandı" }, { value: String(unitsSold), label: "Yeni komşu" }, { value: constructionArea.toLocaleString("tr-TR"), label: "m² yaşam alanı" }].map((item) => <div key={item.label} className="border-l border-white/35 pl-4"><strong className="display-font block text-3xl font-medium">{item.value}</strong><span className="mt-1 block text-[9px] font-bold uppercase tracking-[.18em] text-white/55">{item.label}</span></div>)}
      </div>
    </div>

    <button onClick={toggleSound} className="absolute right-5 top-24 grid size-11 place-items-center rounded-full border border-white/35 bg-black/10 backdrop-blur transition-colors hover:bg-white hover:text-[#181a18] sm:right-9 lg:right-14" aria-label={muted ? "Videonun sesini aç" : "Videonun sesini kapat"}>{muted ? <VolumeX size={17}/> : <Volume2 size={17}/>}</button>
  </section>;
}

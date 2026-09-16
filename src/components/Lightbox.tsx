"use client";
import { Maximize2, Minimize2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type LightboxContent = {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  /** SVG gibi optimize edilmemesi gereken kaynaklar için. */
  unoptimized?: boolean;
};

/**
 * Sitenin tek görsel önizleyicisi. Ekranı neredeyse tamamen kaplar,
 * içeride kaydırılabilir ve yakınlaştırılabilir. Galeri, daire planları
 * ve broşürler aynı bileşeni kullanır.
 */
export default function Lightbox({ content, onClose }: { content: LightboxContent | null; onClose: () => void }) {
  // `key` ile her yeni görselde taze monte edilir; yakınlaştırma durumu
  // böylece effect içinde state sıfırlamadan kendiliğinden sıfırlanır.
  if (!content) return null;
  return <LightboxDialog key={content.src} content={content} onClose={onClose} />;
}

function LightboxDialog({ content, onClose }: { content: LightboxContent; onClose: () => void }) {
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);

    // Arkadaki snap-scroll konteyneri modal açıkken kaymasın.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-2 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      onClick={onClose}
    >
      <div
        className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#161816] shadow-[0_40px_120px_rgba(0,0,0,.7)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#1d201d] px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            {content.subtitle && <span className="block truncate text-[9px] font-bold uppercase tracking-[.2em] text-[#d8b792]">{content.subtitle}</span>}
            <h2 className="mt-0.5 truncate text-base font-semibold text-white sm:text-xl">{content.title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setZoomed((value) => !value)}
              className="hidden size-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-[#d8b792] hover:text-[#d8b792] sm:grid"
              aria-label={zoomed ? "Uzaklaştır" : "Yakınlaştır"}
            >
              {zoomed ? <Minimize2 size={17}/> : <Maximize2 size={17}/>}
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full bg-white text-black transition-colors hover:bg-[#d8b792]"
              aria-label="Önizlemeyi kapat"
            >
              <X size={19}/>
            </button>
          </div>
        </header>

        {/* İçerik alanı kaydırılabilir; yakınlaştırınca görsel taşar ve gezinilebilir. */}
        <div className={`min-h-0 flex-1 bg-[#0f110f] ${zoomed ? "overflow-auto" : "grid place-items-center overflow-auto p-2 sm:p-4"}`}>
          <Image
            src={content.src}
            alt={content.alt}
            width={1449}
            height={1600}
            unoptimized={content.unoptimized}
            priority
            className={zoomed ? "h-auto w-[180%] max-w-none sm:w-[150%]" : "h-auto max-h-full w-auto max-w-full object-contain"}
          />
        </div>
      </div>
    </div>
  );
}

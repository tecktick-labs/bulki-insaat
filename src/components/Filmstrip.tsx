"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Şerit, kaynağın üç kopyasıyla döşenir; kullanıcı orta kopyada gezinir. */
const COPIES = 3;

export type FilmstripProps<T> = {
  items: T[];
  itemKey: (item: T) => string;
  renderItem: (item: T, isActive: boolean) => ReactNode;
  /** Açılışta ortalanacak kart (0 tabanlı). */
  initialIndex?: number;
  /** Kart genişliği — kopyalar arası atlama bu ölçüye göre hesaplanır. */
  itemClassName?: string;
  label: string;
};

export default function Filmstrip<T>({
  items,
  itemKey,
  renderItem,
  initialIndex = 0,
  itemClassName = "w-[76vw] sm:w-[50vw] lg:w-[30rem]",
  label,
}: FilmstripProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(initialIndex % Math.max(1, items.length));

  const animatingRef = useRef(false);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const readyRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const loop = items.length > 1;
  const rendered = loop ? Array.from({ length: COPIES }, () => items).flat() : items;

  /**
   * Bir kopyanın genişliği. `scrollWidth / COPIES` kullanılamaz: şeridin
   * px-[50%] iç boşluğu da scrollWidth'e dahildir ve atlama mesafesini bozar.
   * Doğru ölçü, aynı kartın iki kopyası arasındaki offset farkıdır.
   */
  const setWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || !loop) return 0;
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[items.length] as HTMLElement | undefined;
    if (!first || !second) return 0;
    return second.offsetLeft - first.offsetLeft;
  }, [loop, items.length]);

  /** Bir kartı şeridin tam ortasına getiren scrollLeft değeri. */
  const offsetFor = (childIndex: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const node = track.children[childIndex] as HTMLElement | undefined;
    if (!node) return 0;
    return node.offsetLeft + node.offsetWidth / 2 - track.clientWidth / 2;
  };

  const closestChild = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, index) => {
      const node = child as HTMLElement;
      const delta = Math.abs(node.offsetLeft + node.offsetWidth / 2 - center);
      if (delta < distance) { distance = delta; closest = index; }
    });
    return closest;
  }, []);

  // Açılışta orta kopyadaki `initialIndex` kartına konumlan.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    const start = (loop ? items.length : 0) + (initialIndex % items.length);
    const settle = () => {
      track.scrollLeft = offsetFor(start);
      setActive(initialIndex % items.length);
      readyRef.current = true;
    };
    // Kartlar ölçülene kadar bir kare bekle.
    const frame = requestAnimationFrame(settle);
    return () => cancelAnimationFrame(frame);
  }, [items.length, initialIndex, loop]);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !readyRef.current) return;

    setActive(closestChild() % items.length);

    // Sonsuz his: orta kopyadan yarım set uzaklaşınca bir set kadar sessizce atla.
    if (!loop || animatingRef.current || draggingRef.current) return;
    const width = setWidth();
    if (width === 0) return;
    const middle = offsetFor(items.length);
    if (track.scrollLeft < middle - width * 0.5) track.scrollLeft += width;
    else if (track.scrollLeft > middle + width * 0.5) track.scrollLeft -= width;
  }, [closestChild, items.length, loop, setWidth]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  /**
   * Yumuşak kaydırmayı elle yürütürüz: `scroll-snap-type: mandatory` açıkken
   * tarayıcının `scrollTo({behavior:"smooth"})` çağrısı anında iptal ediliyor.
   * Snap'i kapatıp animasyonu sürdürür, bitişte tekrar açarız — hedef zaten
   * bir snap noktası olduğu için geri açmak konumu oynatmaz.
   */
  const animateTo = useCallback((left: number) => {
    const track = trackRef.current;
    if (!track) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    animatingRef.current = true;
    track.style.scrollSnapType = "none";
    const from = track.scrollLeft;
    const distance = left - from;
    const duration = 420;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      track.scrollLeft = from + distance * eased;
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      rafRef.current = null;
      track.style.scrollSnapType = "";
      animatingRef.current = false;
      onScroll();
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [onScroll]);

  useEffect(() => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); }, []);

  const step = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = closestChild() + direction;
    if (target < 0 || target >= track.children.length) return;
    animateTo(offsetFor(target));
  };

  /** Noktalara tıklayınca en yakın kopyadaki aynı karta gider. */
  const goToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const current = closestChild();
    const base = loop ? Math.floor(current / items.length) * items.length : 0;
    step(base + index - current);
  };

  // ——— Elle sürükleme ———
  const onPointerDown = (event: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || event.pointerType === "touch") return; // dokunmatikte tarayıcının kendi kaydırması yeterli
    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = event.clientX;
    startScrollRef.current = track.scrollLeft;
    track.style.scrollSnapType = "none";
    // DİKKAT: pointer capture burada alınmaz. Alınırsa pointerup şeride
    // yönlenir, karttaki butonlar hiç `click` almaz (büyüt düğmesi çalışmazdı).
    // Capture yalnızca gerçekten sürükleme başlayınca alınır.
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || !draggingRef.current) return;
    const delta = event.clientX - startXRef.current;
    if (Math.abs(delta) > 4 && !movedRef.current) {
      movedRef.current = true;
      track.setPointerCapture(event.pointerId);
    }
    if (!movedRef.current) return;
    track.scrollLeft = startScrollRef.current - delta;
  };

  const endDrag = (event: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || !draggingRef.current) return;
    draggingRef.current = false;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (!movedRef.current) {
      // Sürükleme olmadı: sadece bir tıklama. Snap'i geri ver, konumu oynatma.
      track.style.scrollSnapType = "";
      return;
    }
    // Bırakıldığı yerde en yakın karta otur.
    animateTo(offsetFor(closestChild()));
  };

  /** Sürükleme sonrası kartın linki tetiklenmesin. */
  const onClickCapture = (event: React.MouseEvent) => {
    if (!movedRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    movedRef.current = false;
  };

  // Kenar okları yalnızca sm ve üstünde: telefonda kartın üstünü kapatıyorlardı
  // ve alttaki ok/nokta kontrolleri aynı işi görüyor.
  const sideButton = "pointer-events-auto hidden size-11 place-items-center sm:grid rounded-full border border-white/25 bg-[#12140f]/70 text-white backdrop-blur-md transition-colors hover:border-[#d8b792] hover:bg-[#d8b792] hover:text-[#181a18] sm:size-12";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div
          ref={trackRef}
          role="region"
          aria-label={label}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          className="no-scrollbar flex h-full cursor-grab touch-pan-x snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[50%] select-none active:cursor-grabbing sm:gap-6"
        >
          {rendered.map((item, index) => {
            const isActive = index % items.length === active;
            return (
              <div
                key={`${itemKey(item)}-${index}`}
                className={`flex h-full shrink-0 snap-center flex-col transition-all duration-500 ${itemClassName} ${
                  isActive ? "scale-100 opacity-100" : "scale-[.88] opacity-45"
                }`}
              >
                {renderItem(item, isActive)}
              </div>
            );
          })}
        </div>

        {/* Kenarlardaki oklar */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center pl-1 sm:flex sm:pl-3">
          <button type="button" onClick={() => step(-1)} className={sideButton} aria-label="Önceki"><ArrowLeft size={18}/></button>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-1 sm:flex sm:pr-3">
          <button type="button" onClick={() => step(1)} className={sideButton} aria-label="Sonraki"><ArrowRight size={18}/></button>
        </div>
      </div>

      {/* Alt ortadaki oklar ve noktalar */}
      <div className="mt-4 flex shrink-0 items-center justify-center gap-4">
        <button type="button" onClick={() => step(-1)} className="grid size-10 place-items-center border border-white/20 transition-colors hover:border-[#d8b792] hover:text-[#d8b792]" aria-label="Önceki"><ArrowLeft size={16}/></button>
        <div className="flex items-center gap-2">
          {items.map((item, index) => (
            <button
              key={itemKey(item)}
              type="button"
              onClick={() => goToIndex(index)}
              aria-label={`${index + 1}. karta git`}
              aria-current={index === active ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === active ? "w-7 bg-[#d8b792]" : "w-1.5 bg-white/25 hover:bg-white/60"}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => step(1)} className="grid size-10 place-items-center border border-white/20 transition-colors hover:border-[#d8b792] hover:text-[#d8b792]" aria-label="Sonraki"><ArrowRight size={16}/></button>
      </div>
    </div>
  );
}

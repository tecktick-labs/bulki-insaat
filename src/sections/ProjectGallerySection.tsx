"use client";
import Filmstrip from "@/components/Filmstrip";
import Lightbox from "@/components/Lightbox";
import { ArrowRight, Expand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { GallerySlide } from "@/lib/sections";


export default function ProjectGallerySection({ slides }: { slides: GallerySlide[] }) {
  const [fullscreen, setFullscreen] = useState<GallerySlide | null>(null);


  return <section id="vizyon" className="h-dvh snap-start snap-always overflow-hidden bg-[#181a18] text-white">
    <div className="mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-5 pt-24 sm:px-9 sm:pb-8 lg:px-14 lg:pb-10 lg:pt-28">
      <div className="grid shrink-0 gap-4 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="eyebrow text-[#d8b792]">Proje Vizyonu</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold leading-[.95] tracking-[-.04em] sm:text-5xl lg:text-6xl">Yaşamın yeni <em className="font-light">perspektifi.</em></h2>
        </div>
        <div className="max-w-md lg:justify-self-end">
          <Link href="/proje" className="inline-flex items-center gap-2 text-[16px] font-bold uppercase tracking-[.16em] text-[#d8b792] underline-offset-4 hover:underline">Proje künyesini inceleyin <ArrowRight size={13}/></Link>
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        <Filmstrip
          items={slides}
          itemKey={(slide) => slide.key}
          initialIndex={2}
          label="Proje görsel şeridi"
          itemClassName="w-[82vw] sm:w-[62vw] lg:w-[44rem]"
          renderItem={(slide, isActive) => (
            <figure className={`group relative h-full overflow-hidden border bg-black transition-colors ${isActive ? "border-[#d8b792]/45 shadow-[0_28px_70px_rgba(0,0,0,.5)]" : "border-white/10"}`}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                draggable={false}
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 62vw, 44rem"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10"/>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#d8b792]">{slide.note}</span>
                  <h3 className="mt-1 text-xl font-semibold leading-snug sm:text-3xl">{slide.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setFullscreen(slide)}
                  tabIndex={isActive ? 0 : -1}
                  className="grid size-11 shrink-0 place-items-center border border-white/45 bg-black/20 backdrop-blur transition-colors hover:bg-white hover:text-black"
                  aria-label={`${slide.title} görselini tam ekran aç`}
                ><Expand size={17}/></button>
              </figcaption>
            </figure>
          )}
        />
      </div>
    </div>

    <Lightbox
      content={fullscreen && { src: fullscreen.image, alt: fullscreen.title, title: fullscreen.title, subtitle: fullscreen.note }}
      onClose={() => setFullscreen(null)}
    />
  </section>;
}

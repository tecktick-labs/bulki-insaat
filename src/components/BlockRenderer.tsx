import Image from "next/image";
import type { ContentBlock } from "@/lib/content-types";

/** Panelde üretilen blokları sayfaya basar. Bilinmeyen blok tipleri sessizce atlanır. */
export default function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case "heading":
            return (
              <h2 key={key} className="display-font pt-4 text-2xl font-medium leading-tight tracking-[-.03em] sm:text-3xl">
                {block.text}
              </h2>
            );

          case "paragraph":
            return (
              <p key={key} className="text-[15px] leading-8 text-white/60">
                {block.text}
              </p>
            );

          case "list":
            return (
              <ul key={key} className="space-y-3 pl-5">
                {block.items.filter(Boolean).map((item) => (
                  <li key={item} className="list-disc text-[15px] leading-8 text-white/60 marker:text-[#d8b792]">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <figure key={key} className="border-l-2 border-[#d8b792] pl-6">
                <blockquote className="display-font text-xl leading-relaxed text-white/80 sm:text-2xl">
                  {block.text}
                </blockquote>
                {block.cite && (
                  <figcaption className="mt-3 text-[10px] font-bold uppercase tracking-[.16em] text-white/40">
                    {block.cite}
                  </figcaption>
                )}
              </figure>
            );

          case "image":
            if (!block.url) return null;
            return (
              <figure key={key}>
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  <Image src={block.url} alt={block.alt} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-xs leading-6 text-white/35">{block.caption}</figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

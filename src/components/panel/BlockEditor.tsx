"use client";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { blockTypeLabels, emptyBlock, type ContentBlock } from "@/lib/content-types";
import ImageField from "./ImageField";
import { buttonClass, inputClass, labelClass } from "./ui";

/** Sayfa gövdeleri ve blog yazıları için ortak blok editörü. */
export default function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (next: ContentBlock[]) => void;
}) {
  const update = (index: number, block: ContentBlock) =>
    onChange(blocks.map((item, itemIndex) => (itemIndex === index ? block : item)));

  const remove = (index: number) => onChange(blocks.filter((_, itemIndex) => itemIndex !== index));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <article key={index} className="border border-white/10 bg-[#292c29] p-4">
            <header className="mb-4 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">
                {String(index + 1).padStart(2, "0")} · {blockTypeLabels[block.type]}
              </span>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Yukarı taşı" className="border border-white/15 p-2 transition hover:bg-[#181a18] disabled:opacity-30">
                  <ChevronUp size={13} />
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} aria-label="Aşağı taşı" className="border border-white/15 p-2 transition hover:bg-[#181a18] disabled:opacity-30">
                  <ChevronDown size={13} />
                </button>
                <button type="button" onClick={() => remove(index)} aria-label="Bloğu sil" className="border border-white/15 p-2 text-red-300 transition hover:bg-[#181a18]">
                  <Trash2 size={13} />
                </button>
              </div>
            </header>

            {block.type === "heading" && (
              <label className={labelClass}>
                Ara başlık metni
                <input className={inputClass} value={block.text} onChange={(event) => update(index, { ...block, text: event.target.value })} />
              </label>
            )}

            {block.type === "paragraph" && (
              <label className={labelClass}>
                Paragraf
                <textarea rows={5} className={inputClass} value={block.text} onChange={(event) => update(index, { ...block, text: event.target.value })} />
              </label>
            )}

            {block.type === "quote" && (
              <>
                <label className={labelClass}>
                  Alıntı
                  <textarea rows={3} className={inputClass} value={block.text} onChange={(event) => update(index, { ...block, text: event.target.value })} />
                </label>
                <label className={`${labelClass} mt-3`}>
                  Kaynak (isteğe bağlı)
                  <input className={inputClass} value={block.cite ?? ""} onChange={(event) => update(index, { ...block, cite: event.target.value })} />
                </label>
              </>
            )}

            {block.type === "list" && (
              <div>
                <span className={labelClass}>Maddeler</span>
                <div className="mt-2 space-y-2">
                  {block.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2">
                      <input
                        className={`${inputClass} mt-0`}
                        value={item}
                        onChange={(event) =>
                          update(index, { ...block, items: block.items.map((current, currentIndex) => (currentIndex === itemIndex ? event.target.value : current)) })
                        }
                      />
                      <button
                        type="button"
                        aria-label="Maddeyi sil"
                        onClick={() => update(index, { ...block, items: block.items.filter((_, currentIndex) => currentIndex !== itemIndex) })}
                        className="shrink-0 border border-white/15 px-3 text-red-300 transition hover:bg-[#181a18]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => update(index, { ...block, items: [...block.items, ""] })} className={`${buttonClass} mt-3`}>
                  <Plus size={13} /> Madde ekle
                </button>
              </div>
            )}

            {block.type === "image" && (
              <>
                <ImageField
                  label="Görsel"
                  url={block.url}
                  alt={block.alt}
                  onChange={({ url, alt }) => update(index, { ...block, url, alt })}
                />
                <label className={`${labelClass} mt-3`}>
                  Görsel açıklaması (isteğe bağlı)
                  <input className={inputClass} value={block.caption ?? ""} onChange={(event) => update(index, { ...block, caption: event.target.value })} />
                </label>
              </>
            )}
          </article>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(blockTypeLabels) as ContentBlock["type"][]).map((type) => (
          <button key={type} type="button" onClick={() => onChange([...blocks, emptyBlock(type)])} className={buttonClass}>
            <Plus size={13} /> {blockTypeLabels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}

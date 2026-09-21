"use client";
import { Check, ChevronDown, ChevronUp, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { revalidateSite } from "@/lib/content.client";
import { fetchSection, saveSection } from "@/lib/sections.client";
import { sectionDefaults, type SectionData, type SectionId } from "@/lib/sections";
import { buttonClass, primaryButtonClass } from "./ui";

type Item<Id extends SectionId> = SectionData[Id][number];

/**
 * Kampanya, galeri, belge ve daire tipi editörlerinin ortak iskeleti:
 * yükleme, ekleme/silme/sıralama, kaydetme ve önbellek tazeleme.
 * Her editör yalnızca kendi alanlarını `renderItem` ile tarif eder.
 *
 * İki yerleşim var:
 * - `cards` (varsayılan): her kayıt açık bir kart olarak alt alta listelenir.
 * - `rows`: kayıtlar görsel + başlıktan oluşan dar satırlar olarak listelenir,
 *   düzenleme alanı satıra tıklayınca açılan modalda gösterilir. Alanı çok olan
 *   bölümlerde (daire tipleri) sayfayı okunaklı tutar.
 */
export default function SectionEditor<Id extends SectionId>({
  id,
  description,
  newItem,
  itemTitle,
  renderItem,
  revalidatePaths = ["/"],
  reorderable = true,
  addable = true,
  variant = "cards",
  rowImage,
  rowMeta,
}: {
  id: Id;
  description: string;
  newItem?: () => Item<Id>;
  itemTitle: (item: Item<Id>, index: number) => string;
  renderItem: (item: Item<Id>, update: (next: Item<Id>) => void) => ReactNode;
  revalidatePaths?: string[];
  reorderable?: boolean;
  addable?: boolean;
  variant?: "cards" | "rows";
  /** `rows` yerleşiminde satırdaki küçük görselin URL'i. */
  rowImage?: (item: Item<Id>) => string;
  /** `rows` yerleşiminde başlığın altındaki gri satır. */
  rowMeta?: (item: Item<Id>) => string;
}) {
  // null = henüz yüklenmedi.
  const [items, setItems] = useState<Item<Id>[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  /** `rows` yerleşiminde modalda açık olan kaydın sırası. */
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSection(id)
      .then((next) => { if (!cancelled) setItems(next as Item<Id>[]); })
      .catch(() => {
        if (cancelled) return;
        setItems(sectionDefaults[id] as Item<Id>[]);
        setError("Kayıtlı içerik okunamadı, varsayılanlar gösteriliyor.");
      });

    return () => { cancelled = true; };
  }, [id]);

  const update = (index: number, next: Item<Id>) =>
    setItems((current) => current?.map((item, itemIndex) => (itemIndex === index ? next : item)) ?? current);

  const remove = (index: number) =>
    setItems((current) => current?.filter((_, itemIndex) => itemIndex !== index) ?? current);

  const move = (index: number, direction: -1 | 1) =>
    setItems((current) => {
      if (!current) return current;
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const save = async () => {
    if (!items) return;
    setIsSaving(true);
    setError("");
    try {
      await saveSection(id, items as SectionData[Id]);
      await revalidateSite(revalidatePaths);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  // Modal açıkken Escape kapatır ve arkadaki sayfa kaymaz.
  useEffect(() => {
    if (editing === null) return;

    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setEditing(null); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [editing]);

  if (!items) {
    return <p className="flex items-center gap-2 py-10 text-sm text-white/45"><Loader2 size={15} className="animate-spin" /> Yükleniyor...</p>;
  }

  const saveButton = (
    <button type="button" disabled={isSaving} onClick={() => void save()} className={primaryButtonClass}>
      {saved ? <Check size={14} /> : <Save size={14} />} {isSaving ? "Kaydediliyor..." : saved ? "Kaydedildi" : "Kaydet"}
    </button>
  );

  const editingItem = editing !== null ? items[editing] : undefined;

  return (
    <div>
      <p className="mb-6 max-w-2xl text-xs leading-6 text-white/45">{description}</p>

      {error && <p role="alert" className="mb-5 border border-red-300/25 bg-red-300/10 px-5 py-4 text-sm text-red-200">{error}</p>}

      {variant === "rows" ? (
        <ul className="divide-y divide-white/10 border border-white/10 bg-[#202320]">
          {items.map((item, index) => {
            const image = rowImage?.(item) ?? "";
            const meta = rowMeta?.(item) ?? "";

            return (
              <li key={index}>
                <div className="flex items-center gap-4 px-4 py-3 transition hover:bg-[#262926] sm:px-5">
                  <button
                    type="button"
                    onClick={() => setEditing(index)}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left"
                  >
                    {image ? (
                      // Panel içi önizleme; next/image'a gerek yok.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" className="h-14 w-20 shrink-0 border border-white/10 bg-[#eeece7] object-contain" />
                    ) : (
                      <span className="h-14 w-20 shrink-0 border border-dashed border-white/15" />
                    )}

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate text-sm font-semibold">{itemTitle(item, index)}</span>
                      </span>
                      {meta && <span className="mt-1 block truncate text-[11px] text-white/40">{meta}</span>}
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-1">
                    {reorderable && (
                      <>
                        <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Yukarı taşı" className="border border-white/15 p-2 transition hover:bg-[#292c29] disabled:opacity-30">
                          <ChevronUp size={13} />
                        </button>
                        <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Aşağı taşı" className="border border-white/15 p-2 transition hover:bg-[#292c29] disabled:opacity-30">
                          <ChevronDown size={13} />
                        </button>
                      </>
                    )}
                    {addable && (
                      <button type="button" onClick={() => remove(index)} aria-label="Sil" className="border border-white/15 p-2 text-red-300 transition hover:bg-[#292c29]">
                        <Trash2 size={13} />
                      </button>
                    )}
                    <button type="button" onClick={() => setEditing(index)} className={buttonClass}>
                      <Pencil size={13} /> Düzenle
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <article key={index} className="border border-white/10 bg-[#202320] p-5 sm:p-7">
              <header className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <h3 className="min-w-0 truncate text-lg font-semibold">
                  <span className="mr-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {itemTitle(item, index)}
                </h3>
                <div className="flex shrink-0 gap-1">
                  {reorderable && (
                    <>
                      <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Yukarı taşı" className="border border-white/15 p-2 transition hover:bg-[#292c29] disabled:opacity-30">
                        <ChevronUp size={13} />
                      </button>
                      <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Aşağı taşı" className="border border-white/15 p-2 transition hover:bg-[#292c29] disabled:opacity-30">
                        <ChevronDown size={13} />
                      </button>
                    </>
                  )}
                  {addable && (
                    <button type="button" onClick={() => remove(index)} aria-label="Sil" className="border border-white/15 p-2 text-red-300 transition hover:bg-[#292c29]">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </header>

              {renderItem(item, (next) => update(index, next))}
            </article>
          ))}
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        {addable && newItem ? (
          <button type="button" onClick={() => setItems([...items, newItem()])} className={buttonClass}>
            <Plus size={14} /> Yeni ekle
          </button>
        ) : <span />}

        {saveButton}
      </div>

      {editing !== null && editingItem !== undefined && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-8"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={itemTitle(editingItem, editing)}
            className="flex max-h-full w-full max-w-4xl flex-col border border-white/15 bg-[#202320] shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
              <h3 className="min-w-0 truncate text-lg font-semibold">
                <span className="mr-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">
                  {String(editing + 1).padStart(2, "0")}
                </span>
                {itemTitle(editingItem, editing)}
              </h3>
              <button type="button" autoFocus onClick={() => setEditing(null)} aria-label="Kapat" className="shrink-0 border border-white/15 p-2 transition hover:bg-[#292c29]">
                <X size={15} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              {renderItem(editingItem, (next) => update(editing, next))}
            </div>

            <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-white/10 px-5 py-4 sm:px-7">
              <button type="button" onClick={() => setEditing(null)} className={buttonClass}>Kapat</button>
              {saveButton}
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

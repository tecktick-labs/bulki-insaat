"use client";
import { Check, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultPages } from "@/data/copy";
import { fetchPageCopy, revalidateSite, savePageCopy } from "@/lib/content.client";
import { pageSlugs, type PageCopy, type PageSlug } from "@/lib/content-types";
import BlockEditor from "./BlockEditor";
import { buttonClass, inputClass, labelClass, primaryButtonClass } from "./ui";

export default function PagesEditor() {
  const [slug, setSlug] = useState<PageSlug>("proje");
  const [page, setPage] = useState<PageCopy>(defaultPages.proje);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Yüklenmiş sayfa seçili sekmeyle eşleşene kadar yükleme durumundayız;
  // ayrı bir isLoading state'i tutmaya gerek yok.
  const isLoading = page.slug !== slug;

  useEffect(() => {
    let cancelled = false;

    fetchPageCopy(slug)
      .then((next) => {
        if (cancelled) return;
        setPage(next);
        setError("");
      })
      .catch(() => {
        if (cancelled) return;
        setPage(defaultPages[slug]);
        setError("Kayıtlı metin okunamadı, varsayılanlar gösteriliyor.");
      });

    return () => { cancelled = true; };
  }, [slug]);

  const save = async () => {
    setIsSaving(true);
    setError("");
    try {
      await savePageCopy(page);
      await revalidateSite([`/${page.slug}`]);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sayfa kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const set = <K extends keyof PageCopy>(key: K, value: PageCopy[K]) =>
    setPage((current) => ({ ...current, [key]: value }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {pageSlugs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSlug(item)}
            className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] transition ${
              slug === item ? "bg-[#d8b792] text-[#181a18]" : "border border-white/15 text-white/60 hover:bg-[#292c29]"
            }`}
          >
            {defaultPages[item].label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mb-5 border border-red-300/25 bg-red-300/10 px-5 py-4 text-sm text-red-200">{error}</p>}

      {isLoading ? (
        <p className="flex items-center gap-2 py-10 text-sm text-white/45"><Loader2 size={15} className="animate-spin" /> Yükleniyor...</p>
      ) : (
        <>
          <section className="border border-white/10 bg-[#202320] p-5 sm:p-7">
            <h3 className="mb-5 text-xl font-semibold">Başlık ve SEO</h3>
            <div className="grid gap-5 lg:grid-cols-2">
              <label className={labelClass}>
                Sayfa başlığı (H1)
                <input className={inputClass} value={page.title} onChange={(event) => set("title", event.target.value)} />
              </label>
              <label className={labelClass}>
                Giriş cümlesi
                <input className={inputClass} value={page.lead} onChange={(event) => set("lead", event.target.value)} />
              </label>
              <label className={labelClass}>
                SEO başlığı <span className="text-white/25">(sekmede ve Google&apos;da görünür)</span>
                <input className={inputClass} value={page.seoTitle} onChange={(event) => set("seoTitle", event.target.value)} />
              </label>
              <label className={labelClass}>
                SEO açıklaması <span className="text-white/25">({page.seoDescription.length}/160 karakter)</span>
                <textarea rows={3} className={inputClass} value={page.seoDescription} onChange={(event) => set("seoDescription", event.target.value)} />
              </label>
            </div>
          </section>

          <section className="mt-6 border border-white/10 bg-[#202320] p-5 sm:p-7">
            <h3 className="mb-5 text-xl font-semibold">Sayfa metni</h3>
            <BlockEditor blocks={page.blocks} onChange={(blocks) => set("blocks", blocks)} />
          </section>

          {page.planTypes && (
            <section className="mt-6 border border-white/10 bg-[#202320] p-5 sm:p-7">
              <h3 className="text-xl font-semibold">Daire tipi açıklamaları</h3>
              <p className="mt-2 mb-5 text-xs leading-6 text-white/40">
                Her tip ailesi için yazdığınız metin, o aileye ait daire planı sayfalarında görünür.
              </p>
              <div className="space-y-4">
                {Object.entries(page.planTypes).map(([key, paragraphs]) => (
                  <article key={key} className="border border-white/10 bg-[#292c29] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">{key.replace("|", " · ")}</span>
                    <div className="mt-3 space-y-2">
                      {paragraphs.map((paragraph, index) => (
                        <textarea
                          key={index}
                          rows={3}
                          className={inputClass}
                          value={paragraph}
                          onChange={(event) =>
                            set("planTypes", {
                              ...page.planTypes,
                              [key]: paragraphs.map((current, currentIndex) => (currentIndex === index ? event.target.value : current)),
                            })
                          }
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className={`${buttonClass} mt-3`}
                      onClick={() => set("planTypes", { ...page.planTypes, [key]: [...paragraphs, ""] })}
                    >
                      Paragraf ekle
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className="mt-7 flex justify-end">
            <button type="button" disabled={isSaving} onClick={save} className={primaryButtonClass}>
              {saved ? <Check size={14} /> : <Save size={14} />} {isSaving ? "Kaydediliyor..." : saved ? "Kaydedildi" : "Sayfayı kaydet"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

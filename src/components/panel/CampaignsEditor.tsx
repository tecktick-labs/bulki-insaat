"use client";
import { Plus, Trash2 } from "lucide-react";
import SectionEditor from "./SectionEditor";
import ImageField from "./ImageField";
import { slugify } from "@/lib/content-types";
import { emptyCampaign } from "@/lib/sections";
import { buttonClass, inputClass, labelClass } from "./ui";

export default function CampaignsEditor() {
  return (
    <SectionEditor
      id="campaigns"
      description="Kampanyalar üç yerde birden görünür: ana sayfadaki broşür şeridi, üst menü ve her kampanyanın kendi /kampanya/... sayfası. Adres alanını değiştirirseniz o sayfanın URL'i de değişir — arama motorunda sıralanmış bir sayfayı yeniden adlandırmak sıralamayı sıfırlar."
      newItem={emptyCampaign}
      itemTitle={(campaign) => campaign.title || "(başlıksız kampanya)"}
      revalidatePaths={["/", "/kampanya"]}
      renderItem={(campaign, update) => (
        <>
          <section>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">Ana sayfadaki kart</h4>
            <div className="grid gap-5 lg:grid-cols-3">
              <label className={labelClass}>
                Rozet <span className="text-white/25">(%30, 30 AY…)</span>
                <input className={inputClass} value={campaign.badge} onChange={(event) => update({ ...campaign, badge: event.target.value })} />
              </label>
              <label className={labelClass}>
                Kısa başlık
                <input className={inputClass} value={campaign.label} onChange={(event) => update({ ...campaign, label: event.target.value })} />
              </label>
              <label className={labelClass}>
                Alt satır <span className="text-white/25">(Sınırlı süre…)</span>
                <input className={inputClass} value={campaign.hint} onChange={(event) => update({ ...campaign, hint: event.target.value })} />
              </label>
            </div>
            <div className="mt-5">
              <ImageField
                label="Broşür görseli"
                url={campaign.poster}
                alt={campaign.posterAlt}
                onChange={({ url, alt }) => update({ ...campaign, poster: url, posterAlt: alt })}
              />
            </div>
          </section>

          <section className="mt-8 border-t border-white/10 pt-6">
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">Kampanya sayfası</h4>
            <div className="grid gap-5 lg:grid-cols-2">
              <label className={labelClass}>
                Sayfa başlığı (H1)
                <input
                  className={inputClass}
                  value={campaign.title}
                  onChange={(event) => update({ ...campaign, title: event.target.value, slug: campaign.slug || slugify(event.target.value) })}
                />
              </label>
              <label className={labelClass}>
                Adres <span className="text-white/25">/kampanya/{campaign.slug || "..."}</span>
                <input className={inputClass} value={campaign.slug} onChange={(event) => update({ ...campaign, slug: slugify(event.target.value) })} />
              </label>
              <label className={`${labelClass} lg:col-span-2`}>
                Giriş cümlesi
                <textarea rows={2} className={inputClass} value={campaign.lead} onChange={(event) => update({ ...campaign, lead: event.target.value })} />
              </label>
            </div>

            <div className="mt-5">
              <span className={labelClass}>Paragraflar</span>
              <div className="mt-2 space-y-2">
                {campaign.paragraphs.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <textarea
                      rows={3}
                      className={`${inputClass} mt-0`}
                      value={paragraph}
                      onChange={(event) =>
                        update({ ...campaign, paragraphs: campaign.paragraphs.map((current, currentIndex) => (currentIndex === index ? event.target.value : current)) })
                      }
                    />
                    <button
                      type="button"
                      aria-label="Paragrafı sil"
                      onClick={() => update({ ...campaign, paragraphs: campaign.paragraphs.filter((_, currentIndex) => currentIndex !== index) })}
                      className="shrink-0 self-start border border-white/15 px-3 py-3 text-red-300 transition hover:bg-[#292c29]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => update({ ...campaign, paragraphs: [...campaign.paragraphs, ""] })} className={`${buttonClass} mt-3`}>
                <Plus size={13} /> Paragraf ekle
              </button>
            </div>

            <div className="mt-6">
              <span className={labelClass}>Öne çıkanlar <span className="text-white/25">(sayfadaki üç kutu)</span></span>
              <div className="mt-2 space-y-2">
                {campaign.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      className={`${inputClass} mt-0`}
                      placeholder="Etiket"
                      value={highlight.label}
                      onChange={(event) =>
                        update({ ...campaign, highlights: campaign.highlights.map((current, currentIndex) => (currentIndex === index ? { ...current, label: event.target.value } : current)) })
                      }
                    />
                    <input
                      className={`${inputClass} mt-0`}
                      placeholder="Değer"
                      value={highlight.value}
                      onChange={(event) =>
                        update({ ...campaign, highlights: campaign.highlights.map((current, currentIndex) => (currentIndex === index ? { ...current, value: event.target.value } : current)) })
                      }
                    />
                    <button
                      type="button"
                      aria-label="Kutuyu sil"
                      onClick={() => update({ ...campaign, highlights: campaign.highlights.filter((_, currentIndex) => currentIndex !== index) })}
                      className="shrink-0 border border-white/15 px-3 text-red-300 transition hover:bg-[#292c29]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => update({ ...campaign, highlights: [...campaign.highlights, { label: "", value: "" }] })} className={`${buttonClass} mt-3`}>
                <Plus size={13} /> Kutu ekle
              </button>
            </div>
          </section>

          <section className="mt-8 border-t border-white/10 pt-6">
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#d8b792]">SEO</h4>
            <div className="grid gap-5 lg:grid-cols-2">
              <label className={labelClass}>
                SEO başlığı
                <input className={inputClass} value={campaign.seoTitle} onChange={(event) => update({ ...campaign, seoTitle: event.target.value })} />
              </label>
              <label className={labelClass}>
                SEO açıklaması <span className="text-white/25">({campaign.seoDescription.length}/160)</span>
                <textarea rows={3} className={inputClass} value={campaign.seoDescription} onChange={(event) => update({ ...campaign, seoDescription: event.target.value })} />
              </label>
            </div>
          </section>
        </>
      )}
    />
  );
}

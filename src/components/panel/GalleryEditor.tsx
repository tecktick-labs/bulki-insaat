"use client";
import SectionEditor from "./SectionEditor";
import ImageField from "./ImageField";
import { emptyGallerySlide } from "@/lib/sections";
import { slugify } from "@/lib/content-types";
import { inputClass, labelClass } from "./ui";

export default function GalleryEditor() {
  return (
    <SectionEditor
      id="gallery"
      description="Ana sayfadaki proje galerisi. Başlık slaytın üzerinde büyük punto ile, etiket ise onun üstünde küçük harflerle görünür. Sıralama burada nasılsa sitede de öyle görünür."
      newItem={emptyGallerySlide}
      itemTitle={(slide) => slide.title || slide.note || "(başlıksız slayt)"}
      renderItem={(slide, update) => (
        <>
          <ImageField
            label="Görsel"
            url={slide.image}
            alt={slide.title}
            onChange={({ url }) => update({ ...slide, image: url })}
          />
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <label className={labelClass}>
              Başlık
              <input
                className={inputClass}
                value={slide.title}
                onChange={(event) => update({ ...slide, title: event.target.value, key: slide.key || slugify(event.target.value) })}
              />
            </label>
            <label className={labelClass}>
              Etiket <span className="text-white/25">(İç Bahçe, Cephe, Gece Görünümü…)</span>
              <input className={inputClass} value={slide.note} onChange={(event) => update({ ...slide, note: event.target.value })} />
            </label>
          </div>
        </>
      )}
    />
  );
}

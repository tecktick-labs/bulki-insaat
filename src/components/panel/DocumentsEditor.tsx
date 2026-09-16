"use client";
import SectionEditor from "./SectionEditor";
import FileField from "./FileField";
import { emptyDocument } from "@/lib/sections";
import { slugify } from "@/lib/content-types";
import { inputClass, labelClass } from "./ui";

export default function DocumentsEditor() {
  return (
    <SectionEditor
      id="documents"
      description="Footer'daki belgeler alanı. PDF yüklenmemiş bir belge sitede görünür ama indirilemez — alıcıya söz verip teslim etmemektense, hazır olmayan belgeyi listeden çıkarmak daha iyidir."
      newItem={emptyDocument}
      itemTitle={(document) => `${document.title || "(başlıksız)"}${document.file ? "" : " — PDF yok"}`}
      renderItem={(document, update) => (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            <label className={labelClass}>
              Belge adı
              <input
                className={inputClass}
                value={document.title}
                onChange={(event) => update({ ...document, title: event.target.value, slug: document.slug || slugify(event.target.value) })}
              />
            </label>
            <label className={labelClass}>
              Açıklama
              <input className={inputClass} value={document.description} onChange={(event) => update({ ...document, description: event.target.value })} />
            </label>
          </div>
          <div className="mt-5">
            <FileField label="PDF dosyası" url={document.file} onChange={(file) => update({ ...document, file })} />
          </div>
        </>
      )}
    />
  );
}

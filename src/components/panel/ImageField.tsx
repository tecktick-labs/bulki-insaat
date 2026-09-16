"use client";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useId, useState } from "react";
import { uploadImage } from "@/lib/content.client";
import { buttonClass, inputClass, labelClass } from "./ui";

/** Storage'a yükleme yapan ya da elle URL girmeye izin veren görsel alanı. */
export default function ImageField({
  label,
  url,
  alt,
  onChange,
}: {
  label: string;
  url: string;
  alt: string;
  onChange: (next: { url: string; alt: string }) => void;
}) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setIsUploading(true);
    try {
      onChange({ url: await uploadImage(file), alt });
    } catch {
      setError("Görsel yüklenemedi. Dosya 8 MB'ı aşmamalı ve jpeg/png/webp/avif olmalı.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="mt-2 flex flex-wrap items-start gap-4">
        {url ? (
          // Storage'daki görsel; panel içi önizleme olduğu için next/image'a gerek yok.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={alt} className="h-24 w-36 shrink-0 border border-white/10 object-cover" />
        ) : (
          <div className="grid h-24 w-36 shrink-0 place-items-center border border-dashed border-white/15 text-white/25">
            <ImagePlus size={20} />
          </div>
        )}

        <div className="min-w-56 flex-1">
          <label htmlFor={inputId} className={`${buttonClass} cursor-pointer`}>
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            {isUploading ? "Yükleniyor" : "Görsel yükle"}
          </label>
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          {url && (
            <button type="button" onClick={() => onChange({ url: "", alt })} className={`${buttonClass} ml-2`}>
              <X size={14} /> Kaldır
            </button>
          )}

          <input
            className={inputClass}
            placeholder="veya görsel URL'i"
            value={url}
            onChange={(event) => onChange({ url: event.target.value, alt })}
          />
          <input
            className={inputClass}
            placeholder="Alternatif metin (SEO ve erişilebilirlik için gerekli)"
            value={alt}
            onChange={(event) => onChange({ url, alt: event.target.value })}
          />
          {error && <p role="alert" className="mt-2 text-xs leading-5 text-red-300">{error}</p>}
        </div>
      </div>
    </div>
  );
}

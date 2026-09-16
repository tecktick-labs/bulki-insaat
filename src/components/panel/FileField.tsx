"use client";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { useId, useState } from "react";
import { uploadFile } from "@/lib/content.client";
import { buttonClass, inputClass, labelClass } from "./ui";

/** PDF yükleme alanı. Dosya Storage'ın `belgeler/` klasörüne gider. */
export default function FileField({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string;
  onChange: (next: string) => void;
}) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setIsUploading(true);
    try {
      onChange(await uploadFile(file, "belgeler"));
    } catch {
      setError("Dosya yüklenemedi. PDF olmalı ve 25 MB'ı aşmamalı.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label htmlFor={inputId} className={`${buttonClass} cursor-pointer`}>
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {isUploading ? "Yükleniyor" : url ? "PDF'i değiştir" : "PDF yükle"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(event) => void upload(event.target.files?.[0])}
        />

        {url ? (
          <>
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[11px] text-[#d8b792] underline underline-offset-4">
              <FileText size={13} /> Yüklenen dosyayı aç
            </a>
            <button type="button" onClick={() => onChange("")} className={buttonClass}>
              <X size={13} /> Kaldır
            </button>
          </>
        ) : (
          <span className="text-[11px] text-white/35">Dosya yok — sitede &quot;yakında&quot; olarak görünür.</span>
        )}
      </div>

      <input className={inputClass} placeholder="veya PDF adresi" value={url} onChange={(event) => onChange(event.target.value)} />
      {error && <p role="alert" className="mt-2 text-xs leading-5 text-red-300">{error}</p>}
    </div>
  );
}

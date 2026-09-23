"use client";
import { Loader2, Monitor, Smartphone, Trash2, Upload } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { deleteUploadedFile, revalidateSite, uploadVideo } from "@/lib/content.client";
import type { HeroVideo, VideoVariant } from "@/lib/media";
import { sectionDefaults } from "@/lib/sections";
import { fetchSection, saveSection } from "@/lib/sections.client";
import { buttonClass } from "./ui";

const MAX_BYTES = 100 * 1024 * 1024;

const columns: { variant: VideoVariant; label: string; hint: string; icon: typeof Smartphone }[] = [
  { variant: "mobile", label: "Mobil", hint: "Dikey (ör. 720x1280) MP4 önerilir.", icon: Smartphone },
  { variant: "desktop", label: "Web", hint: "Yatay (ör. 1920x1080) MP4 veya WebM önerilir.", icon: Monitor },
];

/**
 * Hero videoları. Kullanıcı siteye girdiğinde cihazına uygun listeden rastgele
 * bir video oynar ve sekme kapanana kadar aynı video kalır.
 *
 * Diğer bölümlerden farklı olarak ayrı bir "Kaydet" adımı yoktur: yükleme ve
 * silme anında Firestore'a yazılır. Böylece Storage'a yüklenmiş ama listede
 * olmayan (ya da listede olup Storage'dan silinmiş) video kalmaz.
 */
export default function HeroVideosEditor() {
  const [videos, setVideos] = useState<HeroVideo[] | null>(null);
  const [busy, setBusy] = useState<{ variant: VideoVariant; progress: number } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchSection("hero-videos")
      .then((next) => { if (!cancelled) setVideos(next); })
      .catch(() => {
        if (cancelled) return;
        setVideos(sectionDefaults["hero-videos"]);
        setError("Kayıtlı videolar okunamadı, varsayılanlar gösteriliyor.");
      });
    return () => { cancelled = true; };
  }, []);

  const persist = async (next: HeroVideo[]) => {
    await saveSection("hero-videos", next);
    setVideos(next);
    await revalidateSite(["/"]);
  };

  const upload = async (variant: VideoVariant, file: File | undefined) => {
    if (!file || !videos) return;
    setError("");
    if (!/^video\/(mp4|webm)$/.test(file.type)) return setError("Yalnızca MP4 veya WebM video yüklenebilir.");
    if (file.size >= MAX_BYTES) return setError("Video 100 MB'dan küçük olmalı.");

    setBusy({ variant, progress: 0 });
    try {
      const src = await uploadVideo(file, (progress) => setBusy({ variant, progress }));
      await persist([
        ...videos,
        // Storage yolu zaman damgası içerdiği için URL kalıcı ve benzersiz bir anahtardır.
        { key: src, variant, name: file.name, sources: [{ src, type: file.type }] },
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Video yüklenemedi.");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (video: HeroVideo) => {
    if (!videos || !window.confirm(`"${video.name}" silinsin mi?`)) return;
    setError("");
    setDeleting(video.key);
    try {
      await persist(videos.filter((item) => item.key !== video.key));
      // Liste güncellendikten sonra dosya temizlenir; silme başarısız olsa
      // bile video sitede artık oynamaz.
      await Promise.all(video.sources.map((source) => deleteUploadedFile(source.src).catch(() => undefined)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Video silinemedi.");
    } finally {
      setDeleting(null);
    }
  };

  if (!videos) {
    return <p className="flex items-center gap-2 py-10 text-sm text-white/45"><Loader2 size={15} className="animate-spin" /> Yükleniyor...</p>;
  }

  return (
    <div>
      <p className="mb-6 max-w-2xl text-xs leading-6 text-white/45">
        Ana sayfanın giriş bölümünde oynayan videolar. Ziyaretçi siteye girdiğinde cihazına uygun listeden rastgele
        bir video oynar; sayfayı yenilese de sekmeyi kapatana kadar aynı video kalır. Yalnızca seçilen video indirilir.
        Yükleme ve silme anında yayına alınır. Bir listede hiç video yoksa o cihazlarda yalnızca kapak görseli görünür.
      </p>

      {error && <p role="alert" className="mb-5 border border-red-300/25 bg-red-300/10 px-5 py-4 text-sm text-red-200">{error}</p>}

      <div className="grid gap-6 xl:grid-cols-2">
        {columns.map((column) => (
          <VideoColumn
            key={column.variant}
            {...column}
            videos={videos.filter((video) => video.variant === column.variant)}
            progress={busy?.variant === column.variant ? busy.progress : null}
            disabled={busy !== null || deleting !== null}
            deleting={deleting}
            onUpload={(file) => void upload(column.variant, file)}
            onRemove={(video) => void remove(video)}
          />
        ))}
      </div>
    </div>
  );
}

function VideoColumn({
  label,
  hint,
  icon: Icon,
  videos,
  progress,
  disabled,
  deleting,
  onUpload,
  onRemove,
}: {
  label: string;
  hint: string;
  icon: typeof Smartphone;
  videos: HeroVideo[];
  progress: number | null;
  disabled: boolean;
  deleting: string | null;
  onUpload: (file: File | undefined) => void;
  onRemove: (video: HeroVideo) => void;
}) {
  const inputId = useId();

  return (
    <section className="border border-white/10 bg-[#202320] p-5 sm:p-7">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold"><Icon size={17} className="text-[#d8b792]" /> {label}</h3>
          <p className="mt-1 text-[11px] text-white/40">{hint}</p>
        </div>
        <label htmlFor={inputId} className={`${buttonClass} ${disabled ? "pointer-events-none opacity-45" : "cursor-pointer"}`}>
          {progress !== null ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {progress !== null ? `Yükleniyor %${Math.round(progress * 100)}` : "Video yükle"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="video/mp4,video/webm"
          disabled={disabled}
          className="sr-only"
          onChange={(event) => { onUpload(event.target.files?.[0]); event.target.value = ""; }}
        />
      </header>

      {videos.length === 0 ? (
        <p className="py-8 text-center text-xs text-white/35">Video yok — bu cihazlarda yalnızca kapak görseli görünür.</p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {videos.map((video) => (
            <li key={video.key} className="border border-white/10 bg-[#181a18]">
              <video
                muted
                loop
                playsInline
                controls
                preload="metadata"
                className="aspect-video w-full bg-black object-contain"
              >
                {video.sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
              </video>
              <div className="flex items-center justify-between gap-3 p-3">
                <span className="min-w-0 truncate text-xs text-white/70" title={video.name}>{video.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(video)}
                  disabled={disabled}
                  aria-label={`${video.name} videosunu sil`}
                  className="shrink-0 border border-white/15 p-2 text-red-300 transition hover:bg-[#292c29] disabled:opacity-30"
                >
                  {deleting === video.key ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

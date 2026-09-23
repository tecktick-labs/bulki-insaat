const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "elysprime.firebasestorage.app";
const ROOT = "media";

/** Firebase Storage'ın public download URL formatı. Obje `alt=media` ile token'sız okunur. */
function storageUrl(path: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(`${ROOT}/${path}`)}?alt=media`;
}

export function getBuildImage(index: number) {
  return storageUrl(`build-images/alys${index}.webp`);
}

export function getFloorPlan(file: string) {
  return storageUrl(`floor-types/${file}.webp`);
}

export type VideoVariant = "mobile" | "desktop";
export type VideoSource = { src: string; type: string };

/**
 * Hero'da oynayan tanıtım videosu. Mobil ve masaüstü için ayrı havuzlar
 * tutulur; tek kaynak panelin "Hero Videoları" bölümüdür
 * (Firestore `sections/hero-videos`, dosyalar Storage `videos/`). Tarayıcı
 * `sources` içinde oynatabildiği ilk kaynağı seçer. Video her zaman sessiz oynatılır.
 */
export type HeroVideo = {
  /** Kalıcı kimlik — oturumdaki seçim bununla hatırlanır. */
  key: string;
  variant: VideoVariant;
  name: string;
  sources: VideoSource[];
};

/**
 * Havuzdan rastgele bir video seçer. Seçim sessionStorage'da tutulur: aynı
 * sekmede sayfa yenilense de aynı video gelir, tarayıcı/sekme kapatılıp
 * yeniden girilince yeni bir rastgele seçim yapılır. Hatırlanan video
 * panelden silinmişse yeniden seçilir. Yalnızca tarayıcıda çağrılmalıdır.
 */
export function pickHeroVideo(videos: HeroVideo[], variant: VideoVariant): HeroVideo | null {
  const pool = videos.filter((video) => video.variant === variant && video.sources.length > 0);
  if (pool.length === 0) return null;

  const storageKey = `hero-video:${variant}`;
  // Gizli sekme vb. durumlarda depolama erişilemez; o zaman her girişte rastgele seçilir.
  let savedKey: string | null = null;
  try {
    savedKey = sessionStorage.getItem(storageKey);
  } catch {
    savedKey = null;
  }

  const saved = pool.find((video) => video.key === savedKey);
  if (saved) return saved;

  const picked = pool[Math.floor(Math.random() * pool.length)];
  try {
    sessionStorage.setItem(storageKey, picked.key);
  } catch {
    // Kalıcı yapılamasa da seçilen video bu açılışta oynar.
  }
  return picked;
}

export const BUILD_IMAGE_COUNT = 10;

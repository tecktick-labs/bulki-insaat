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

/**
 * Tanıtım videosu iki boyutta servis edilir:
 *   mobil     640x360, ~3 MB   — hücresel bağlantıda LCP'yi bozmaz
 *   masaüstü  1280x720, ~15 MB — tam kalite
 *
 * Her boyutta önce WebM (daha küçük), ardından WebM desteklemeyen Safari
 * sürümleri için H.264 MP4 verilir. Tarayıcı oynatabildiği ilk kaynağı seçer.
 * Kaynak videoda ses akışı yoktur; tüm sürümler sessizdir.
 *
 * Yeni sürüm üretmek için: npm run transcode-video
 */
export function getPromotionVideos(variant: "mobile" | "desktop" = "desktop") {
  const name = variant === "mobile" ? "tanitim-mobile" : "tanitim";
  return [
    { src: storageUrl(`videos/${name}.webm`), type: "video/webm" },
    { src: storageUrl(`videos/${name}.mp4`), type: "video/mp4" },
  ];
}

export const BUILD_IMAGE_COUNT = 10;

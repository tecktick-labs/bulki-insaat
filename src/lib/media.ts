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
 * Tanıtım videosu iki sürümde servis edilir:
 *   mobil     480x848 dikey, ~1.6 MB H.264 MP4 — telefon ekranına göre çekilmiş,
 *             hücresel bağlantıda LCP'yi bozmaz
 *   masaüstü  1280x720, ~15 MB — tam kalite; önce WebM (daha küçük), ardından
 *             WebM desteklemeyen Safari sürümleri için H.264 MP4
 *
 * Tarayıcı oynatabildiği ilk kaynağı seçer. Video her zaman sessiz oynatılır.
 *
 * Masaüstü sürümünü yeniden üretmek için: npm run transcode-video
 */
export function getPromotionVideos(variant: "mobile" | "desktop" = "desktop") {
  if (variant === "mobile") return [{ src: storageUrl("videos/mobil-bulki.mp4"), type: "video/mp4" }];
  return [
    { src: storageUrl("videos/tanitim.webm"), type: "video/webm" },
    { src: storageUrl("videos/tanitim.mp4"), type: "video/mp4" },
  ];
}

export const BUILD_IMAGE_COUNT = 10;

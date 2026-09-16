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
 * Elimizde yalnızca WebM var. Safari'nin WebM desteklemediği sürümlerde
 * video sessizce atlanır ve poster görseli görünür — kayıp yok.
 * Kapsamı genişletmek için bir H.264 MP4 üretip Storage'a `videos/tanitim.mp4`
 * olarak yükleyin ve buraya ilk sıraya ekleyin.
 */
export function getPromotionVideos() {
  return [{ src: storageUrl("videos/tanitim.webm"), type: "video/webm" }];
}

export const BUILD_IMAGE_COUNT = 10;

const buildMedia = import.meta.glob<string>(
  "../assets/build-images/*.webp",
  { eager: true, query: "?url", import: "default" },
);

const floorMedia = import.meta.glob<string>(
  "../assets/floor-types/*.webp",
  { eager: true, query: "?url", import: "default" },
);

const videoMedia = import.meta.glob<string>(
  "../assets/videos/*.webm",
  { eager: true, query: "?url", import: "default" },
);

const imagePriority = [".webp"];

function pickByName(collection: Record<string, string>, name: string, priorities: string[]) {
  for (const extension of priorities) {
    const match = Object.entries(collection).find(([path]) => path.endsWith(`/${name}${extension}`));
    if (match) return match[1];
  }
  throw new Error(`Medya dosyası bulunamadı: ${name}`);
}

export function getBuildImage(index: number) {
  return pickByName(buildMedia, `alys${index}`, imagePriority);
}

export function getFloorPlan(name: string) {
  return pickByName(floorMedia, name, imagePriority);
}

export function getPromotionVideos() {
  const result: { src: string; type: string }[] = [];
  const webm = Object.entries(videoMedia).find(([path]) => path.endsWith("/tanitim.webm"));
  if (webm) result.push({ src: webm[1], type: "video/webm" });
  return result;
}

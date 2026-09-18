import { getFloorPlan } from "./media";

export type Plan = {
  /** URL slug — /daire-planlari/[slug]. Yapısaldır: rota ve sitemap buna bağlı, panelden değişmez. */
  slug: string;
  /** Plan çiziminin tam görsel URL'i — panelden yüklenebilir ya da değiştirilebilir. */
  image: string;
  /** Görselin alternatif metni. Boşsa plan başlığından türetilir. */
  imageAlt: string;
  block: BlockName;
  floor: FloorType;
  position: PositionType;
  /**
   * Daire planlarındaki alt kategori filtresi.
   *
   * DİKKAT: Bu eşleştirme plan şemalarından türetilen bir varsayımdır
   * (orta tip 2+1, köşe tip 3+1, dubleksler ayrı kategori). Onaylı proje
   * dosyasıyla teyit edilmeden yayına alınmamalıdır.
   */
  rooms: RoomType;
};

export const blockNames = ["A", "B", "C", "D"] as const;
export type BlockName = (typeof blockNames)[number];

/** Kat tipleri. `copy.planTypes` anahtarları `${floor}|${position}` olduğu için bu liste sabit kalmalı. */
export const floorTypes = ["Normal Kat", "Çatı Katı", "Dubleks"] as const;
export type FloorType = (typeof floorTypes)[number];

export const positionTypes = ["Köşe Tip", "Orta Tip"] as const;
export type PositionType = (typeof positionTypes)[number];

export const roomTypes = ["2+1", "3+1", "Dubleks"] as const;
export type RoomType = (typeof roomTypes)[number];

/** Storage'daki plan çizimi — koddaki varsayılan görseller bu dosyalardan gelir. */
const plan = (
  slug: string,
  file: string,
  block: BlockName,
  floor: FloorType,
  position: PositionType,
  rooms: RoomType,
): Plan => ({ slug, image: getFloorPlan(file), imageAlt: "", block, floor, position, rooms });

export const plans: Plan[] = [
  plan("a-blok-normal-kat-kose", "a-blok-normal-kat-kose-tip", "A", "Normal Kat", "Köşe Tip", "3+1"),
  plan("a-blok-normal-kat-orta", "a-blok-normal-kat-orta-tip", "A", "Normal Kat", "Orta Tip", "2+1"),
  plan("a-blok-cati-kati-kose", "a-blok-cati-kat-kose-tip", "A", "Çatı Katı", "Köşe Tip", "3+1"),
  plan("a-blok-cati-kati-orta", "a-blok-cati-kat-orta-tip", "A", "Çatı Katı", "Orta Tip", "2+1"),
  plan("b-blok-normal-kat-kose", "b-blok-normal-kat-kose-tip", "B", "Normal Kat", "Köşe Tip", "3+1"),
  plan("b-blok-normal-kat-orta", "b-blok-normal-kat-orta-tip", "B", "Normal Kat", "Orta Tip", "2+1"),
  plan("b-blok-dubleks-kose", "b-blok-dubleks-kose-tip", "B", "Dubleks", "Köşe Tip", "Dubleks"),
  plan("b-blok-dubleks-orta", "b-blok-dubleks-orta-tip", "B", "Dubleks", "Orta Tip", "Dubleks"),
  plan("c-blok-normal-kat-kose", "c-blok-normal-kat-kose-tip", "C", "Normal Kat", "Köşe Tip", "3+1"),
  plan("c-blok-normal-kat-orta", "c-blok-normal-kat-orta-tip", "C", "Normal Kat", "Orta Tip", "2+1"),
  plan("c-blok-cati-kati-kose", "c-blok-cati-kat-kose-tip", "C", "Çatı Katı", "Köşe Tip", "3+1"),
  plan("c-blok-cati-kati-orta", "c-blok-cati-kat-orta-tip", "C", "Çatı Katı", "Orta Tip", "2+1"),
  plan("d-blok-normal-kat-kose", "d-blok-normal-kat-kose-tip", "D", "Normal Kat", "Köşe Tip", "3+1"),
  plan("d-blok-normal-kat-orta", "d-blok-normal-kat-orta-tip", "D", "Normal Kat", "Orta Tip", "2+1"),
  plan("d-blok-dubleks-kose", "d-blok-dubleks-kat-kose-tip", "D", "Dubleks", "Köşe Tip", "Dubleks"),
  plan("d-blok-dubleks-orta", "d-blok-dubleks-orta-tip", "D", "Dubleks", "Orta Tip", "Dubleks"),
];

export function planTitle(plan: Plan) {
  return `${plan.block} Blok ${plan.floor} ${plan.position}`;
}

export function planImage(plan: Plan) {
  return plan.image;
}

/** Panelden alternatif metin girilmediyse başlıktan türetilen erişilebilir metin. */
export function planImageAlt(plan: Plan) {
  return plan.imageAlt.trim() || `${planTitle(plan)} daire planı`;
}

import floorTypes_ from "../data/floor-types.json";
import { getFloorPlan } from "./media";

/** Plandaki tek bir mekân — oda, antre, ıslak hacim ya da balkon/teras. */
export type PlanRoom = {
  /** Plan çiziminde yazan ad: "Salon", "Mutfak", "Ebeveyn Banyosu"… */
  name: string;
  /** Net metrekare. Plan üzerinde ölçü yazmıyorsa null. */
  area: number | null;
  /** Dubleks planlarda kat: "Giriş Katı" / "Üst Kat". Tek katlı planlarda boş. */
  level: string;
  /** Balkon ve teras gibi dış mekânlar net alana katılmaz. */
  outdoor: boolean;
};

/**
 * Dairenin alan künyesi.
 *
 * `netArea` plan üzerindeki kapalı mekânların toplamıdır. `grossArea` (brüt)
 * plan çizimlerinde yer almadığı için varsayılanı null'dur; onaylı proje
 * dosyasından öğrenildiğinde panelden girilir.
 */
export type PlanAreas = {
  netArea: number | null;
  grossArea: number | null;
  balconyArea: number | null;
  terraceArea: number | null;
};

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
   * Bu değerler plan çizimlerindeki oda sayımından okunmuştur; onaylı proje
   * dosyasıyla teyit edilmeden yayına alınmamalıdır.
   */
  rooms: RoomType;
  /** Serbest metin açıklama: "3+1 (3 oda + 1 salon)", "4+2 Dubleks"… */
  roomLayout: string;
  /** Sayfa başlığı (H1). Boşsa blok/kat/konumdan türetilir. */
  title: string;
  /** Başlığın altındaki giriş cümlesi. */
  lead: string;
  /** Arama sonucundaki başlık. Boşsa `title` kullanılır. */
  seoTitle: string;
  /** Arama sonucundaki açıklama. */
  seoDescription: string;
  /** Künye çipleri: "A Blok", "3+1 daire tipi", "Köşe konum"… */
  features: string[];
  /** Sayfa gövdesindeki paragraflar. */
  description: string[];
  areas: PlanAreas;
  /** Oda oda ölçüler — plan çizimindeki etiketlerin karşılığı. */
  roomList: PlanRoom[];
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

/** Dubleks planlarda kullanılan kat adları — panelde seçim kutusu olarak sunulur. */
export const roomLevels = ["", "Giriş Katı", "Üst Kat"] as const;

/**
 * `src/data/floor-types.json` — 16 daire tipinin plan çizimlerinden okunmuş künyesi.
 *
 * Bu dosya varsayılan kaynaktır: Firestore boşsa ya da okunamazsa site bu
 * değerlerle çalışır. Panelden yapılan düzeltmeler `sections/plan-rooms`
 * dokümanında saklanır ve `applyPlanOverrides` ile bunun üzerine uygulanır.
 */
type RawPlan = {
  slug: string;
  file: string;
  block: string;
  floor: string;
  position: string;
  rooms: string;
  roomLayout: string;
  title: string;
  lead: string;
  seoTitle: string;
  seoDescription: string;
  features: string[];
  description: string[];
  areas: { netArea: number | null; grossArea: number | null; balconyArea: number | null; terraceArea: number | null };
  roomList: { label: string; name: string; area: number | null; level: string | null }[];
};

const rawPlans = (floorTypes_ as { plans: RawPlan[] }).plans;

/** Balkon ve teras dış mekândır; net alana katılmaz. */
const outdoorLabels = ["BALKON", "TERAS"];

export const plans: Plan[] = rawPlans.map((raw) => ({
  slug: raw.slug,
  image: getFloorPlan(raw.file),
  imageAlt: "",
  block: raw.block as BlockName,
  floor: raw.floor as FloorType,
  position: raw.position as PositionType,
  rooms: raw.rooms as RoomType,
  roomLayout: raw.roomLayout,
  title: raw.title,
  lead: raw.lead,
  seoTitle: raw.seoTitle,
  seoDescription: raw.seoDescription,
  features: raw.features,
  description: raw.description,
  areas: {
    netArea: raw.areas.netArea,
    grossArea: raw.areas.grossArea,
    balconyArea: raw.areas.balconyArea,
    terraceArea: raw.areas.terraceArea,
  },
  roomList: raw.roomList.map((room) => ({
    name: room.name,
    area: room.area,
    level: room.level ?? "",
    outdoor: outdoorLabels.includes(room.label),
  })),
}));

/** Breadcrumb ve gezinme bağlantılarında kullanılan kısa ad — panelden değişmez. */
export function planTitle(plan: Plan) {
  return `${plan.block} Blok ${plan.floor} ${plan.position}`;
}

/** Sayfa başlığı (H1). Panelde boş bırakılmışsa kısa addan türetilir. */
export function planHeading(plan: Plan) {
  return plan.title.trim() || `${planTitle(plan)} Daire Planı`;
}

export function planImage(plan: Plan) {
  return plan.image;
}

/** Panelden alternatif metin girilmediyse başlıktan türetilen erişilebilir metin. */
export function planImageAlt(plan: Plan) {
  return plan.imageAlt.trim() || `${planTitle(plan)} daire planı`;
}

/** Kapalı mekânların (balkon ve teras hariç) plan üzerindeki toplamı. */
export function planIndoorArea(plan: Plan) {
  return roundArea(plan.roomList.filter((room) => !room.outdoor).reduce((total, room) => total + (room.area ?? 0), 0));
}

/** Balkon ve terasların toplamı. */
export function planOutdoorArea(plan: Plan) {
  return roundArea(plan.roomList.filter((room) => room.outdoor).reduce((total, room) => total + (room.area ?? 0), 0));
}

/** Dubleks planlarda kat kat net alan; tek katlı planlarda boş dizi. */
export function planFloorAreas(plan: Plan) {
  const levels = [...new Set(plan.roomList.map((room) => room.level).filter(Boolean))];
  if (levels.length < 2) return [];

  return levels.map((level) => ({
    level,
    area: roundArea(
      plan.roomList
        .filter((room) => room.level === level && !room.outdoor)
        .reduce((total, room) => total + (room.area ?? 0), 0),
    ),
  }));
}

/** Kayan nokta artıklarını temizler: 0.1 + 0.2 → 0.3. */
function roundArea(value: number) {
  return Math.round(value * 100) / 100;
}

/** "25,08 m²" — Türkçe ondalık ayracıyla. */
export function formatArea(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "";
  return `${value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`;
}

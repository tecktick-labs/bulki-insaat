import { campaigns as defaultCampaigns, type Campaign } from "./campaigns";
import { projectDocuments as defaultDocuments, type ProjectDocument } from "./documents";
import { getBuildImage } from "./media";
import {
  blockNames,
  floorTypes,
  plans,
  positionTypes,
  roomTypes,
  type Plan,
  type PlanAreas,
  type PlanRoom,
} from "./plans";

/**
 * Panelden yönetilen site bölümleri.
 *
 * Her bölüm Firestore'da kendi dokümanında durur (`sections/{id}`), böylece
 * kampanyaları düzenlemek galeriyi kilitlemez. Koddaki diziler varsayılan
 * kaynak olarak kalır: Firestore boşsa ya da okunamazsa site onlarla çalışır.
 */

export type GallerySlide = {
  key: string;
  /** Tam görsel URL'i — Storage'daki proje görseli ya da panelden yüklenen dosya. */
  image: string;
  title: string;
  note: string;
};

/**
 * Panelden düzenlenen daire tipi kaydı. `slug` yapısaldır (rota ve sitemap ona bağlı),
 * geri kalan alanların hepsi panelden değiştirilebilir.
 *
 * Firestore'da eskiden yalnızca `{ slug, rooms }` duruyordu; bu yüzden tip
 * `Partial` gibi ele alınır ve eksik alanlar koddaki varsayılandan tamamlanır.
 */
export type PlanOverride = Plan;

export type SectionData = {
  campaigns: Campaign[];
  gallery: GallerySlide[];
  documents: ProjectDocument[];
  "plan-rooms": PlanOverride[];
};

export type SectionId = keyof SectionData;

export const sectionIds = ["campaigns", "gallery", "documents", "plan-rooms"] as const;

export const sectionLabels: Record<SectionId, string> = {
  campaigns: "Kampanyalar",
  gallery: "Galeri",
  documents: "Belgeler",
  "plan-rooms": "Daire Tipleri",
};

const defaultGallery: GallerySlide[] = [
  { key: "ic-bahce", image: getBuildImage(1), title: "Peyzajla bütünleşen yaşam", note: "İç Bahçe" },
  { key: "sosyal", image: getBuildImage(2), title: "Her mevsim nefes alan avlular", note: "Sosyal Yaşam" },
  { key: "mimari", image: getBuildImage(3), title: "Modern çizgiler, sıcak dokular", note: "Mimari" },
  { key: "cephe", image: getBuildImage(4), title: "Günün her saatinde sakin", note: "Cephe" },
  { key: "peyzaj", image: getBuildImage(5), title: "Aileler için güvenli alanlar", note: "Peyzaj" },
  { key: "spor", image: getBuildImage(6), title: "Hareket yaşamın içinde", note: "Spor Alanı" },
  { key: "genel", image: getBuildImage(7), title: "Dengeli ve çağdaş bir silüet", note: "Genel Görünüm" },
  { key: "detay", image: getBuildImage(8), title: "Detaylarda seçkin bir yaklaşım", note: "Mimari Detay" },
  { key: "gece", image: getBuildImage(9), title: "Akşamları başka bir atmosfer", note: "Gece Görünümü" },
  { key: "giris", image: getBuildImage(10), title: "Elys Prime'a hoş geldiniz", note: "Giriş" },
];

export const sectionDefaults: SectionData = {
  campaigns: defaultCampaigns,
  gallery: defaultGallery,
  documents: defaultDocuments,
  "plan-rooms": plans,
};

/** Firestore'dan gelen `{ items: [...] }` dokümanını doğrular; boş/bozuksa varsayılana düşer. */
export function mergeSection<Id extends SectionId>(
  id: Id,
  stored: { items?: unknown } | null | undefined,
): SectionData[Id] {
  const items = stored?.items;
  if (!Array.isArray(items) || items.length === 0) return sectionDefaults[id];

  // Daire tipleri kodda sabit bir listedir; kayıtlı belgedeki eksik alanlar
  // varsayılandan tamamlanır. Böylece hem site hem panel her zaman tam kayıt görür.
  if (id === "plan-rooms") return applyPlanOverrides(items as PlanOverride[]) as SectionData[Id];

  return items as SectionData[Id];
}

export function emptyCampaign(): Campaign {
  return {
    slug: "",
    label: "",
    hint: "",
    title: "",
    lead: "",
    seoTitle: "",
    seoDescription: "",
    poster: "",
    posterAlt: "",
    badge: "",
    paragraphs: [""],
    highlights: [{ label: "", value: "" }],
  };
}

export function emptyGallerySlide(): GallerySlide {
  return { key: "", image: "", title: "", note: "" };
}

export function emptyDocument(): ProjectDocument {
  return { slug: "", title: "", description: "", file: "" };
}

/** Seçim listesi dışına düşen bir değer Firestore'dan gelirse varsayılana dönülür. */
function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** Boş bırakılan metin alanı koddaki varsayılana döner — böylece panel hiçbir zaman boş görünmez. */
function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

/**
 * Metin listesi. Panelden tümü silinmişse boş dizi olarak korunur; alan hiç
 * yoksa (eski kayıtlar) varsayılana düşülür. Boş satırlar ayıklanır.
 */
function textList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "").map((item) => item.trim());
}

/** Metrekare alanı: sayı değilse ya da negatifse "bilinmiyor" anlamında null. */
function area(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function mergeAreas(value: unknown, fallback: PlanAreas): PlanAreas {
  if (!value || typeof value !== "object") return fallback;
  const stored = value as Partial<Record<keyof PlanAreas, unknown>>;

  return {
    netArea: "netArea" in stored ? area(stored.netArea) : fallback.netArea,
    grossArea: "grossArea" in stored ? area(stored.grossArea) : fallback.grossArea,
    balconyArea: "balconyArea" in stored ? area(stored.balconyArea) : fallback.balconyArea,
    terraceArea: "terraceArea" in stored ? area(stored.terraceArea) : fallback.terraceArea,
  };
}

function mergeRoomList(value: unknown, fallback: PlanRoom[]): PlanRoom[] {
  if (!Array.isArray(value)) return fallback;

  return value
    .filter((room): room is Record<string, unknown> => Boolean(room) && typeof room === "object")
    .map((room) => ({
      name: typeof room.name === "string" ? room.name.trim() : "",
      area: area(room.area),
      level: typeof room.level === "string" ? room.level.trim() : "",
      outdoor: room.outdoor === true,
    }))
    .filter((room) => room.name !== "");
}

/**
 * Koddaki plan listesine Firestore'daki düzeltmeleri uygular.
 *
 * Plan listesi ve slug'lar kodda kalır; panel yalnızca var olan kayıtları düzeltir.
 * Eksik ya da boş alanlar koddaki varsayılana düşer, böylece eski `{ slug, rooms }`
 * kayıtları da sorunsuz okunur.
 */
export function applyPlanOverrides(overrides: PlanOverride[]): Plan[] {
  const bySlug = new Map(overrides.map((override) => [override.slug, override as Partial<PlanOverride>]));

  return plans.map((plan) => {
    const override = bySlug.get(plan.slug);
    if (!override) return plan;

    return {
      ...plan,
      image: text(override.image, plan.image),
      imageAlt: typeof override.imageAlt === "string" ? override.imageAlt : plan.imageAlt,
      block: oneOf(override.block, blockNames, plan.block),
      floor: oneOf(override.floor, floorTypes, plan.floor),
      position: oneOf(override.position, positionTypes, plan.position),
      rooms: oneOf(override.rooms, roomTypes, plan.rooms),
      roomLayout: text(override.roomLayout, plan.roomLayout),
      title: text(override.title, plan.title),
      lead: text(override.lead, plan.lead),
      seoTitle: text(override.seoTitle, plan.seoTitle),
      seoDescription: text(override.seoDescription, plan.seoDescription),
      features: textList(override.features, plan.features),
      description: textList(override.description, plan.description),
      areas: mergeAreas(override.areas, plan.areas),
      roomList: mergeRoomList(override.roomList, plan.roomList),
    };
  });
}

export function emptyPlanRoom(): PlanRoom {
  return { name: "", area: null, level: "", outdoor: false };
}

/** Bir blokta fiilen bulunan oda tipleri — filtre çipleri boş seçenek göstermesin diye. */
export function roomTypesForBlock(resolved: Plan[], block: Plan["block"]) {
  return roomTypes.filter((room) => resolved.some((plan) => plan.block === block && plan.rooms === room));
}

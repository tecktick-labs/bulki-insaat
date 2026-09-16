import { campaigns as defaultCampaigns, type Campaign } from "./campaigns";
import { projectDocuments as defaultDocuments, type ProjectDocument } from "./documents";
import { getBuildImage } from "./media";
import { plans, roomTypes, type Plan, type RoomType } from "./plans";

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

/** Plan başına oda tipi. Blok/kat/konum yapısaldır ve kodda kalır; yalnızca oda sayısı düzenlenir. */
export type PlanRooms = { slug: string; rooms: RoomType };

export type SectionData = {
  campaigns: Campaign[];
  gallery: GallerySlide[];
  documents: ProjectDocument[];
  "plan-rooms": PlanRooms[];
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
  "plan-rooms": plans.map((plan) => ({ slug: plan.slug, rooms: plan.rooms })),
};

/** Firestore'dan gelen `{ items: [...] }` dokümanını doğrular; boş/bozuksa varsayılana düşer. */
export function mergeSection<Id extends SectionId>(
  id: Id,
  stored: { items?: unknown } | null | undefined,
): SectionData[Id] {
  const items = stored?.items;
  if (!Array.isArray(items) || items.length === 0) return sectionDefaults[id];
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

/** Koddaki plan yapısına Firestore'dan gelen oda tiplerini uygular. */
export function applyPlanRooms(overrides: PlanRooms[]): Plan[] {
  const byslug = new Map(overrides.map((override) => [override.slug, override.rooms]));
  return plans.map((plan) => ({ ...plan, rooms: byslug.get(plan.slug) ?? plan.rooms }));
}

/** Bir blokta fiilen bulunan oda tipleri — filtre çipleri boş seçenek göstermesin diye. */
export function roomTypesForBlock(resolved: Plan[], block: Plan["block"]) {
  return roomTypes.filter((room) => resolved.some((plan) => plan.block === block && plan.rooms === room));
}

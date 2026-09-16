import { getFloorPlan } from "./media";

export type Plan = {
  /** URL slug — /daire-planlari/[slug] */
  slug: string;
  /** Storage'daki dosya adı (uzantısız) */
  file: string;
  block: "A" | "B" | "C" | "D";
  floor: string;
  position: string;
};

export const plans: Plan[] = [
  { slug: "a-blok-normal-kat-kose", file: "a-blok-normal-kat-kose-tip", block: "A", floor: "Normal Kat", position: "Köşe Tip" },
  { slug: "a-blok-normal-kat-orta", file: "a-blok-normal-kat-orta-tip", block: "A", floor: "Normal Kat", position: "Orta Tip" },
  { slug: "a-blok-cati-kati-kose", file: "a-blok-cati-kat-kose-tip", block: "A", floor: "Çatı Katı", position: "Köşe Tip" },
  { slug: "a-blok-cati-kati-orta", file: "a-blok-cati-kat-orta-tip", block: "A", floor: "Çatı Katı", position: "Orta Tip" },
  { slug: "b-blok-normal-kat-kose", file: "b-blok-normal-kat-kose-tip", block: "B", floor: "Normal Kat", position: "Köşe Tip" },
  { slug: "b-blok-normal-kat-orta", file: "b-blok-normal-kat-orta-tip", block: "B", floor: "Normal Kat", position: "Orta Tip" },
  { slug: "b-blok-dubleks-kose", file: "b-blok-dubleks-kose-tip", block: "B", floor: "Dubleks", position: "Köşe Tip" },
  { slug: "b-blok-dubleks-orta", file: "b-blok-dubleks-orta-tip", block: "B", floor: "Dubleks", position: "Orta Tip" },
  { slug: "c-blok-normal-kat-kose", file: "c-blok-normal-kat-kose-tip", block: "C", floor: "Normal Kat", position: "Köşe Tip" },
  { slug: "c-blok-normal-kat-orta", file: "c-blok-normal-kat-orta-tip", block: "C", floor: "Normal Kat", position: "Orta Tip" },
  { slug: "c-blok-cati-kati-kose", file: "c-blok-cati-kat-kose-tip", block: "C", floor: "Çatı Katı", position: "Köşe Tip" },
  { slug: "c-blok-cati-kati-orta", file: "c-blok-cati-kat-orta-tip", block: "C", floor: "Çatı Katı", position: "Orta Tip" },
  { slug: "d-blok-normal-kat-kose", file: "d-blok-normal-kat-kose-tip", block: "D", floor: "Normal Kat", position: "Köşe Tip" },
  { slug: "d-blok-normal-kat-orta", file: "d-blok-normal-kat-orta-tip", block: "D", floor: "Normal Kat", position: "Orta Tip" },
  { slug: "d-blok-dubleks-kose", file: "d-blok-dubleks-kat-kose-tip", block: "D", floor: "Dubleks", position: "Köşe Tip" },
  { slug: "d-blok-dubleks-orta", file: "d-blok-dubleks-orta-tip", block: "D", floor: "Dubleks", position: "Orta Tip" },
];

export const blockNames = ["A", "B", "C", "D"] as const;

export function planTitle(plan: Plan) {
  return `${plan.block} Blok ${plan.floor} ${plan.position}`;
}

export function planImage(plan: Plan) {
  return getFloorPlan(plan.file);
}

export function findPlan(slug: string) {
  return plans.find((plan) => plan.slug === slug);
}

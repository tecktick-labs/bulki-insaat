import routes from "@/data/plan-routes.json";

// Panel kayıt anahtarı (`slug`) korunur. Yayın adresleri sabittir; paneldeki
// ölçü/metin düzeltmeleri kendiliğinden URL değiştirmez.
export const planRoutes = routes;
export const salesPath = "/sultanbeyli-satilik-daire";
export const salesCategories = [
  { slug: "2-1", rooms: "2+1", name: "2+1 Daireler", title: "Sultanbeyli Satılık 2+1 Daireler", description: "Elys Prime 2+1 daire seçeneklerini karşılaştırın. Balkonlu ve teraslı planları inceleyin; güncel fiyat, ödeme planı ve müsaitlik için satış ekibimizle görüşün." },
  { slug: "3-1", rooms: "3+1", name: "3+1 Daireler", title: "Sultanbeyli Satılık 3+1 Daireler", description: "Elys Prime 3+1 daire seçeneklerini inceleyin. Açık ve kapalı mutfaklı, giyinme odalı planları karşılaştırın; güncel fiyat ve ödeme bilgisi alın." },
  { slug: "dubleks", rooms: "Dubleks", name: "Dubleks Daireler", title: "Sultanbeyli Satılık Dubleks Daireler", description: "Elys Prime teraslı dubleks dairelerin kat planlarını ve oda dağılımlarını inceleyin. Güncel fiyat, ödeme seçenekleri ve müsaitlik için bize ulaşın." },
] as const;

export function planRoute(plan: { slug: string }) {
  const route = planRoutes.find((item) => item.id === plan.slug);
  if (!route) throw new Error(`Daire adresi tanımlanmamış: ${plan.slug}`);
  return route;
}

export function planUrl(plan: { slug: string }) {
  return `/daireler/${planRoute(plan).slug}`;
}

export function planSalesName(plan: { slug: string }) {
  return planRoute(plan).name;
}

export function planCategoryPath(plan: { rooms: string }) {
  const category = salesCategories.find((item) => item.rooms === plan.rooms);
  return category ? `${salesPath}/${category.slug}` : salesPath;
}

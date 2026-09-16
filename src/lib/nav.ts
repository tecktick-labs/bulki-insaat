/**
 * Sitenin tek gezinme kaynağı.
 *
 * `pageNav` alt sayfaların üst menüsü — "Ana Sayfa" her zaman ilk sırada,
 * böylece hangi sayfada olursanız olun köke dönüş bir tık uzakta.
 * `homeSections` ana sayfadaki kaydırmalı bölümlerin sırası; aynı etiketleri
 * kullanır ki iki menü arasında geçerken sıra tanıdık kalsın.
 */

export type NavLink = { href: string; label: string };
export type SectionLink = { id: string; label: string };

export const pageNav: NavLink[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kampanya/lansmana-ozel-30-pesinat", label: "Kampanyalar" },
  { href: "/proje", label: "Proje" },
  { href: "/daire-planlari", label: "Daire Planları" },
  { href: "/konum", label: "Konum" },
  { href: "/tanitimlar", label: "Tanıtımlar" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

/** Ana sayfadaki bölümler — sıra `SiteContent` ile birebir aynı. */
export const homeSections: SectionLink[] = [
  { id: "brosurler", label: "Kampanyalar" },
  { id: "vizyon", label: "Proje" },
  { id: "planlar", label: "Daire Planları" },
  { id: "konum", label: "Konum" },
  { id: "iletisim", label: "İletişim" },
];

/** Ana sayfada gösterilmeyen, yalnızca alt sayfa olarak var olan bölümler. */
export const extraPageLinks: NavLink[] = [
  { href: "/tanitimlar", label: "Tanıtımlar" },
  { href: "/blog", label: "Blog" },
];

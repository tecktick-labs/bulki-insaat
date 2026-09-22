/** Hem sayfa gövdelerinde hem blog/tanıtım içeriklerinde kullanılan ortak blok modeli. */
export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "cta"; text: string; href: string; label: string };

export const blockTypeLabels: Record<ContentBlock["type"], string> = {
  heading: "Ara başlık",
  paragraph: "Paragraf",
  image: "Görsel",
  list: "Madde listesi",
  quote: "Alıntı",
  cta: "Bağlantı kutusu",
};

export function emptyBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "heading": return { type: "heading", text: "" };
    case "image": return { type: "image", url: "", alt: "" };
    case "list": return { type: "list", items: [""] };
    case "quote": return { type: "quote", text: "" };
    case "cta": return { type: "cta", text: "", href: "/", label: "" };
    default: return { type: "paragraph", text: "" };
  }
}

/** Alt sayfaların panelden düzenlenebilir metinleri. */
export type PageCopy = {
  slug: PageSlug;
  /** Panelde listelemek için okunabilir ad */
  label: string;
  title: string;
  lead: string;
  seoTitle: string;
  seoDescription: string;
  blocks: ContentBlock[];
  /** Yalnızca daire-planlari sayfasında: tip ailesi → açıklama paragrafları */
  planTypes?: Record<string, string[]>;
};

export const pageSlugs = ["proje", "daire-planlari", "konum", "iletisim", "blog", "tanitimlar"] as const;
export type PageSlug = (typeof pageSlugs)[number];

/** Yazının sonundaki soru-cevap bölümü. Google'da FAQ zengin sonucu üretir. */
export type FaqItem = { question: string; answer: string };

export type PostType = "blog" | "tanitim";

export const postTypeLabels: Record<PostType, string> = {
  blog: "Blog Yazısı",
  tanitim: "Tanıtım / Broşür",
};

/** Blog yazıları ve tanıtım/broşür sayfaları aynı koleksiyonda, `type` ile ayrışır. */
export type Post = {
  id: string;
  type: PostType;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
  blocks: ContentBlock[];
  /** İsteğe bağlı sık sorulan sorular. Boşsa sayfada bölüm çıkmaz. */
  faq: FaqItem[];
  published: boolean;
  /** ISO 8601 — Firestore Timestamp'ı serileştirmemek için string tutuyoruz. */
  publishedAt: string;
  updatedAt: string;
};

export const postBasePath: Record<PostType, string> = {
  blog: "/blog",
  tanitim: "/tanitimlar",
};

export function postUrl(post: Pick<Post, "type" | "slug">) {
  return `${postBasePath[post.type]}/${post.slug}`;
}

export function emptyPost(type: PostType): Omit<Post, "id"> {
  return {
    type,
    slug: "",
    title: "",
    excerpt: "",
    coverImage: "",
    coverAlt: "",
    seoTitle: "",
    seoDescription: "",
    blocks: [{ type: "paragraph", text: "" }],
    faq: [],
    published: false,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Türkçe karakterleri de kapsayan URL slug üretici. */
export function slugify(value: string) {
  const map: Record<string, string> = { ı: "i", İ: "i", ş: "s", Ş: "s", ğ: "g", Ğ: "g", ü: "u", Ü: "u", ö: "o", Ö: "o", ç: "c", Ç: "c" };
  return value
    .replace(/[ıİşŞğĞüÜöÖçÇ]/g, (char) => map[char] ?? char)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

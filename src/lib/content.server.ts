import "server-only";
import { getAdminFirestore } from "./firebase-admin";
import { defaultPages } from "@/data/copy";
import type { PageCopy, PageSlug, Post, PostType } from "./content-types";

export const PAGES_COLLECTION = "pages";
export const POSTS_COLLECTION = "posts";

/**
 * Sayfa metinleri: Firestore'daki kayıt varsa onu, yoksa src/data/copy.ts
 * varsayılanlarını döndürür. Kısmi kayıtlar varsayılanların üzerine biner,
 * böylece panelde bir alan boş bırakılsa bile sayfa boş kalmaz.
 */
export async function getPageCopy(slug: PageSlug): Promise<PageCopy> {
  const fallback = defaultPages[slug];

  const firestore = await getAdminFirestore();
  if (!firestore) return fallback;

  try {
    const snapshot = await firestore.collection(PAGES_COLLECTION).doc(slug).get();
    if (!snapshot.exists) return fallback;

    const stored = snapshot.data() as Partial<PageCopy>;
    return {
      ...fallback,
      ...stored,
      slug,
      blocks: stored.blocks?.length ? stored.blocks : fallback.blocks,
      planTypes: stored.planTypes ?? fallback.planTypes,
    };
  } catch (error) {
    console.error(`pages/${slug} okunamadı, varsayılan metin kullanılıyor.`, error);
    return fallback;
  }
}

function toPost(id: string, data: FirebaseFirestore.DocumentData): Post {
  const toIso = (value: unknown) => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "toDate" in value) {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }
    return new Date(0).toISOString();
  };

  return {
    id,
    type: data.type === "tanitim" ? "tanitim" : "blog",
    slug: data.slug ?? id,
    title: data.title ?? "",
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? "",
    coverAlt: data.coverAlt ?? "",
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    blocks: Array.isArray(data.blocks) ? data.blocks : [],
    published: data.published === true,
    publishedAt: toIso(data.publishedAt),
    updatedAt: toIso(data.updatedAt),
  };
}

/** Yayındaki içerikler, en yeniden eskiye. */
export async function getPosts(type?: PostType): Promise<Post[]> {
  const firestore = await getAdminFirestore();
  if (!firestore) return [];

  try {
    let query = firestore
      .collection(POSTS_COLLECTION)
      .where("published", "==", true) as FirebaseFirestore.Query;

    if (type) query = query.where("type", "==", type);

    const snapshot = await query.orderBy("publishedAt", "desc").limit(200).get();
    return snapshot.docs.map((doc) => toPost(doc.id, doc.data()));
  } catch (error) {
    console.error("İçerikler okunamadı.", error);
    return [];
  }
}

export async function getPost(type: PostType, slug: string): Promise<Post | null> {
  const firestore = await getAdminFirestore();
  if (!firestore) return null;

  try {
    const snapshot = await firestore
      .collection(POSTS_COLLECTION)
      .where("type", "==", type)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    const doc = snapshot.docs[0];
    if (!doc) return null;

    const post = toPost(doc.id, doc.data());
    return post.published ? post : null;
  } catch (error) {
    console.error(`posts/${type}/${slug} okunamadı.`, error);
    return null;
  }
}

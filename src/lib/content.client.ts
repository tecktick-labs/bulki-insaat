"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { defaultPages } from "@/data/copy";
import { auth, firestore, storage } from "./firebase";
import type { PageCopy, PageSlug, Post, PostType } from "./content-types";

const PAGES = "pages";
const POSTS = "posts";

function toIso(value: unknown) {
  if (typeof value === "string") return value;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

export async function fetchPageCopy(slug: PageSlug): Promise<PageCopy> {
  const fallback = defaultPages[slug];
  const snapshot = await getDoc(doc(firestore, PAGES, slug));
  if (!snapshot.exists()) return fallback;

  const stored = snapshot.data() as Partial<PageCopy>;
  return {
    slug,
    label: fallback.label,
    title: stored.title || fallback.title,
    lead: stored.lead || fallback.lead,
    seoTitle: stored.seoTitle || fallback.seoTitle,
    seoDescription: stored.seoDescription || fallback.seoDescription,
    blocks: stored.blocks?.length ? stored.blocks : fallback.blocks,
    planTypes: stored.planTypes ?? fallback.planTypes,
  };
}

export async function savePageCopy(page: PageCopy) {
  const { slug, label, ...rest } = page;
  await setDoc(doc(firestore, PAGES, slug), { ...rest, label, updatedAt: serverTimestamp() });
}

export async function fetchAllPosts(): Promise<Post[]> {
  const snapshot = await getDocs(query(collection(firestore, POSTS), orderBy("publishedAt", "desc")));
  return snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      type: (data.type === "tanitim" ? "tanitim" : "blog") as PostType,
      slug: data.slug ?? document.id,
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
  });
}

export async function savePost(post: Post) {
  const { id, ...rest } = post;
  await setDoc(doc(firestore, POSTS, id), {
    ...rest,
    publishedAt: Timestamp.fromDate(new Date(rest.publishedAt)),
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string) {
  await deleteDoc(doc(firestore, POSTS, id));
}

/**
 * Panelden seçilen dosyayı Storage'a yükler ve public URL'ini döndürür.
 * Görseller `uploads/`, PDF belgeler `belgeler/` altına gider — Storage
 * kuralları iki klasör için farklı boyut ve tür sınırları uygular.
 */
export async function uploadFile(file: File, folder: "uploads" | "belgeler" = "uploads"): Promise<string> {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const storageRef = ref(storage, `${folder}/${Date.now()}-${safeName}`);
  await uploadBytes(storageRef, file, { cacheControl: "public, max-age=31536000, immutable" });
  return getDownloadURL(storageRef);
}

export const uploadImage = (file: File) => uploadFile(file, "uploads");

/** Kaydettikten sonra ISR sayfalarını tazeler. */
export async function revalidateSite(paths: string[] = []) {
  const token = await auth.currentUser?.getIdToken(true);
  if (!token) throw new Error("Oturum bulunamadı.");

  const response = await fetch("/api/revalidate", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ paths }),
  });

  if (!response.ok) {
    throw new Error("Kaydedildi ancak site önbelleği tazelenemedi.");
  }
}

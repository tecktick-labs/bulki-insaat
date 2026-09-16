"use client";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import {
  CONTENT_DOCUMENT,
  PROJECT_DATA_COLLECTION,
  mergeProjectContent,
  type ProjectContent,
} from "./project-content";

export async function fetchProjectContent(): Promise<ProjectContent> {
  const snapshot = await getDoc(doc(firestore, PROJECT_DATA_COLLECTION, CONTENT_DOCUMENT));
  return mergeProjectContent(snapshot.exists() ? (snapshot.data() as Partial<ProjectContent>) : undefined);
}

/** Panelden kaydeder, ardından ISR sayfalarını tazelemesi için sunucuyu uyarır. */
export async function saveProjectContent(content: ProjectContent) {
  await setDoc(doc(firestore, PROJECT_DATA_COLLECTION, CONTENT_DOCUMENT), {
    ...content,
    updatedAt: serverTimestamp(),
  });

  const token = await auth.currentUser?.getIdToken();
  if (!token) return;

  const response = await fetch("/api/revalidate", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("İçerik kaydedildi ancak site önbelleği tazelenemedi.");
  }
}

"use client";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { revalidateSite } from "./content.client";
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

  await revalidateSite();
}

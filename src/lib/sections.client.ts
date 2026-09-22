"use client";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { stripUndefined } from "./firestore-clean";
import { mergeSection, type SectionData, type SectionId } from "./sections";

const SECTIONS = "sections";

export async function fetchSection<Id extends SectionId>(id: Id): Promise<SectionData[Id]> {
  const snapshot = await getDoc(doc(firestore, SECTIONS, id));
  return mergeSection(id, snapshot.exists() ? (snapshot.data() as { items?: unknown }) : undefined);
}

export async function saveSection<Id extends SectionId>(id: Id, items: SectionData[Id]) {
  await setDoc(doc(firestore, SECTIONS, id), { items: stripUndefined(items), updatedAt: serverTimestamp() });
}

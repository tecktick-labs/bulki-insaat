import "server-only";
import { getAdminFirestore } from "./firebase-admin";
import { mergeSection, sectionDefaults, type SectionData, type SectionId } from "./sections";

export const SECTIONS_COLLECTION = "sections";

/** Sunucu tarafında bölüm okuma. Firestore erişilemezse koddaki varsayılana düşer. */
export async function getSection<Id extends SectionId>(id: Id): Promise<SectionData[Id]> {
  const firestore = await getAdminFirestore();
  if (!firestore) return sectionDefaults[id];

  try {
    const snapshot = await firestore.collection(SECTIONS_COLLECTION).doc(id).get();
    return mergeSection(id, snapshot.exists ? (snapshot.data() as { items?: unknown }) : undefined);
  } catch (error) {
    console.error(`sections/${id} okunamadı, varsayılan kullanılıyor.`, error);
    return sectionDefaults[id];
  }
}

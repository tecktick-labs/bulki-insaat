import "server-only";
import { getAdminFirestore } from "./firebase-admin";
import {
  CONTENT_DOCUMENT,
  PROJECT_DATA_COLLECTION,
  mergeProjectContent,
  projectDefaults,
  type ProjectContent,
} from "./project-content";

/**
 * Sunucu tarafında içerik okuma. Firestore erişilemezse JSON varsayılanlarına düşer,
 * böylece site veritabanı sorunundan dolayı hiç render edilmeden kalmaz.
 */
export async function getProjectContent(): Promise<ProjectContent> {
  const firestore = await getAdminFirestore();
  if (!firestore) return projectDefaults;

  try {
    const snapshot = await firestore
      .collection(PROJECT_DATA_COLLECTION)
      .doc(CONTENT_DOCUMENT)
      .get();

    return mergeProjectContent(snapshot.exists ? (snapshot.data() as Partial<ProjectContent>) : undefined);
  } catch (error) {
    console.error("Firestore'dan proje içeriği okunamadı, varsayılanlar kullanılıyor.", error);
    return projectDefaults;
  }
}

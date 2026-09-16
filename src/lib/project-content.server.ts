import "server-only";
import { adminFirestore } from "./firebase-admin";
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
  try {
    const snapshot = await adminFirestore
      .collection(PROJECT_DATA_COLLECTION)
      .doc(CONTENT_DOCUMENT)
      .get();

    return mergeProjectContent(snapshot.exists ? (snapshot.data() as Partial<ProjectContent>) : undefined);
  } catch (error) {
    console.error("Firestore'dan proje içeriği okunamadı, varsayılanlar kullanılıyor.", error);
    return projectDefaults;
  }
}

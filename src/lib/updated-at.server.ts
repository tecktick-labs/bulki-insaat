import "server-only";
import { getAdminFirestore } from "./firebase-admin";

/** `collection/docId` biçiminde doküman anahtarı. */
export type DocKey = `${string}/${string}`;

/** Firestore Timestamp → Date; eksik ya da bozuk değerlerde undefined. */
function toDate(value: unknown): Date | undefined {
  if (!value || typeof value !== "object" || !("toDate" in value)) return undefined;
  const date = (value as { toDate: () => Date }).toDate();
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Sitemap'in `lastmod` değerleri için doküman güncellenme tarihleri.
 *
 * Hepsi tek bir `getAll` çağrısıyla okunur. Firestore erişilemezse ya da
 * doküman/alan yoksa `undefined` döner ve sitemap o URL için `lastmod`
 * yazmaz: Google yanlış bir `lastmod` yakaladığında bu sinyale güvenmeyi
 * tamamen bırakır, dolayısıyla uydurma tarih vermek hiç vermemekten kötüdür.
 */
export async function getUpdatedAtMap(keys: DocKey[]): Promise<Map<DocKey, Date>> {
  const result = new Map<DocKey, Date>();

  const firestore = await getAdminFirestore();
  if (!firestore) return result;

  try {
    const refs = keys.map((key) => {
      const [collection, id] = key.split("/");
      return firestore.collection(collection).doc(id);
    });

    const snapshots = await firestore.getAll(...refs);
    snapshots.forEach((snapshot, index) => {
      if (!snapshot.exists) return;
      const date = toDate(snapshot.data()?.updatedAt);
      if (date) result.set(keys[index], date);
    });
  } catch (error) {
    console.error("sitemap: güncellenme tarihleri okunamadı, lastmod yazılmayacak.", error);
  }

  return result;
}

/** Verilen kaynaklardan en yenisi; hiçbiri okunamadıysa undefined. */
export function latestOf(dates: Map<DocKey, Date>, ...keys: DocKey[]): Date | undefined {
  const times = keys.map((key) => dates.get(key)?.getTime()).filter((time): time is number => time !== undefined);
  return times.length ? new Date(Math.max(...times)) : undefined;
}

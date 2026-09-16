/**
 * Storage'daki medya dosyalarını yerel `src/assets/` klasörüne indirir.
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=... npm run fetch-media
 *
 * Görseller ve videolar repoda tutulmaz — tek kaynak Firebase Storage'dır.
 * Bu script, videoyu yeniden kodlamak (npm run transcode-video) ya da
 * görselleri elden geçirmek gerektiğinde kaynakları geri getirir.
 */
import { mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cert, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const ROOT = fileURLToPath(new URL("../src/assets", import.meta.url));
const BUCKET = process.env.STORAGE_BUCKET ?? "elysprime.firebasestorage.app";
const PREFIX = "media/";

const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!inline && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Kimlik bilgisi yok. GOOGLE_APPLICATION_CREDENTIALS tanımlayın.");
  process.exit(1);
}

const app = initializeApp({
  ...(inline ? { credential: cert(JSON.parse(inline)) } : {}),
  storageBucket: BUCKET,
});

const [files] = await getStorage(app).bucket().getFiles({ prefix: PREFIX });

let downloaded = 0;
let skipped = 0;
let bytes = 0;

for (const file of files) {
  const relative = file.name.slice(PREFIX.length);
  if (!relative) continue;

  const destination = join(ROOT, relative);
  const size = Number(file.metadata.size);

  // Aynı boyuttaki dosya zaten varsa tekrar indirme.
  const existing = await stat(destination).catch(() => null);
  if (existing && existing.size === size) {
    skipped += 1;
    continue;
  }

  await mkdir(dirname(destination), { recursive: true });
  await file.download({ destination });
  console.log(`✓ ${relative}`);
  downloaded += 1;
  bytes += size;
}

console.log(`\n${downloaded} dosya indirildi (${(bytes / 1024 / 1024).toFixed(1)} MB), ${skipped} atlandı.`);

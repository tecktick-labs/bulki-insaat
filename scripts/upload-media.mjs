/**
 * src/assets altındaki görselleri ve videoyu Firebase Storage'a yükler.
 * Tek seferlik çalıştırılır; sonrasında assets klasörü repodan çıkarılabilir.
 *
 * Kullanım:
 *   GOOGLE_APPLICATION_CREDENTIALS=/yol/servis-hesabi.json node scripts/upload-media.mjs
 *
 * Servis hesabı anahtarını Firebase Console → Proje ayarları → Servis hesapları
 * bölümünden indirebilirsiniz. Anahtarı repoya EKLEMEYİN.
 */
import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { cert, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const ROOT = fileURLToPath(new URL("../src/assets", import.meta.url));
const BUCKET = process.env.STORAGE_BUCKET ?? "elysprime.firebasestorage.app";
const PREFIX = "media";

const CONTENT_TYPES = {
  ".webp": "image/webp",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

function credential() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inline) return { credential: cert(JSON.parse(inline)) };
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "Kimlik bilgisi yok. GOOGLE_APPLICATION_CREDENTIALS ya da FIREBASE_SERVICE_ACCOUNT_JSON tanımlayın.",
    );
  }
  return {};
}

async function* walk(dir) {
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    if ((await stat(full)).isDirectory()) yield* walk(full);
    else yield full;
  }
}

const app = initializeApp({ ...credential(), storageBucket: BUCKET });
const bucket = getStorage(app).bucket();

let uploaded = 0;
let bytes = 0;

for await (const file of walk(ROOT)) {
  const relativePath = relative(ROOT, file).split(/[\\/]/).join("/");
  const extension = relativePath.slice(relativePath.lastIndexOf("."));
  const destination = `${PREFIX}/${relativePath}`;

  await bucket.upload(file, {
    destination,
    metadata: {
      contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  bytes += (await stat(file)).size;
  uploaded += 1;
  console.log(`✓ ${destination}`);
}

console.log(`\n${uploaded} dosya yüklendi (${(bytes / 1024 / 1024).toFixed(1)} MB) → gs://${BUCKET}/${PREFIX}/`);

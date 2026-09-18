/**
 * Kodda tanımlı olup Firestore'daki `sections/campaigns` belgesinde bulunmayan
 * kampanyaları belgeye EKLER. Var olan kayıtlara dokunmaz.
 *
 * Neden gerekli: panelden bir kez kaydedildikten sonra site kampanyaları
 * Firestore'dan okur, koddaki dizi yalnızca varsayılan olarak kalır. Bu yüzden
 * koda yeni bir kampanya eklemek tek başına yayına yansımaz.
 *
 * Kullanım:
 *   npm run sync-campaigns -- --dry-run   (hiçbir şey yazmaz, ne olacağını gösterir)
 *   npm run sync-campaigns                (eksikleri Firestore'a ekler)
 *
 * Kimlik bilgisi .env.local içindeki GOOGLE_APPLICATION_CREDENTIALS'tan okunur;
 * npm script'i bu dosyayı kendisi yükler. CI'da FIREBASE_SERVICE_ACCOUNT_JSON yeterlidir.
 *
 * seed-content'in aksine bu script `--force` tanımaz: mevcut kampanyaların
 * panelden düzenlenmiş metinleri hiçbir koşulda üzerine yazılmaz.
 */
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { campaigns as defaultCampaigns } from "../src/lib/campaigns.ts";

const dryRun = process.argv.includes("--dry-run");

// Kimlik bilgisi kaynakları src/lib/firebase-admin.ts ile aynı: anahtarın kendisi,
// GOOGLE_APPLICATION_CREDENTIALS ya da `gcloud auth application-default login` dosyası.
function gcloudCredentialsPath() {
  const base = process.platform === "win32"
    ? process.env.APPDATA ?? join(homedir(), "AppData", "Roaming")
    : join(homedir(), ".config");
  return join(base, "gcloud", "application_default_credentials.json");
}

const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!inline && !process.env.GOOGLE_APPLICATION_CREDENTIALS && !existsSync(gcloudCredentialsPath())) {
  console.error(
    "Kimlik bilgisi yok. Şunlardan biri gerekli:\n" +
    "  FIREBASE_SERVICE_ACCOUNT_JSON, GOOGLE_APPLICATION_CREDENTIALS\n" +
    "  ya da: gcloud auth application-default login",
  );
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "elysprime";
const app = initializeApp({
  credential: inline ? cert(JSON.parse(inline)) : applicationDefault(),
  projectId,
});
const db = getFirestore(app);
const ref = db.collection("sections").doc("campaigns");
const snapshot = await ref.get();

// Belge hiç yoksa seed-content'in işi; burada karışmıyoruz.
if (!snapshot.exists) {
  console.log("sections/campaigns henüz yok — `npm run seed-content` koddaki tüm kampanyaları yazar.");
  process.exit(0);
}

const stored = snapshot.data().items;
if (!Array.isArray(stored)) {
  console.error("sections/campaigns içindeki `items` bir dizi değil. Panelden kontrol edin.");
  process.exit(1);
}

const storedSlugs = new Set(stored.map((campaign) => campaign?.slug));
const missing = defaultCampaigns.filter((campaign) => !storedSlugs.has(campaign.slug));

console.log(`Firestore'da ${stored.length} kampanya var: ${[...storedSlugs].join(", ")}`);

if (missing.length === 0) {
  console.log("Eksik kampanya yok, yapılacak bir şey yok.");
  process.exit(0);
}

for (const campaign of missing) {
  console.log(`+ ${campaign.slug} — ${campaign.title}`);
}

if (dryRun) {
  console.log(`\n--dry-run: ${missing.length} kampanya EKLENECEKTİ, hiçbir şey yazılmadı.`);
  process.exit(0);
}

// Sıra korunur: yeni kampanyalar listenin sonuna eklenir. Hero yalnızca ilk üçü
// gösterdiği için, yeni kampanyayı hero'ya almak isterseniz panelden yukarı taşıyın.
await ref.set({ items: [...stored, ...missing], updatedAt: FieldValue.serverTimestamp() }, { merge: true });

console.log(`\n${missing.length} kampanya eklendi. Toplam ${stored.length + missing.length}.`);
console.log("Panelden gözden geçirip Kaydet'e basın — böylece site önbelleği de tazelenir.");

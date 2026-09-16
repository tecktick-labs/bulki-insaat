import "server-only";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Sunucu tarafı Firebase erişimi.
 *
 * Kimlik bilgisi kaynakları, öncelik sırasıyla:
 *   1. FIREBASE_SERVICE_ACCOUNT_JSON  — anahtarın kendisi (CI için)
 *   2. FIRESTORE_EMULATOR_HOST        — yerel emülatör, kimlik gerekmez
 *   3. GOOGLE_APPLICATION_CREDENTIALS — yerel servis hesabı anahtarı
 *   4. gcloud ADC dosyası             — `gcloud auth application-default login`
 *   5. Cloud Run / App Hosting metadata sunucusu (canlı ortam)
 *
 * Hiçbiri yoksa `null` döner ve çağıranlar JSON varsayılanlarına düşer.
 * Bu, kimlik bilgisi olmayan bir makinede `next dev` çalıştırmayı mümkün kılar;
 * canlıda 5. madde her zaman geçerli olduğu için aynı yol hiç kullanılmaz.
 */

const APP_NAME = "elysprime-server";
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "elysprime";

function gcloudCredentialsPath() {
  const base = process.platform === "win32"
    ? process.env.APPDATA ?? join(homedir(), "AppData", "Roaming")
    : join(homedir(), ".config");
  return join(base, "gcloud", "application_default_credentials.json");
}

/**
 * Kimlik bilgisi olup olmadığını ağ isteği yapmadan belirler.
 * Bu kontrol olmadan google-auth-library metadata sunucusunu yoklamayı dener ve
 * yerel makinede yakalanamayan promise reddi üretir.
 */
function hasCredentialSource() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return true;
  }

  // Cloud Run (App Hosting), App Engine ve Cloud Functions bu değişkenleri tanımlar.
  if (process.env.K_SERVICE || process.env.GAE_ENV || process.env.FUNCTION_TARGET) {
    return true;
  }

  // Üretim derlemesinde ve üretim sunucusunda her zaman denenir: kimlik bilgisini
  // yanlışlıkla "yok" sayıp sessizce varsayılan metinleri yayınlamak,
  // gürültülü bir hatadan çok daha kötüdür.
  if (process.env.NODE_ENV === "production") return true;

  return existsSync(gcloudCredentialsPath());
}

let warned = false;

function warnMissingCredentials() {
  if (warned) return;
  warned = true;
  console.warn(
    "[firebase-admin] Kimlik bilgisi bulunamadı; site src/data içindeki varsayılanlarla çalışıyor.\n" +
    "  Gerçek Firestore verisini yerelde görmek için .env.local dosyasına şunu ekleyin:\n" +
    "    GOOGLE_APPLICATION_CREDENTIALS=/mutlak/yol/servis-hesabi.json\n" +
    "  ya da emülatörü kullanın: npm run emulators",
  );
}

async function createApp(): Promise<App | null> {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) return existing;

  const inlineKey = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inlineKey) {
    return initializeApp({ credential: cert(JSON.parse(inlineKey)), projectId }, APP_NAME);
  }

  // Emülatör kimlik doğrulaması yapmaz.
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    return initializeApp({ projectId }, APP_NAME);
  }

  if (!hasCredentialSource()) {
    warnMissingCredentials();
    return null;
  }

  const credential = applicationDefault();
  try {
    // Kimlik bilgisi var ama geçersizse burada anlaşılır; Firestore istemcisi
    // hiç oluşturulmadığı için arka planda yakalanmamış reddetme kalmaz.
    await credential.getAccessToken();
  } catch (error) {
    console.error("[firebase-admin] Kimlik bilgisi doğrulanamadı.", error);
    return null;
  }

  return initializeApp({ credential, projectId }, APP_NAME);
}

let pending: Promise<App | null> | undefined;

export function getAdminApp(): Promise<App | null> {
  pending ??= createApp().catch((error) => {
    console.error("[firebase-admin] Başlatılamadı.", error);
    return null;
  });
  return pending;
}

/** Firestore istemcisi; kimlik bilgisi yoksa null. */
export async function getAdminFirestore(): Promise<Firestore | null> {
  const app = await getAdminApp();
  return app ? getFirestore(app) : null;
}

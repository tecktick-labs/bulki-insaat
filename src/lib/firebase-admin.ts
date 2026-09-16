import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * App Hosting'de kimlik doğrulama Application Default Credentials üzerinden gelir —
 * Cloud Run servis hesabı otomatik kullanılır, key dosyası gerekmez.
 * Lokalde GOOGLE_APPLICATION_CREDENTIALS ya da FIREBASE_SERVICE_ACCOUNT_JSON kullanılabilir.
 */
function createApp(): App {
  const inlineKey = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inlineKey) {
    return initializeApp({ credential: cert(JSON.parse(inlineKey)) });
  }
  return initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "elysprime" });
}

export const adminApp = getApps().length ? getApp() : createApp();
export const adminFirestore = getFirestore(adminApp);

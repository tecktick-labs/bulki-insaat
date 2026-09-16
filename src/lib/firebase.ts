"use client";
import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyDHLCKaONtAIRzFT_9IjdKcbIGMKbxovPU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "elysprime.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "elysprime",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "elysprime.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "410333401132",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:410333401132:web:e36572d075a043a8b80189",
};

const isFirstInit = getApps().length === 0;

export const firebaseApp = isFirstInit ? initializeApp(firebaseConfig) : getApp();
export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

// Yerel emülatör. Bağlantı yalnızca uygulama ilk kez kurulurken yapılabilir.
if (isFirstInit && process.env.NEXT_PUBLIC_USE_EMULATORS === "1") {
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

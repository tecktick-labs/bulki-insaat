"use client";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyDHLCKaONtAIRzFT_9IjdKcbIGMKbxovPU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "elysprime.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "elysprime",
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "elysprime.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "410333401132",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:410333401132:web:e36572d075a043a8b80189",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

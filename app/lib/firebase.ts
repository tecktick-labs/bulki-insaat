import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHLCKaONtAIRzFT_9IjdKcbIGMKbxovPU",
  authDomain: "elysprime.firebaseapp.com",
  projectId: "elysprime",
  storageBucket: "elysprime.firebasestorage.app",
  messagingSenderId: "410333401132",
  appId: "1:410333401132:web:e36572d075a043a8b80189",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);

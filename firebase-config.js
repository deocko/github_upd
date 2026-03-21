/* ============================================
   UPD FIREBASE CONFIGURATION
   Centralized Firebase SDK Initialization
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Tu configuración de Firebase
// REEMPLAZAR con los valores de tu consola Firebase (Project Settings > General > Your apps)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "upd-universidad.firebaseapp.com",
  projectId: "upd-universidad",
  storageBucket: "upd-universidad.firebasestorage.app",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("🔥 UPD Firebase Initialized");

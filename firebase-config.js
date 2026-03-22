/* ============================================
   UPD FIREBASE CONFIGURATION
   Centralized Firebase SDK Initialization
   ============================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA9YK8wl85U-AKrG5dd04jQzS92MlJfH-w",
  authDomain: "bd-udp.firebaseapp.com",
  projectId: "bd-udp",
  databaseURL: "https://bd-udp-default-rtdb.firebaseio.com",
  storageBucket: "bd-udp.firebasestorage.app",
  messagingSenderId: "632490351120",
  appId: "1:632490351120:web:ba044394cc2189ed6ec895",
  measurementId: "G-9QNHB5FBZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "fs-upd");
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

console.log("🔥 UPD Firebase Initialized");

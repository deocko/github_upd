/* ============================================
   UPD AUTH UTILS (Firebase Auth)
   Logic for Login, Logout, Session persistence
   ============================================ */

import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut, 
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDoc, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/**
 * Registra un nuevo usuario y crea su documento en Firestore
 */
export async function registerUser(email, password, userData) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        await setDoc(doc(db, 'users', uid), {
            uid,
            email,
            ...userData,
            createdAt: serverTimestamp()
        });
        
        return uid;
    } catch (error) {
        console.error("❌ Error en Registro:", error.code, error.message);
        throw error;
    }
}

/**
 * Autenticación de usuario con Email y Password
 */
export async function login(email, password) {
    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        // Obtener rol y datos extendidos desde Firestore
        const userRef = doc(db, 'users', uid);
        const snap = await getDoc(userRef);
        
        if (snap.exists()) {
            const userData = snap.data();
            // Guardar en sessionStorage para acceso rápido en la UI (Mock)
            sessionStorage.setItem('upd_user', JSON.stringify({
                uid,
                email: userData.email,
                name: userData.displayName,
                role: userData.role,
                loggedIn: true
            }));
            return { uid, ...userData };
        } else {
            console.warn("⚠️ Usuario autenticado pero sin documento en Firestore");
            return { uid, role: 'student' }; // Valor por defecto si no existe doc
        }
    } catch (error) {
        console.error("❌ Error en Login:", error.code, error.message);
        throw error;
    }
}

/**
 * Cierra sesión y limpia sesión local
 */
export async function logout() {
    await signOut(auth);
    sessionStorage.removeItem('upd_user');
    window.location.href = 'login.html';
}

/**
 * Persistencia de sesión y monitoreo de estado
 * (Llamar en el header de todas las páginas protegidas)
 */
export function monitorAuthState(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user);
        } else {
            // No hay usuario, redirigir al login si es página protegida
            const path = window.location.pathname;
            if (path.includes('campus.html') || path.includes('dashboard.html')) {
                window.location.href = 'login.html';
            }
            callback(null);
        }
    });
}

/**
 * Verifica si el usuario actual tiene permisos administrativos
 */
export async function isAdmin() {
    const userJson = sessionStorage.getItem('upd_user');
    if (!userJson) return false;
    const user = JSON.parse(userJson);
    return user.role === 'admin';
}

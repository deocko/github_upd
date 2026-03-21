/* ============================================
   UPD DATABASE UTILS (Firestore)
   Logic for Courses, Students, Candidates, etc.
   ============================================ */

import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    setDoc, 
    getDoc, 
    getDocs, 
    doc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// ── COLLECTIONS ──
const USERS_COL = 'users'; // { uid, email, role: 'student|teacher|admin', ... }
const COURSES_COL = 'courses'; // { id, title, instructorId, modules[], price, rvoe }
const CANDIDATES_COL = 'candidates'; // { email, fullName, career, status: 'enrolling', ... }
const ENROLLMENTS_COL = 'enrollments'; // { studentId, courseId, date, status }

/**
 * Guarda o actualiza un usuario en la colección central
 */
export async function saveUser(uid, data) {
    const userRef = doc(db, USERS_COL, uid);
    await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

/**
 * Obtiene un usuario por su UID y rol
 */
export async function getUser(uid) {
    const userRef = doc(db, USERS_COL, uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
}

/**
 * Crea un candidato (prospecto) al iniciar el proceso de inscripción
 */
export async function createCandidate(data) {
    const candRef = collection(db, CANDIDATES_COL);
    return await addDoc(candRef, {
        ...data,
        status: 'enrolling',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
}

/**
 * Lista todos los cursos disponibles
 */
export async function getAllCourses() {
    const q = query(collection(db, COURSES_COL), orderBy('title'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Filtra alumnos por carrera (Para administradores)
 */
export async function getStudentsByCareer(career) {
    const q = query(collection(db, USERS_COL), where('role', '==', 'student'), where('career', '==', career));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Inscribe a un alumno en un curso (Registro de matrícula)
 */
export async function registerEnrollment(studentUid, courseId) {
    const enrollRef = collection(db, ENROLLMENTS_COL);
    await addDoc(enrollRef, {
        studentUid,
        courseId,
        date: serverTimestamp(),
        status: 'active'
    });
}

/**
 * Inicializa cursos base (Solo para admins)
 */
export async function initBaseCourses() {
    const courses = [
        { id: 'ing-inf-01', title: 'Ingeniería en Informática', price: 3500, instructor: 'Dr. Alan Turing', rvoe: 'RVOE-2026-001' },
        { id: 'lic-psi-01', title: 'Licenciatura en Psicología', price: 3200, instructor: 'Mtra. Carl Rogers', rvoe: 'RVOE-2026-002' },
        { id: 'lic-der-01', title: 'Licenciatura en Derecho Digital', price: 3500, instructor: 'Dr. Hans Kelsen', rvoe: 'RVOE-2026-003' }
    ];

    for (const c of courses) {
        await setDoc(doc(db, COURSES_COL, c.id), c);
    }
}

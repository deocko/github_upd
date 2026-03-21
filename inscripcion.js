/* ============================================
   UPD ENROLLMENT FLOW LOGIC (FIREBASE ENABLED)
   ============================================ */

import { createCandidate } from './firebase-db-utils.js';
import { storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.enroll-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBar = document.getElementById('progressLineFill');
    const nextBtn = document.getElementById('enrollNextBtn');
    const prevBtn = document.getElementById('enrollPrevBtn');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    let enrollmentData = {};

    // ── Career Selection Logic ──
    const careerCards = document.querySelectorAll('.career-card');
    careerCards.forEach(card => {
        card.addEventListener('click', () => {
            careerCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const careerName = card.dataset.career;
            document.getElementById('enrollCost').innerText = card.querySelector('.career-info p:last-child').innerText.split(': ')[1];
            document.getElementById('enrollTotal').innerText = card.querySelector('.career-info p:last-child').innerText.split(': ')[1];
            
            enrollmentData.career = careerName;
        });
    });

    // ── Navigation Logic ──
    function updateSteps() {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === currentStep) step.classList.add('active');
        });

        progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < currentStep) step.classList.add('completed');
            else if (index + 1 === currentStep) step.classList.add('active');
        });

        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercent}%`;

        if (currentStep === 1) prevBtn.style.visibility = 'hidden';
        else if (currentStep === totalSteps) document.getElementById('stepNav').style.display = 'none';
        else prevBtn.style.visibility = 'visible';

        if (currentStep === 5) nextBtn.innerText = 'Validar Documentos';
        else if (currentStep === 6) nextBtn.innerText = 'Pagar Inscripción';
        else nextBtn.innerText = 'Siguiente';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtn.addEventListener('click', async () => {
        if (await validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateSteps();
                if (currentStep === 7) finalizeEnrollment();
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    async function validateStep(step) {
        if (step === 1) {
            enrollmentData.fullName = document.getElementById('fullName').value;
            enrollmentData.email = document.getElementById('email').value;
            enrollmentData.phone = document.getElementById('phone').value;
            if (!enrollmentData.fullName || !enrollmentData.email) {
                alert('Por favor completa los campos obligatorios.');
                return false;
            }
        }
        
        if (step === 2 && !enrollmentData.career) {
            alert('Por favor selecciona una carrera.');
            return false;
        }

        if (step === 3) {
            enrollmentData.curp = document.getElementById('curp').value;
            if (enrollmentData.curp.length < 18) {
                alert('CURP inválida');
                return false;
            }
        }
        
        if (step === 5) {
            nextBtn.innerText = 'Guardando en Firebase...';
            nextBtn.disabled = true;
            try {
                // Guardar como prospecto en Firestore
                await createCandidate(enrollmentData);
                
                setTimeout(() => {
                    nextBtn.disabled = false;
                    nextBtn.innerText = 'Siguiente';
                    currentStep++;
                    updateSteps();
                }, 1000);
                return false; 
            } catch (e) {
                alert("Error al conectar con la base de datos.");
                nextBtn.disabled = false;
                return false;
            }
        }

        return true;
    }

    async function handleFileUpload(file, type) {
        if (!file) return;
        const fileRef = ref(storage, `candidates/${enrollmentData.email || 'anon'}/${type}_${file.name}`);
        try {
            const snapshot = await uploadBytes(fileRef, file);
            const url = await getDownloadURL(snapshot.ref);
            enrollmentData[`doc_${type}`] = url;
            console.log(`✅ ${type} subido exitosamente`);
        } catch (e) {
            console.error("Error subiendo archivo", e);
        }
    }

    function finalizeEnrollment() {
        const year = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        const matricula = `UPD-${year}-${random}`;
        document.getElementById('generatedMatricula').innerText = matricula;
    }

    // ── Drag & Drop Logic (Firebase Real) ──
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach((zone, index) => {
        const types = ['acta', 'certificado', 'ine'];
        const type = types[index] || 'otro';

        zone.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    zone.querySelector('p').innerText = 'Subiendo...';
                    await handleFileUpload(file, type);
                    zone.querySelector('p').innerText = `✅ ${file.name}`;
                    zone.querySelector('svg').style.color = 'var(--success)';
                }
            };
            input.click();
        };
    });

    updateSteps();
});

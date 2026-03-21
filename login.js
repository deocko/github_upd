/* ============================================
   LOGIN PAGE — JavaScript (FIREBASE ENABLED)
   Universidad Politécnica Digital
   ============================================ */

import { login } from './firebase-auth-utils.js';

document.addEventListener('DOMContentLoaded', () => {

    // ── Theme Toggle Layer ──
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const headerLogo = document.getElementById('headerLogo');
    const visualLogo = document.getElementById('visualLogo');

    const updateLogos = (theme) => {
        const logoSrc = theme === 'light' ? 'assets/logo-blue-full.png' : 'assets/logo-white-full.png';
        if (headerLogo) headerLogo.src = logoSrc;
        if (visualLogo) visualLogo.src = logoSrc;
    };

    const savedTheme = localStorage.getItem('upd-theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        updateLogos('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = body.classList.toggle('light-theme');
            const theme = isLight ? 'light' : 'dark';
            localStorage.setItem('upd-theme', theme);
            updateLogos(theme);
        });
    }

    const form = document.getElementById('loginForm');
    const studentId = document.getElementById('studentId'); // Usado como Email
    const password = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const idError = document.getElementById('idError');
    const passError = document.getElementById('passError');
    const alert = document.getElementById('loginAlert');

    // Clear errors on input
    studentId.addEventListener('input', () => {
        studentId.classList.remove('error');
        idError.classList.remove('visible');
    });

    password.addEventListener('input', () => {
        password.classList.remove('error');
        passError.classList.remove('visible');
    });

    function showAlert(message, type = 'error') {
        alert.textContent = message;
        alert.className = `login-alert ${type} show`;
        setTimeout(() => {
            alert.classList.remove('show');
        }, 4000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let valid = true;

        if (!studentId.value.trim()) {
            studentId.classList.add('error');
            idError.classList.add('visible');
            valid = false;
        }

        if (!password.value.trim()) {
            password.classList.add('error');
            passError.classList.add('visible');
            valid = false;
        }

        if (!valid) return;

        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        try {
            // FIREBASE LOGIN
            const result = await login(studentId.value.trim(), password.value);
            
            showAlert('✅ Autenticación exitosa. Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'campus.html';
            }, 1000);

        } catch (error) {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            let errorMsg = '❌ Credenciales incorrectas.';
            if (error.code === 'auth/user-not-found') errorMsg = '❌ El usuario no existe.';
            if (error.code === 'auth/wrong-password') errorMsg = '❌ Contraseña incorrecta.';
            if (error.code === 'auth/invalid-email') errorMsg = '❌ Formato de correo inválido.';
            
            showAlert(errorMsg);
            password.value = '';
            password.focus();
        }
    });

    // Enter key support
    password.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
    });
});

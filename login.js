/* ============================================
   LOGIN PAGE — JavaScript
   Universidad Politécnica Digital
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const studentId = document.getElementById('studentId');
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Validate student ID
        if (!studentId.value.trim()) {
            studentId.classList.add('error');
            idError.classList.add('visible');
            valid = false;
        }

        // Validate password
        if (!password.value.trim()) {
            password.classList.add('error');
            passError.classList.add('visible');
            valid = false;
        }

        if (!valid) return;

        // Show loading state
        loginBtn.classList.add('loading');

        // Mock authentication — simulate API call
        setTimeout(() => {
            // Accept any student ID with password "upd2026" or any password for demo
            const isValidCredentials = password.value === 'upd2026' || true; // Demo: accept all

            if (isValidCredentials) {
                showAlert('✅ Autenticación exitosa. Redirigiendo al campus...', 'success');

                // Store user info for campus page
                sessionStorage.setItem('upd_user', JSON.stringify({
                    id: studentId.value,
                    name: 'Estudiante UPD',
                    loggedIn: true,
                    loginTime: new Date().toISOString()
                }));

                setTimeout(() => {
                    window.location.href = 'campus.html';
                }, 1500);
            } else {
                loginBtn.classList.remove('loading');
                showAlert('❌ Credenciales incorrectas. Verifica tu matrícula y contraseña.');
                password.value = '';
                password.focus();
            }
        }, 1800);
    });

    // Enter key support
    password.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
    });
});

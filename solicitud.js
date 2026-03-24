/* ============================================
   UPD - Quick Info Drawer Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const openDrawerBtn = document.getElementById('openDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawer');
    const drawer = document.getElementById('infoDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const leadForm = document.getElementById('leadForm');

    const toggleDrawer = (isOpen) => {
        if (isOpen) {
            drawer.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (openDrawerBtn) {
        openDrawerBtn.addEventListener('click', () => toggleDrawer(true));
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => toggleDrawer(false));
    }

    if (overlay) {
        overlay.addEventListener('click', () => toggleDrawer(false));
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            toggleDrawer(false);
        }
    });

    // Form Submission
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = leadForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            
            // Artificial delay for UX
            setTimeout(() => {
                alert('¡Gracias por tu interés! Un asesor de UPD se comunicará contigo muy pronto.');
                leadForm.reset();
                btn.disabled = false;
                btn.textContent = originalText;
                toggleDrawer(false);
            }, 1500);
        });
    }
    // Regular Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            
            setTimeout(() => {
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
                contactForm.reset();
                btn.disabled = false;
                btn.textContent = originalText;
            }, 1200);
        });
    }
});

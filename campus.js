/* ============================================
   CAMPUS VIRTUAL — JavaScript
   Universidad Politécnica Digital
   Interactive Map + Building Info Panels
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Building Data ──
    const buildingsData = {
        rectoria: {
            title: '🏛️ Rectoría',
            description: 'El corazón administrativo de la Universidad Politécnica Digital. Aquí se gestionan todos los procesos institucionales, desde la dirección general hasta asuntos académicos y la planeación estratégica de la universidad.',
            status: 'Abierto 24/7',
            features: [
                { icon: '📋', name: 'Trámites Académicos', desc: 'Inscripciones, bajas y cambios' },
                { icon: '📜', name: 'Certificaciones', desc: 'Constancias y certificados oficiales' },
                { icon: '💳', name: 'Pagos y Finanzas', desc: 'Portal de pagos y becas' },
                { icon: '📞', name: 'Atención al Estudiante', desc: 'Chat, email y videollamada' }
            ],
            schedule: [
                { day: 'Lunes - Viernes', time: '8:00 AM - 9:00 PM' },
                { day: 'Sábados', time: '9:00 AM - 3:00 PM' },
                { day: 'Domingos', time: 'Solo urgencias' }
            ],
            action: 'Iniciar Trámite'
        },
        biblioteca: {
            title: '📚 Biblioteca Digital',
            description: 'Accede a más de 500,000 recursos académicos incluyendo libros digitales, revistas indexadas, tesis, bases de datos internacionales como JSTOR, ScienceDirect y IEEE. Incluye salas de estudio virtuales colaborativas.',
            status: 'Disponible',
            features: [
                { icon: '📖', name: 'Catálogo Digital', desc: '500,000+ recursos disponibles' },
                { icon: '🔬', name: 'Bases de Datos', desc: 'JSTOR, ScienceDirect, IEEE' },
                { icon: '👥', name: 'Salas de Estudio', desc: 'Espacios colaborativos virtuales' },
                { icon: '🤖', name: 'Asistente IA', desc: 'Búsqueda inteligente de recursos' }
            ],
            schedule: [
                { day: 'Todos los días', time: '24 horas' },
                { day: 'Soporte bibliotecario', time: '8:00 AM - 10:00 PM' }
            ],
            action: 'Explorar Catálogo'
        },
        laboratorios: {
            title: '💻 Laboratorios Virtuales',
            description: 'Laboratorios de última generación con acceso a máquinas virtuales, entornos de desarrollo cloud, simuladores de redes, laboratorios de ciberseguridad y estaciones de trabajo con GPU para inteligencia artificial.',
            status: 'Disponible',
            features: [
                { icon: '🖥️', name: 'Máquinas Virtuales', desc: 'Windows, Linux, macOS cloud' },
                { icon: '🐍', name: 'IDEs en la Nube', desc: 'VS Code, Jupyter, IntelliJ' },
                { icon: '🔒', name: 'Lab de Ciberseguridad', desc: 'Entorno sandbox de hacking ético' },
                { icon: '🧠', name: 'GPU Computing', desc: 'NVIDIA A100 para entrenamiento IA' }
            ],
            schedule: [
                { day: 'Todos los días', time: '24 horas' },
                { day: 'Mantenimiento', time: 'Domingo 3:00 - 5:00 AM' }
            ],
            action: 'Abrir Laboratorio'
        },
        aulas: {
            title: '🎓 Aulas de Clase',
            description: 'Aulas virtuales con tecnología de videoconferencia HD, pizarra digital interactiva, grabación automática de clases, traducción en tiempo real y sistema de participación gamificado.',
            status: 'Disponible',
            features: [
                { icon: '📹', name: 'Clases en Vivo', desc: 'Video HD con pizarra inteligente' },
                { icon: '📝', name: 'Grabaciones', desc: 'Todas las clases disponibles 24/7' },
                { icon: '🌐', name: 'Traducción en Tiempo Real', desc: '12 idiomas disponibles' },
                { icon: '🏆', name: 'Gamificación', desc: 'Puntos, logros y rankings' }
            ],
            schedule: [
                { day: 'Lunes - Viernes', time: '7:00 AM - 10:00 PM' },
                { day: 'Sábados', time: '8:00 AM - 2:00 PM' }
            ],
            action: 'Ver Horarios'
        },
        deportivo: {
            title: '🏋️ Centro Deportivo',
            description: 'Bienestar integral para nuestros estudiantes. Accede a clases de fitness en vivo, rutinas personalizadas por IA, competencias deportivas inter-campus virtuales y programas de salud mental.',
            status: 'Disponible',
            features: [
                { icon: '🧘', name: 'Clases en Vivo', desc: 'Yoga, HIIT, meditación, artes marciales' },
                { icon: '📊', name: 'Rutinas IA', desc: 'Plans personalizados con seguimiento' },
                { icon: '🏅', name: 'Competencias', desc: 'Torneos e-sports y retos fitness' },
                { icon: '🧠', name: 'Salud Mental', desc: 'Coaching y terapia en línea' }
            ],
            schedule: [
                { day: 'Clases grupales', time: '6:00 AM - 9:00 PM' },
                { day: 'Contenido on-demand', time: '24 horas' }
            ],
            action: 'Ver Actividades'
        },
        cafeteria: {
            title: '🍽️ Cafetería Estudiantil',
            description: 'El punto de encuentro social de la comunidad UPD. Foros de discusión, grupos de estudio, eventos sociales virtuales, marketplace de estudiantes y el legendario café virtual de los viernes.',
            status: 'Disponible',
            features: [
                { icon: '💬', name: 'Foros Sociales', desc: 'Comunidades por carrera e intereses' },
                { icon: '🎲', name: 'Eventos Sociales', desc: 'Game nights, trivia, networking' },
                { icon: '🛒', name: 'Marketplace', desc: 'Compra/venta entre estudiantes' },
                { icon: '☕', name: 'Café de los Viernes', desc: 'Charlas informales con docentes' }
            ],
            schedule: [
                { day: 'Foros', time: '24 horas' },
                { day: 'Eventos en vivo', time: 'Viernes 5:00 PM' }
            ],
            action: 'Unirse a la Comunidad'
        },
        cultural: {
            title: '🎭 Centro Cultural',
            description: 'Espacio dedicado al arte, la cultura y la expresión creativa. Exposiciones virtuales, talleres de arte digital, teatro en línea, galería de arte NFT estudiantil y festivales culturales internacionales.',
            status: 'Disponible',
            features: [
                { icon: '🎨', name: 'Galería Virtual', desc: 'Exposiciones de arte estudiantil' },
                { icon: '🎬', name: 'Teatro Digital', desc: 'Producciones y performances en vivo' },
                { icon: '🎵', name: 'Talleres de Música', desc: 'Producción musical y bandas' },
                { icon: '✍️', name: 'Taller de Escritura', desc: 'Club literario y revista digital' }
            ],
            schedule: [
                { day: 'Exposiciones', time: '24 horas' },
                { day: 'Eventos en vivo', time: 'Jueves y Sábados' }
            ],
            action: 'Explorar Cultura'
        },
        servicios: {
            title: '🏥 Servicios Estudiantiles',
            description: 'Centro integral de apoyo. Orientación vocacional, tutorías personalizadas, bolsa de trabajo, servicio médico virtual, apoyo psicológico y asistencia técnica para la plataforma.',
            status: 'Disponible',
            features: [
                { icon: '🩺', name: 'Telemedicina', desc: 'Consultas médicas en línea' },
                { icon: '🧭', name: 'Orientación', desc: 'Asesoría académica y vocacional' },
                { icon: '💼', name: 'Bolsa de Trabajo', desc: '2,000+ vacantes de empresas aliadas' },
                { icon: '🔧', name: 'Soporte Técnico', desc: 'Ayuda con plataforma 24/7' }
            ],
            schedule: [
                { day: 'Lunes - Viernes', time: '7:00 AM - 11:00 PM' },
                { day: 'Sábados', time: '8:00 AM - 3:00 PM' },
                { day: 'Urgencias', time: '24/7' }
            ],
            action: 'Solicitar Atención'
        },
        auditorio: {
            title: '🎤 Auditorio Principal',
            description: 'Espacio para grandes eventos institucionales: graduaciones virtuales, conferencias magistrales con líderes mundiales, hackatones, webinars y ceremonias académicas con capacidad para 10,000 asistentes simultáneos.',
            status: 'Disponible',
            features: [
                { icon: '🎓', name: 'Graduaciones', desc: 'Ceremonias virtuales inmersivas' },
                { icon: '🌍', name: 'Conferencias', desc: 'Speakers internacionales cada mes' },
                { icon: '💡', name: 'Hackatones', desc: 'Competencias de innovación' },
                { icon: '📺', name: 'Streaming', desc: 'Transmisiones en vivo 4K' }
            ],
            schedule: [
                { day: 'Eventos programados', time: 'Ver calendario' },
                { day: 'Próximo evento', time: 'Viernes 6:00 PM' }
            ],
            action: 'Ver Calendario'
        }
    };

    // ── DOM Elements ──
    const infoPanel = document.getElementById('infoPanel');
    const infoPanelTitle = document.getElementById('infoPanelTitle');
    const infoPanelBody = document.getElementById('infoPanelBody');
    const infoPanelClose = document.getElementById('infoPanelClose');
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const logoutBtn = document.getElementById('logoutBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // ── Theme Toggle Layer ──
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const headerLogo = document.getElementById('headerLogo');

    const updateLogos = (theme) => {
        const logoSrc = theme === 'light' ? 'assets/logo-light-theme.png' : 'assets/logo-dark-theme.png';
        if (headerLogo) headerLogo.src = logoSrc;
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

    // ── Load user info from session ──
    const userInfo = JSON.parse(sessionStorage.getItem('upd_user') || '{}');
    if (userInfo.id) {
        const initials = userInfo.id.substring(0, 2).toUpperCase();
        if (userAvatar) userAvatar.textContent = initials;
        if (userName) userName.textContent = userInfo.id;
    }

    // ── Welcome Overlay ──
    setTimeout(() => {
        if (welcomeOverlay) {
            welcomeOverlay.classList.add('hidden');
            setTimeout(() => welcomeOverlay.remove(), 800);
        }
    }, 2200);

    // ── Building Click Handlers ──
    const buildings = document.querySelectorAll('.building-group');
    let activeBuilding = null;

    buildings.forEach(building => {
        building.addEventListener('click', () => {
            const buildingId = building.dataset.building;
            const data = buildingsData[buildingId];
            if (!data) return;

            // Remove active class from previous
            if (activeBuilding) {
                activeBuilding.classList.remove('active');
            }
            activeBuilding = building;
            building.classList.add('active');

            // Populate sidebar
            infoPanelTitle.innerHTML = data.title;
            infoPanelBody.innerHTML = generatePanelContent(data);

            // Open panel
            infoPanel.classList.add('open');
        });
    });

    function generatePanelContent(data) {
        let html = '';

        // Status badge
        html += `<div class="info-panel-status online"><span class="status-dot"></span>${data.status}</div>`;

        // Description
        html += `<p class="info-description">${data.description}</p>`;

        // Features
        html += '<div class="info-features">';
        data.features.forEach(feature => {
            html += `
        <div class="info-feature">
          <div class="info-feature-icon">${feature.icon}</div>
          <div class="info-feature-text">
            <strong>${feature.name}</strong>
            <span>${feature.desc}</span>
          </div>
        </div>
      `;
        });
        html += '</div>';

        // Action button
        html += `<button class="info-action-btn" onclick="alert('🚀 Función próximamente disponible')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
      ${data.action}
    </button>`;

        // Schedule
        html += '<div class="info-schedule"><h4>Horario</h4>';
        data.schedule.forEach(item => {
            html += `<div class="schedule-item"><span class="day">${item.day}</span><span class="time">${item.time}</span></div>`;
        });
        html += '</div>';

        return html;
    }

    // ── Close Panel ──
    infoPanelClose.addEventListener('click', () => {
        infoPanel.classList.remove('open');
        if (activeBuilding) {
            activeBuilding.classList.remove('active');
            activeBuilding = null;
        }
    });

    // Close panel with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && infoPanel.classList.contains('open')) {
            infoPanelClose.click();
        }
    });

    // ── Logout ──
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('upd_user');
            window.location.href = 'login.html';
        });
    }

    // ── Fullscreen ──
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => { });
            } else {
                document.exitFullscreen().catch(() => { });
            }
        });
    }

    // ── Building hover sound effect (visual feedback) ──
    buildings.forEach(building => {
        building.addEventListener('mouseenter', () => {
            building.style.transition = 'transform 0.3s ease';
        });
    });

    // ── Dynamic Time-based Campus Image ──
    const campusDynamicImage = document.getElementById('campusDynamicImage');
    
    function updateCampusImageByTime() {
        if (!campusDynamicImage) return;
        
        const currentHour = new Date().getHours();
        let newSrc = '';
        
        // Day: 6 AM to 5:59 PM (06:00 - 17:59)
        // Afternoon: 6 PM to 7:59 PM (18:00 - 19:59)
        // Night: 8 PM to 5:59 AM (20:00 - 05:59)
        
        if (currentHour >= 6 && currentHour < 18) {
            newSrc = 'assets/campus-dia.jpg';
        } else if (currentHour >= 18 && currentHour < 20) {
            newSrc = 'assets/campus-tarde.jpg';
        } else {
            newSrc = 'assets/campus-noche.jpg';
        }
        
        // Only update if it changed to avoid flickering
        if (!campusDynamicImage.src.endsWith(newSrc)) {
            // Apply a fade effect
            campusDynamicImage.style.opacity = '0.8';
            setTimeout(() => {
                campusDynamicImage.src = newSrc;
                campusDynamicImage.style.opacity = '1';
            }, 300);
        }
    }
    
    // Initial call
    updateCampusImageByTime();
    
    // Check every minute
    setInterval(updateCampusImageByTime, 60000);

});

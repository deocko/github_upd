import { programasData } from './programas-data.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Program ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const programId = urlParams.get('id');

    if (!programId || !programasData[programId]) {
        console.error('Programa no encontrado:', programId);
        window.location.href = 'index.html';
        return;
    }

    const data = programasData[programId];

    // 2. Populate Hero Section
    document.title = `${data.titulo} — UPD`;
    document.getElementById('programTitle').textContent = data.titulo;
    document.getElementById('programSub').textContent = data.subtitulo;
    document.getElementById('programTag').textContent = data.tag;

    // 3. Populate General Info
    document.getElementById('generalDesc').innerHTML = `<p style="line-height: 1.8; color: var(--text-secondary);">${data.descripcion}</p>`;
    const subjectsList = document.getElementById('subjectsList');
    subjectsList.innerHTML = '';
    data.programa.forEach(sub => {
        const div = document.createElement('div');
        div.className = 'feature-item';
        div.textContent = sub;
        subjectsList.appendChild(div);
    });

    // 4. Populate Admission
    const reqList = document.getElementById('reqList');
    reqList.innerHTML = '';
    data.requisitos.forEach(req => {
        const div = document.createElement('div');
        div.className = 'feature-item';
        div.textContent = req;
        reqList.appendChild(div);
    });
    document.getElementById('processText').textContent = data.proceso_inscripcion;

    // 5. Populate Costs
    document.getElementById('priceInsc').textContent = data.costos.inscripcion;
    document.getElementById('priceMensual').textContent = data.costos.mensualidad;
    document.getElementById('duration').textContent = data.costos.duracion;

    // 6. Populate Calendar
    const calendarCont = document.getElementById('calendarList');
    calendarCont.innerHTML = '';
    data.calendario.forEach(item => {
        const p = document.createElement('p');
        p.style.marginBottom = '12px';
        p.style.display = 'flex';
        p.style.gap = '10px';
        p.innerHTML = `<span style="color: var(--upd-gold);">●</span> ${item}`;
        calendarCont.appendChild(p);
    });

    // 7. Populate Privacy
    document.getElementById('privacyText').textContent = data.aviso_privacidad;

    // 8. Tab Switching Logic with Animation
    const navItems = document.querySelectorAll('.detail-nav-item');
    const panes = document.querySelectorAll('.section-pane');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;

            // Update Nav item state
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Find current active pane
            const currentPane = document.querySelector('.section-pane.active');
            
            if (currentPane.id === target) return;

            // Simple animation sequence
            currentPane.style.opacity = '0';
            currentPane.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                panes.forEach(p => p.classList.remove('active'));
                const nextPane = document.getElementById(target);
                nextPane.classList.add('active');
                
                // Force reflow for animation
                void nextPane.offsetWidth;
                
                nextPane.style.opacity = '1';
                nextPane.style.transform = 'translateY(0)';
            }, 300);
            
            // Scroll to content on mobile
            if (window.innerWidth < 1024) {
                document.getElementById('detailContent').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

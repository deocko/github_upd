/* ============================================
   Universidad Politécnica Digital
   Main Application JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Theme Toggle Layer ──
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const headerLogo = document.getElementById('headerLogo');
  const footerLogo = document.getElementById('footerLogo');
  const mainHeroLogo = document.getElementById('mainHeroLogo');

  const updateLogos = (theme) => {
    const logoSrc = theme === 'light' ? 'assets/logo-blue-full.png' : 'assets/logo-white-full.png';
    const heroLogoSrc = theme === 'light' ? 'assets/logo-hero-blue.png' : 'assets/logo-hero-white.png';
    
    const headerLogo = document.getElementById('headerLogo');
    const footerLogo = document.getElementById('footerLogo');
    const mainHeroLogo = document.getElementById('mainHeroLogo');
    const visualLogo = document.getElementById('visualLogo');
    
    if (headerLogo) headerLogo.src = logoSrc;
    if (footerLogo) footerLogo.src = logoSrc;
    if (mainHeroLogo) mainHeroLogo.src = heroLogoSrc;
    if (visualLogo) visualLogo.src = heroLogoSrc;
  };

  const savedTheme = localStorage.getItem('upd-theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }
  updateLogos(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = body.classList.toggle('light-theme');
      const theme = isLight ? 'light' : 'dark';
      localStorage.setItem('upd-theme', theme);
      updateLogos(theme);
    });
  }


  // ── Header scroll effect ──
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ── Mobile menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ── Particles Generator ──
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      particlesContainer.appendChild(particle);
    }
  }

  // ── Scroll Reveal / IntersectionObserver ──
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Animated Counters ──
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();
    const format = target >= 1000;

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);

      if (format) {
        element.textContent = current.toLocaleString('es-MX') + '+';
      } else {
        element.textContent = current + (target < 100 ? '+' : '%');
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }



  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
  
  // ── Program Cards Navigation Fix ──
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        window.location.href = href;
      }
    });
  });
  // ── Professional Accessibility Suite (UserWay Style) ──
  const accToggle = document.getElementById('accToggle');
  const accMenu = document.getElementById('accMenu');
  const accClose = document.getElementById('accClose');
  
  if (accToggle && accMenu) {
    accToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      accMenu.classList.toggle('active');
    });

    if (accClose) {
      accClose.addEventListener('click', () => {
        accMenu.classList.remove('active');
      });
    }
    
    document.addEventListener('click', (e) => {
      if (!accMenu.contains(e.target) && e.target !== accToggle) {
        accMenu.classList.remove('active');
      }
    });

    const accOptions = [
      { id: 'btnContrast', class: 'acc-contrast', key: 'contrast' },
      { id: 'btnLinks', class: 'acc-links', key: 'links' },
      { id: 'btnTextSize', class: 'acc-text', key: 'text' },
      { id: 'btnSpacing', class: 'acc-spacing', key: 'spacing' },
      { id: 'btnStopAnim', class: 'acc-stop-anim', key: 'anim' },
      { id: 'btnHideImg', class: 'acc-hide-img', key: 'img' },
      { id: 'btnDyslexia', class: 'acc-dyslexia', key: 'dys' },
      { id: 'btnCursor', class: 'acc-cursor', key: 'cursor' }
    ];

    accOptions.forEach(opt => {
      const btn = document.getElementById(opt.id);
      if (btn) {
        // Load state
        if (localStorage.getItem(`acc-${opt.key}`) === 'true') {
          document.documentElement.classList.add(opt.class);
          btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
          const isActive = document.documentElement.classList.toggle(opt.class);
          btn.classList.toggle('active', isActive);
          localStorage.setItem(`acc-${opt.key}`, isActive);
        });
      }
    });
  }

  // ── Sticky Nav: Active Section Indicator ──
  const navSectionLinks = document.querySelectorAll('.nav-links a[data-section]');
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navSectionLinks.forEach(link => {
          link.classList.toggle('nav-active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px -60% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

});

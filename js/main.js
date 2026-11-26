/* =============================================================================
   UPD · Universidad de Profesionalización Digital — JS principal
   Compartido por index.html, carreras/*.html y aviso-de-privacidad.html.
   Cada módulo revisa que su HTML exista antes de ejecutarse.
============================================================================= */

/* ===== CONFIGURACIÓN (único lugar a editar) ================================
   WA_NUMBER: WhatsApp de admisiones en formato internacional sin "+":
              52 + 10 dígitos (ej. 52XXXXXXXXXX).
   TODO(dueño): poner el número real. Mientras diga 'TODO', los formularios NO
   envían a ningún número: muestran un aviso y ofrecen el correo.
   LEADS_ENDPOINT: URL (https) que recibe los formularios por POST en JSON.
   TODO(dueño): conectar el backend/CRM cuando exista. Vacío = no se usa.
   PLAN_ISC_URL: PDF del plan de estudios de ISC para descarga.
   TODO(dueño): subir el PDF y poner su ruta (ej. '/docs/plan-isc.pdf').
=========================================================================== */
var WA_NUMBER = 'TODO';
var CONTACT_EMAIL = 'contacto@upd.mx';
var LEADS_ENDPOINT = '';
var PLAN_ISC_URL = '';

(function(){
  'use strict';
  var UPD = window.UPD = window.UPD || {};
  UPD.lang = 'es';
  function L(){ return UPD.lang || 'es'; }
  function t(es,en){ return L()==='en' ? en : es; }
  UPD.t = t;
  function $(s,r){ return (r||document).querySelector(s); }
  function $$(s,r){ return [].slice.call((r||document).querySelectorAll(s)); }

  /* ---------- WhatsApp / envío de leads ---------- */
  UPD.waReady = function(){ return /^52\d{10}$/.test(String(WA_NUMBER)); };
  UPD.waLink = function(msg){ return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); };
  if(!UPD.waReady() && window.console){ console.info('[UPD] WA_NUMBER sin configurar: los formularios muestran el aviso y ofrecen correo.'); }

  var LABELS = {
    nombre:['Nombre','Name'], whatsapp:['WhatsApp','WhatsApp'], correo:['Correo','Email'],
    programa:['Programa','Program'], carrera:['Carrera','Program'], mensaje:['Mensaje','Message'],
    plan:['Plan','Plan'], situacion:['Situación','Situation'], inicio:['Inicio','Start']
  };
  function summary(origen, data){
    var lines = [t('Nuevo contacto','New lead') + ' (' + origen + ') — UPD'];
    Object.keys(data).forEach(function(k){
      if(data[k] && LABELS[k]) lines.push(t(LABELS[k][0],LABELS[k][1]) + ': ' + data[k]);
    });
    return lines.join('\n');
  }
  function mailtoLink(origen, data){
    return 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('UPD · ' + origen) +
           '&body=' + encodeURIComponent(summary(origen, data));
  }
  function setStatus(el, kind, html){
    if(!el) return;
    el.className = 'form-status show ' + kind;
    el.innerHTML = html;
  }
  /* Entrega un lead: backend si existe; si no, WhatsApp si está configurado;
     si tampoco, mensaje claro + correo prellenado. Nunca manda a un número falso. */
  UPD.deliver = function(origen, data, statusEl, onDone){
    var mail = '<a href="' + mailtoLink(origen, data) + '">' + CONTACT_EMAIL + '</a>';
    function fallback(){
      if(UPD.waReady()){
        window.open(UPD.waLink(summary(origen, data)), '_blank', 'noopener');
        setStatus(statusEl, 'ok', t('Abrimos WhatsApp con tu mensaje listo. Solo presiona enviar. Si no se abrió, escríbenos a ',
                                    'We opened WhatsApp with your message ready. Just press send. If it did not open, email us at ') + mail + '.');
      } else {
        setStatus(statusEl, 'info', t('Nuestro WhatsApp de admisiones aún no está activo, así que <b>no enviamos tus datos a ningún número</b>. Escríbenos a ',
                                      'Our admissions WhatsApp is not active yet, so <b>your details were not sent to any number</b>. Please email us at ') +
                                    mail + t(' (el mensaje ya va prellenado).',' (the message is pre-filled).'));
      }
      if(onDone) onDone();
    }
    if(LEADS_ENDPOINT){
      var payload = {origen:origen, idioma:L(), pagina:location.pathname, fecha:new Date().toISOString()};
      Object.keys(data).forEach(function(k){ payload[k] = data[k]; });
      fetch(LEADS_ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})
        .then(function(r){
          if(!r.ok) throw new Error(r.status);
          setStatus(statusEl, 'ok', t('¡Listo! Recibimos tus datos. Un asesor te contactará pronto.','Done! We received your details. An advisor will contact you soon.'));
          if(onDone) onDone();
        })
        .catch(fallback);
    } else {
      fallback();
    }
  };

  /* ---------- Validación ---------- */
  var RULES = {
    name : function(v){ return v.trim().length >= 3; },
    tel  : function(v){ return v.replace(/\D/g,'').length === 10; },
    email: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
  };
  var MSG = {
    name : ['Escribe tu nombre completo.','Enter your full name.'],
    tel  : ['Deben ser 10 dígitos.','It must be 10 digits.'],
    email: ['Revisa tu correo (ej. tu@correo.com).','Check your email (e.g. you@mail.com).']
  };
  function fieldMsg(el, text){
    var m = el.parentNode.querySelector('.f-msg');
    if(!text){ if(m) m.remove(); return; }
    if(!m){ m = document.createElement('span'); m.className = 'f-msg'; el.insertAdjacentElement('afterend', m); }
    m.textContent = text;
  }
  function validate(el, type, required, show){
    var v = el.value;
    if(!v.trim()){
      el.classList.remove('f-ok','f-bad'); el.removeAttribute('aria-invalid');
      if(required && show){ el.classList.add('f-bad'); el.setAttribute('aria-invalid','true'); fieldMsg(el, t('Este campo es obligatorio.','This field is required.')); return false; }
      fieldMsg(el,''); return !required;
    }
    if(RULES[type](v)){ el.classList.add('f-ok'); el.classList.remove('f-bad'); el.removeAttribute('aria-invalid'); fieldMsg(el,''); return true; }
    el.classList.remove('f-ok');
    if(show){ el.classList.add('f-bad'); el.setAttribute('aria-invalid','true'); fieldMsg(el, t(MSG[type][0], MSG[type][1])); }
    return false;
  }
  /* [id, regla, obligatorio] */
  var FIELDS = [['wfName','name',true],['wfPhone','tel',false],['wfEmail','email',true],
                ['cNombre','name',true],['cTel','tel',true],['cEmail','email',false],
                ['wlName','name',true],['wlEmail','email',true]];
  FIELDS.forEach(function(f){
    var el = document.getElementById(f[0]); if(!el) return;
    var touched = false;
    el.addEventListener('input', function(){ validate(el, f[1], f[2], touched); });
    el.addEventListener('blur', function(){ touched = true; validate(el, f[1], f[2], true); });
  });
  function checkAll(ids){
    var ok = true, first = null;
    FIELDS.forEach(function(f){
      if(ids.indexOf(f[0]) < 0) return;
      var el = document.getElementById(f[0]); if(!el) return;
      if(!validate(el, f[1], f[2], true)){ ok = false; if(!first) first = el; }
    });
    if(first) first.focus();
    return ok;
  }
  function isBot(form){ var hp = form.querySelector('input[name=website]'); return hp && hp.value.trim() !== ''; }
  function consentOk(form, statusEl){
    var c = form.querySelector('input[name=consentimiento]');
    if(c && !c.checked){ setStatus(statusEl, 'err', t('Para continuar, acepta el Aviso de Privacidad.','Please accept the Privacy Notice to continue.')); c.focus(); return false; }
    return true;
  }

  /* ---------- Carreras (nombres) ---------- */
  var CAREERS = {
    isc:['Ingeniería en Sistemas Computacionales','Computer Systems Engineering'],
    adm:['Administración de Empresas','Business Administration'],
    der:['Derecho','Law'],
    psi:['Psicología','Psychology'],
    mkt:['Mercadotecnia Digital','Digital Marketing'],
    con:['Contaduría Pública','Public Accounting'],
    otra:['Otra carrera (lista de espera)','Another program (waiting list)']
  };
  function careerName(k){ var c = CAREERS[k]; return c ? t(c[0], c[1]) : (k || ''); }

  /* ---------- Formulario de contacto / inscripción ---------- */
  (function(){
    var form = $('#contactForm'); if(!form) return;
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(isBot(form)) return;
      if(!checkAll(['cNombre','cTel','cEmail'])){ setStatus(status,'err',t('Revisa los campos marcados.','Please check the highlighted fields.')); return; }
      if(!consentOk(form, status)) return;
      UPD.deliver(t('contacto','contact'), {
        nombre: $('#cNombre').value.trim(),
        whatsapp: $('#cTel').value.replace(/\D/g,''),
        correo: $('#cEmail').value.trim(),
        programa: careerName($('#cProg').value),
        mensaje: $('#cMsg').value.trim()
      }, status);
    });
    /* Botones "Inscríbete": preseleccionan ISC y, si aplica, el plan. */
    $$('[data-prog]').forEach(function(b){
      b.addEventListener('click', function(){
        var sel = $('#cProg'); if(sel) sel.value = b.getAttribute('data-prog');
        var plan = b.getAttribute('data-plan'), msg = $('#cMsg');
        if(plan && msg && !msg.value) msg.value = t('Me interesa el plan ' + plan + '.', 'I am interested in the ' + plan + ' plan.');
      });
    });
  })();

  /* ---------- Lista de espera ---------- */
  (function(){
    var form = $('#waitForm'); if(!form) return;
    var status = form.querySelector('.form-status');
    $$('[data-wait]').forEach(function(b){
      b.addEventListener('click', function(){
        $('#wlProg').value = b.getAttribute('data-wait');
        var box = $('#lista-espera');
        box.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'center'});
        setTimeout(function(){ $('#wlName').focus({preventScroll:true}); }, 350);
      });
    });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(isBot(form)) return;
      var ok = checkAll(['wlName','wlEmail']);
      if(!$('#wlProg').value){ ok = false; setStatus(status,'err',t('Elige la carrera que te interesa.','Choose the program you are interested in.')); $('#wlProg').focus(); return; }
      if(!ok){ setStatus(status,'err',t('Revisa los campos marcados.','Please check the highlighted fields.')); return; }
      if(!consentOk(form, status)) return;
      UPD.deliver(t('lista de espera','waiting list'), {
        nombre: $('#wlName').value.trim(), correo: $('#wlEmail').value.trim(), carrera: careerName($('#wlProg').value)
      }, status);
    });
  })();

  /* ---------- Test vocacional ---------- */
  (function(){
    var root = $('#orientacion'); if(!root || !$('#wizS1')) return;
    var state = {s1:null,s2:null,s3:null,s4:null,start:Date.now()};
    var mA = 0, mB = 0;
    var SIT = {fresh:['Recién egresado de bachillerato','Recent high-school graduate'],job:['Trabaja y quiere crecer','Works and wants to grow'],change:['Quiere cambiar de área','Wants to change careers'],biz:['Tiene un negocio','Owns a business']};
    var START = {now:['Lo antes posible','As soon as possible'],soon:['En 1 a 3 meses','In 1 to 3 months'],eval:['Evaluando','Evaluating']};
    function setMath(){
      mA = Math.floor(Math.random()*9)+1; mB = Math.floor(Math.random()*9)+1;
      $('#wizMathQ').textContent = t('¿Cuánto es ','How much is ') + mA + ' + ' + mB + '?';
      $('#wizMathA').value = '';
    }
    function goTo(n){
      $$('.wiz-screen', root).forEach(function(s){ s.classList.remove('active'); });
      var sc = $('#wizS'+n, root); if(sc) sc.classList.add('active');
      var bar = $('#wizBar'), lbl = $('#wizLabel');
      if(n <= 4){ bar.style.width = ((n-1)/4*100) + '%'; lbl.textContent = t('Paso ','Step ') + n + t(' de 4',' of 4'); }
      else { bar.style.width = '100%'; lbl.textContent = t('Resultado','Result'); }
      var focusEl = sc && sc.querySelector('.wiz-q, .wiz-result b');
      if(focusEl && n > 1){ focusEl.setAttribute('tabindex','-1'); focusEl.focus({preventScroll:true}); }
    }
    function isOpen(){ return state.s2 === 'isc'; }
    function plan(){ return state.s3 === 'pause' ? t('Flexible (pausa y retoma)','Flexible (pause & resume)') : t('Estándar','Standard'); }
    function renderResult(){
      $('#wizResTitle').textContent = careerName(state.s2 || 'isc');
      if(isOpen()){
        $('#wizResText').textContent = t('Inscripciones abiertas — RVOE en trámite. Plan sugerido: ','Enrollment open — RVOE in process. Suggested plan: ') + plan() + ' · $2,650 MXN/' + t('mes','month') + '.';
        $('#wizSubmit').textContent = t('Quiero inscribirme','I want to enroll');
      } else {
        $('#wizResText').textContent = t('Esta carrera aún no abre inscripciones ni tiene solicitud de RVOE. Te anotamos en su lista de espera y te avisamos si abre.','This program is not open yet and has no accreditation request. We will add you to its waiting list and let you know if it opens.');
        $('#wizSubmit').textContent = t('Unirme a la lista de espera','Join the waiting list');
      }
    }
    ['s1','s2','s3','s4'].forEach(function(k, i){
      $$('[data-'+k+']', root).forEach(function(btn){
        btn.addEventListener('click', function(){
          state[k] = btn.getAttribute('data-'+k);
          if(i < 3) goTo(i+2); else { renderResult(); setMath(); goTo(5); }
        });
      });
    });
    $$('.wiz-back', root).forEach(function(b){ b.addEventListener('click', function(){ goTo(+b.getAttribute('data-to')); }); });
    document.addEventListener('updlang', function(){
      var active = $('.wiz-screen.active', root);
      if(active && active.id === 'wizS5'){ renderResult(); setMath(); goTo(5); }
      else if(active){ goTo(+active.id.replace('wizS','')); }
    });
    var form = $('#wizForm'), status = $('#wizStatus');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(isBot(form)) return;
      if(Date.now() - state.start < 3000){ setStatus(status,'err',t('Por favor completa el formulario con calma.','Please take a moment to complete the form.')); return; }
      if(!checkAll(['wfName','wfPhone','wfEmail'])){ setStatus(status,'err',t('Revisa los campos marcados.','Please check the highlighted fields.')); return; }
      var ans = parseInt($('#wizMathA').value, 10);
      if(isNaN(ans) || ans !== mA + mB){ setStatus(status,'err',t('La suma no es correcta. Intenta de nuevo.','The sum is not correct. Try again.')); setMath(); $('#wizMathA').focus(); return; }
      if(!consentOk(form, status)) return;
      var s1 = SIT[state.s1], s4 = START[state.s4];
      UPD.deliver(isOpen() ? t('test vocacional','career test') : t('test vocacional · lista de espera','career test · waiting list'), {
        nombre: $('#wfName').value.trim(),
        whatsapp: $('#wfPhone').value.replace(/\D/g,''),
        correo: $('#wfEmail').value.trim(),
        carrera: careerName(state.s2),
        plan: isOpen() ? plan() : '',
        situacion: s1 ? t(s1[0], s1[1]) : '',
        inicio: s4 ? t(s4[0], s4[1]) : ''
      }, status);
    });
  })();

  /* ---------- Calculadora (solo plan Estándar) ---------- */
  (function(){
    var beca = $('#calcBeca'); if(!beca) return;
    var MONTHLY = 2650, MONTHS = 36;
    function fmt(n){ return '$' + Math.round(n).toLocaleString('en-US'); }
    function render(){
      var b = (+beca.value)/100;
      $('#calcBecaVal').textContent = beca.value + '%';
      $('#calcMonthly').textContent = fmt(MONTHLY*(1-b));
      $('#calcTotal').textContent = fmt(MONTHLY*MONTHS*(1-b));
      $('#calcSave').textContent = fmt(MONTHLY*MONTHS*b);
      beca.setAttribute('aria-valuetext', beca.value + '%');
    }
    beca.addEventListener('input', render);
    $$('#tlTrack span').forEach(function(s){ s.classList.add('on'); });
    render();
  })();

  /* ---------- Descarga del plan de estudios ---------- */
  $$('[data-plan-download]').forEach(function(a){
    var note = document.getElementById(a.getAttribute('aria-describedby') || '');
    if(PLAN_ISC_URL){ a.href = PLAN_ISC_URL; a.setAttribute('download',''); if(note) note.hidden = true; return; }
    a.setAttribute('aria-disabled','true');
    a.addEventListener('click', function(e){ e.preventDefault(); if(note){ note.hidden = false; note.classList.add('show'); } });
  });

  /* ---------- WhatsApp directo y CTA móvil ---------- */
  (function(){
    var wa = $('#waDirect'), txt = $('#waDirectTxt');
    function sync(){
      if(!wa) return;
      if(UPD.waReady()){
        wa.href = UPD.waLink(t('¡Hola! Quiero información sobre Ingeniería en Sistemas Computacionales en la UPD.','Hi! I would like information about Computer Systems Engineering at UPD.'));
        wa.target = '_blank'; wa.rel = 'noopener';
      } else {
        wa.href = 'mailto:' + CONTACT_EMAIL;
        if(txt) txt.textContent = t('Disponible pronto · mientras, escríbenos por correo','Coming soon · meanwhile, email us');
      }
    }
    sync(); document.addEventListener('updlang', sync);
  })();
  (function(){
    var bar = $('#mcta'); if(!bar || !('IntersectionObserver' in window)) return;
    var hero = $('.hero, .page-hero'), ends = $$('#contacto, #orientacion, .finalcta');
    var past = false, flags = ends.map(function(){ return false; });
    function sync(){ var show = past && !flags.some(Boolean); bar.classList.toggle('show', show); document.body.classList.toggle('mcta-on', show); }
    if(hero) new IntersectionObserver(function(en){ en.forEach(function(x){ past = !x.isIntersecting; }); sync(); }).observe(hero); else past = true;
    if(ends.length){
      var io = new IntersectionObserver(function(en){ en.forEach(function(x){ var i = ends.indexOf(x.target); if(i > -1) flags[i] = x.isIntersecting; }); sync(); });
      ends.forEach(function(e){ io.observe(e); });
    }
  })();

  /* ---------- Menú móvil ---------- */
  (function(){
    var toggle = $('#navToggle'), nav = $('#nav'); if(!toggle || !nav) return;
    function set(open){ nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? t('Cerrar menú','Close menu') : t('Abrir menú','Open menu')); }
    toggle.addEventListener('click', function(){ set(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function(a){ a.addEventListener('click', function(){ set(false); }); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && nav.classList.contains('open')){ set(false); toggle.focus(); } });
  })();

  /* ---------- Carrusel del hero (pausa accesible) ---------- */
  (function(){
    var car = $('#heroCarousel'); if(!car) return;
    var slides = $$('.hslide', car), dotsWrap = $('#heroDots'), n = slides.length, idx = 0, timer = null, paused = false;
    slides.forEach(function(_, i){
      var b = document.createElement('button'); b.type = 'button';
      if(i === 0) b.className = 'active';
      b.setAttribute('aria-label', 'Imagen ' + (i+1));
      b.addEventListener('click', function(){ go(i); start(); });
      dotsWrap.appendChild(b);
    });
    var dots = $$('button', dotsWrap);
    function go(i){ slides[idx].classList.remove('active'); dots[idx].classList.remove('active'); idx = i; slides[idx].classList.add('active'); dots[idx].classList.add('active'); }
    function start(){ clearInterval(timer); if(!paused) timer = setInterval(function(){ go((idx+1)%n); }, 5000); }
    var pbtn = $('#heroPause');
    function setPaused(p){
      paused = p; clearInterval(timer); if(!p) start();
      if(!pbtn) return;
      pbtn.setAttribute('aria-pressed', String(p));
      pbtn.innerHTML = p ? '<i class="ph-duotone ph-play" aria-hidden="true"></i>' : '<i class="ph-duotone ph-pause" aria-hidden="true"></i>';
      pbtn.setAttribute('aria-label', p ? t('Reanudar carrusel','Resume carousel') : t('Pausar carrusel','Pause carousel'));
    }
    if(pbtn) pbtn.addEventListener('click', function(){ setPaused(!paused); });
    document.addEventListener('updlang', function(){ setPaused(paused); });
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true); else start();
  })();

  /* ---------- i18n ES/EN ---------- */
  (function(){
    var KEY = 'upd_lang';
    function apply(lang){
      UPD.lang = lang;
      document.documentElement.lang = lang;
      $$('[data-en]').forEach(function(el){
        if(el.dataset.es === undefined) el.dataset.es = el.textContent;
        el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.dataset.es;
      });
      $$('[data-en-html]').forEach(function(el){
        if(el.dataset.esHtml === undefined) el.dataset.esHtml = el.innerHTML;
        el.innerHTML = lang === 'en' ? el.getAttribute('data-en-html') : el.dataset.esHtml;
      });
      $$('[data-en-aria]').forEach(function(el){
        if(el.dataset.esAria === undefined) el.dataset.esAria = el.getAttribute('aria-label') || '';
        el.setAttribute('aria-label', lang === 'en' ? el.getAttribute('data-en-aria') : el.dataset.esAria);
      });
      $$('#langBtn span[data-l]').forEach(function(s){ s.classList.toggle('on', s.getAttribute('data-l') === lang); });
      try{ localStorage.setItem(KEY, lang); }catch(e){}
      document.dispatchEvent(new CustomEvent('updlang', {detail:lang}));
    }
    UPD.setLang = apply;
    var btn = $('#langBtn');
    if(!btn){ UPD.lang = 'es'; return; } /* página solo en español (p. ej. aviso de privacidad) */
    btn.addEventListener('click', function(){ apply(UPD.lang === 'en' ? 'es' : 'en'); });
    var saved = 'es'; try{ saved = localStorage.getItem(KEY) || 'es'; }catch(e){}
    apply(saved === 'en' ? 'en' : 'es');
  })();

  /* ---------- Aparición al hacer scroll ---------- */
  (function(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    var els = $$('.sec-head, .status, .isc, .soon, .waitlist, .plans, .calc, .rules, .wizard-layout, .mv, .values, .faq, .contact, .finalcta');
    var io = new IntersectionObserver(function(en){
      en.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } });
    }, {threshold:.08, rootMargin:'0px 0px -5% 0px'});
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < innerHeight) return; /* lo que ya se ve no se oculta */
      el.classList.add('rv'); io.observe(el);
    });
  })();
})();

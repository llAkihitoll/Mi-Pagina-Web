'use strict';

/* =============================================
   DEFAULT CONFIG
   ============================================= */
const defaultConfig = {
  hero_name:         'Saúl',
  hero_title:        'Líder & Profesional',
  hero_tagline:      '"Disciplina, esfuerzo y liderazgo para alcanzar metas reales."',
  welcome_text:      'Bienvenido a mi espacio digital',
  profile_image_url: '',
  about_text:        'Soy una persona comprometida con la excelencia y el crecimiento continuo. Mi objetivo es ser reconocido como alguien que lidera con el ejemplo, demostrando que con disciplina, esfuerzo y determinación, cualquier meta es alcanzable.',
  about_image_url:   '',
  strengths:         'Liderazgo, Disciplina, Aprendizaje, Integridad, Empatía, Determinación',
  blog_title:        'Cómo construir una marca personal sólida: 3 arquetipos que definen mi liderazgo profesional',
  blog_intro:        'Escribes en Google: "marca personal liderazgo con disciplina y esfuerzo". Lo que quiero que encuentres no es un discurso motivacional. Es coherencia.',
  blog_content:      '',
  blog_conclusion:   '¿Tu identidad profesional refleja realmente tus valores? Si la respuesta no es clara, comienza hoy. Define tus principios. Documenta tu proceso. Lidera con acciones.',
  contact_email:     'cas248915@uvg.edu.gt',
  contact_phone:     '+502 5986 4340',
  primary_color:     '#e53e3e',
  secondary_color:   '#0a0f1e',
  text_color:        '#f0f4f8',
  accent_color:      '#1e293b',
  surface_color:     '#040b14',
  font_family:       'Poppins',
  font_size:         16,
};

/* =============================================
   STATE
   ============================================= */
let currentPage = 'home';
const PAGES = ['home', 'about', 'blog', 'portafolio', 'contacto'];
let revealObserver = null;

/* =============================================
   LOADER
   ============================================= */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('hidden');
    revealSection('home');
    animateCounters();
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 700);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 500));
  }
}

/* =============================================
   NAVIGATION
   ============================================= */
function navigateTo(page) {
  if (!PAGES.includes(page) || page === currentPage) return;

  PAGES.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('page-visible', 'page-entering'); el.classList.add('page-hidden'); }
  });

  const target = document.getElementById(page);
  if (!target) return;

  target.classList.remove('page-hidden');
  void target.offsetWidth;
  target.classList.add('page-visible', 'page-entering');

  document.querySelectorAll('[data-section]').forEach(link =>
    link.classList.toggle('active', link.dataset.section === page)
  );

  currentPage = page;
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateReadingProgress();
  updateBackToTop();
  revealSection(page);

  if (page === 'home') animateCounters();
}

/* =============================================
   REVEAL ANIMATIONS
   ============================================= */
function initRevealObserver() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
}

function revealSection(pageId) {
  const section = document.getElementById(pageId);
  if (!section || !revealObserver) return;

  section.querySelectorAll('.reveal-item').forEach((el, i) => {
    el.classList.remove('revealed');
    el.style.transitionDelay = `${i * 0.07}s`;
    void el.offsetWidth;
    revealObserver.observe(el);
  });
}

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const dur    = 1000;
    const t0     = performance.now();

    const step = (now) => {
      const p   = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(easeOutExpo(p) * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/* =============================================
   MOBILE MENU
   ============================================= */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger-btn');
  if (!menu || !btn) return;
  const open = menu.classList.toggle('open');
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden',  String(!open));
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger-btn');
  if (!menu || !btn) return;
  menu.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden',  'true');
}

/* =============================================
   SCROLL EFFECTS
   ============================================= */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 24);
    updateReadingProgress();
    updateBackToTop();
  }, { passive: true });
}

function updateReadingProgress() {
  const bar   = document.getElementById('reading-progress');
  if (!bar) return;
  const doc   = document.documentElement;
  const pct   = doc.scrollHeight <= doc.clientHeight ? 0
    : (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
  bar.style.width = `${Math.min(pct, 100)}%`;
}

function updateBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 300);
}

/* =============================================
   CONTACT FORM
   ============================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('#form-name').value.trim();
    const email   = form.querySelector('#form-email').value.trim();
    const message = form.querySelector('#form-message').value.trim();

    if (!name || !email || !message) {
      showToast('Por favor, completa todos los campos.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Correo electrónico inválido.', 'error');
      return;
    }

    const dest = document.getElementById('contact-email')?.textContent ?? defaultConfig.contact_email;
    const body = `Nombre: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${dest}?subject=${encodeURIComponent(`Contacto — ${name}`)}&body=${encodeURIComponent(body)}`;
    form.reset();
    showToast('¡Abriendo tu cliente de correo!', 'success');
  });
}

/* =============================================
   TOAST
   ============================================= */
function showToast(message, type = 'success') {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = `toast toast--${type}`;
  t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('visible'));
  setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 400); }, 3000);
}

/* =============================================
   SDK INTEGRATION
   ============================================= */
function onConfigChange(config) {
  const map = {
    'hero-name':       config.hero_name       || defaultConfig.hero_name,
    'hero-title':      config.hero_title      || defaultConfig.hero_title,
    'hero-tagline':    config.hero_tagline    || defaultConfig.hero_tagline,
    'welcome-text':    config.welcome_text    || defaultConfig.welcome_text,
    'about-text':      config.about_text      || defaultConfig.about_text,
    'blog-title':      config.blog_title      || defaultConfig.blog_title,
    'blog-intro':      config.blog_intro      || defaultConfig.blog_intro,
    'blog-conclusion': config.blog_conclusion || defaultConfig.blog_conclusion,
    'contact-phone':   config.contact_phone   || defaultConfig.contact_phone,
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  const email   = config.contact_email || defaultConfig.contact_email;
  const emailEl = document.getElementById('contact-email');
  if (emailEl) emailEl.textContent = email;
  const emailCard = document.getElementById('contact-email-card');
  if (emailCard) emailCard.href = `mailto:${email}`;

  const profileImg = document.getElementById('profile-image');
  if (profileImg && config.profile_image_url) profileImg.src = config.profile_image_url;
  const aboutImg = document.getElementById('about-image');
  if (aboutImg && config.about_image_url) aboutImg.src = config.about_image_url;

  const primary = config.primary_color || defaultConfig.primary_color;
  document.documentElement.style.setProperty('--c-red', primary);

  const font = config.font_family || defaultConfig.font_family;
  document.body.style.fontFamily = `'${font}', system-ui, sans-serif`;

  const size = Number(config.font_size) || defaultConfig.font_size;
  document.documentElement.style.fontSize = `${size}px`;
}

function mapToCapabilities(config) {
  const mkR = key => ({
    get:  ()  => config[key] || defaultConfig[key],
    set: val  => { config[key] = val; window.elementSdk.setConfig({ [key]: val }); },
  });
  return {
    recolorables: ['surface_color','secondary_color','text_color','primary_color','accent_color'].map(mkR),
    borderables:  [],
    fontEditable: {
      get:  ()  => config.font_family || defaultConfig.font_family,
      set: val  => { config.font_family = val; window.elementSdk.setConfig({ font_family: val }); },
    },
    fontSizeable: {
      get:  ()  => config.font_size || defaultConfig.font_size,
      set: val  => { config.font_size = val; window.elementSdk.setConfig({ font_size: val }); },
    },
  };
}

function mapToEditPanelValues(config) {
  const keys = [
    'hero_name','hero_title','hero_tagline','welcome_text',
    'profile_image_url','about_text','about_image_url','strengths',
    'blog_title','blog_intro','blog_content','blog_conclusion',
    'contact_email','contact_phone',
  ];
  return new Map(keys.map(k => [k, config[k] || defaultConfig[k]]));
}

/* =============================================
   KEYBOARD NAVIGATION
   ============================================= */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
    if (e.altKey) {
      const i = PAGES.indexOf(currentPage);
      if (e.key === 'ArrowRight' && i < PAGES.length - 1) navigateTo(PAGES[i + 1]);
      if (e.key === 'ArrowLeft'  && i > 0)                navigateTo(PAGES[i - 1]);
    }
  });
}

/* =============================================
   WIRE EVENTS
   ============================================= */
function initEvents() {
  // data-nav buttons (section navigation)
  document.querySelectorAll('[data-nav]').forEach(el =>
    el.addEventListener('click', () => navigateTo(el.dataset.nav))
  );

  // data-section nav links
  document.querySelectorAll('[data-section]').forEach(link =>
    link.addEventListener('click', e => { e.preventDefault(); navigateTo(link.dataset.section); })
  );

  // Hamburger
  document.getElementById('hamburger-btn')?.addEventListener('click', toggleMobileMenu);

  // Back to top
  document.getElementById('back-to-top')?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* =============================================
   BOOT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initRevealObserver();
  initEvents();
  initScrollEffects();
  initContactForm();
  initKeyboard();
  initLoader();

  if (window.elementSdk) {
    window.elementSdk.init({ defaultConfig, onConfigChange, mapToCapabilities, mapToEditPanelValues });
  }
});

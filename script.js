// ---- theme toggle ----
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
});

function updateThemeIcon() {
  themeToggle.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
}

// ---- mobile nav ----
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ---- scroll progress bar ----
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ---- scrollspy nav highlight ----
const sections = [...document.querySelectorAll('main section, .hero, .footer')];
const navAnchors = [...navLinks.querySelectorAll('a')];
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => s.id && spyObserver.observe(s));

// ---- reveal on scroll ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- animated stat counters ----
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ---- rotation tabs ----
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// ---- skills data + filter ----
const SKILLS = [
  ['CBC / differential', 'technique'], ['Urinalysis', 'technique'], ['Flow cytometry', 'technique'],
  ['Coagulation', 'technique'], ['Immunohematology', 'technique'], ['DAT / IAT', 'technique'],
  ['Blood product issuing', 'technique'], ['Gram stain', 'technique'], ['Culture & susceptibility', 'technique'],
  ['MALDI-TOF ID', 'technique'], ['Molecular diagnostics', 'technique'], ['Chemistry panels', 'technique'],
  ['LC-MS', 'technique'], ['Venipuncture', 'technique'],
  ['Sysmex XN-3100', 'instrument'], ['SQA-Vision', 'instrument'], ['BD FACSLyric', 'instrument'],
  ['ACL TOP 350', 'instrument'], ['Clinitek Novus', 'instrument'], ['Sysmex UF-5000 / UD-10', 'instrument'],
  ['Immucor', 'instrument'], ['Vitros 5600', 'instrument'], ['MicroScan WalkAway', 'instrument'],
  ['MALDI-TOF', 'instrument'], ['Panther', 'instrument'], ['GeneXpert', 'instrument'], ['BD MAX', 'instrument'],
  ['BACTEC FX', 'instrument'], ['Waters LC-MS', 'instrument'], ['Tecan', 'instrument'],
  ['Westgard rules', 'quality'], ['Delta checks', 'quality'], ['QA / QC', 'quality'],
  ['Instrument maintenance', 'quality'], ['Reagent management', 'quality'], ['AABB', 'quality'],
  ['CAP', 'quality'], ['CLSI', 'quality'], ['OSHA', 'quality'], ['SOP adherence', 'quality'],
  ['Assay validation principles', 'quality'],
];

const skillCloud = document.getElementById('skillCloud');
skillCloud.innerHTML = SKILLS.map(([name, cat]) =>
  `<span class="skill-pill" data-cat="${cat}">${name}</span>`
).join('');

document.getElementById('skillFilters').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-chip');
  if (!btn) return;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.classList.toggle('hidden', filter !== 'all' && pill.dataset.cat !== filter);
  });
});

// ---- copy to clipboard ----
const toast = document.getElementById('copyToast');
let toastTimer;
document.querySelectorAll('.contact-card[data-copy]').forEach(card => {
  card.addEventListener('click', async () => {
    const value = card.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast.textContent = `Copied "${value}" ✓`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  });
});

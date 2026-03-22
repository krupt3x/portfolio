const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

function updateScrollProgress() {
    const progressEl = document.querySelector('.scroll-progress');
    if (!progressEl) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressEl.style.height = `${percent}%`;
    const indicator = document.querySelector('.scroll-indicator');
    const scrollSectionColors = {
        home: {dot: 'linear-gradient(45deg, #23e7ff, #5ce7ff)', shadow: 'rgba(60, 248, 255, 0.8)'},
        about: {dot: 'linear-gradient(45deg, #ff72d3, #ffbd5b)', shadow: 'rgba(255, 130, 140, 0.8)'},
        projects: {dot: 'linear-gradient(45deg, #6fff6f, #33e1ff)', shadow: 'rgba(100, 255, 200, 0.85)'},
        contact: {dot: 'linear-gradient(45deg, #d36bff, #8ce8ff)', shadow: 'rgba(165, 110, 255, 0.9)'},
        default: {dot: 'linear-gradient(45deg, #23e7ff, #5ce7ff)', shadow: 'rgba(60, 248, 255, 0.8)'}
    };

    if (indicator) {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const scrollPos = window.pageYOffset + window.innerHeight * 0.4;
        let active = 'home';

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const top = window.pageYOffset + rect.top;
            const bottom = top + rect.height;
            if (scrollPos >= top && scrollPos < bottom) {
                active = section.id || active;
            }
        });

        const sectionColor = scrollSectionColors[active] || scrollSectionColors.default;
        indicator.style.setProperty('--scroll-dot', sectionColor.dot);
        indicator.style.setProperty('--scroll-dot-shadow', sectionColor.shadow);
    }
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// Eye interaction with pointer and idle tears
const eye = document.querySelector('.eye');
const iris = document.querySelector('.iris');
const tears = document.querySelector('.tears');

let lastMouseMove = Date.now();
let idleTimer = null;
let tearInterval = null;
let isIdle = false;

function createTear() {
  if (!tears) return;

  const tear = document.createElement('span');
  tear.className = 'tear';
  const startX = 40 + Math.random() * 20 - 10;
  tear.style.left = `${startX}px`;
  tear.style.animationDuration = `${1.2 + Math.random() * 0.65}s`;

  tears.appendChild(tear);
  setTimeout(() => {
    tear.remove();
  }, 1400);
}

function startTears() {
  if (tearInterval) return;
  if (tears) tears.innerHTML = '';
  tearInterval = setInterval(createTear, 280);
}

function stopTears() {
  clearInterval(tearInterval);
  tearInterval = null;
  if (tears) tears.innerHTML = '';
}

function blink() {
  if (!eye) return;
  eye.classList.add('blinking');
  setTimeout(() => {
    eye.classList.remove('blinking');
  }, 250);
}

function setEyeIdle(state) {
  if (!eye) return;
  isIdle = state;
  if (isIdle) {
    blink();
    startTears();
  } else {
    stopTears();
  }
}

function updateEyePosition(event) {
  if (!eye || !iris) return;

  const eyeRect = eye.getBoundingClientRect();
  const centerX = eyeRect.left + eyeRect.width / 2;
  const centerY = eyeRect.top + eyeRect.height / 2;

  const deltaX = event.clientX - centerX;
  const deltaY = event.clientY - centerY;

  const maxDistance = 30;
  const distance = Math.min(maxDistance, Math.hypot(deltaX, deltaY));
  const angle = Math.atan2(deltaY, deltaX);

  const moveX = Math.cos(angle) * distance;
  const moveY = Math.sin(angle) * distance;

  iris.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

function handleMouseMove(event) {
  lastMouseMove = Date.now();
  if (isIdle) {
    setEyeIdle(false);
  }

  updateEyePosition(event);

  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  idleTimer = setTimeout(() => {
    setEyeIdle(true);
  }, 1500);
}

window.addEventListener('mousemove', handleMouseMove);

setTimeout(() => {
  idleTimer = setTimeout(() => {
    setEyeIdle(true);
  }, 1500);
}, 500);


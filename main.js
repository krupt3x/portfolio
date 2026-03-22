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

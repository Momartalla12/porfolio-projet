/**
 * Portfolio — interactions & performance
 * Module Dev Web Frontend — Évaluation N°1
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function onScroll() {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  let scrollTicking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          onScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  function toggleMenu(open) {
    const isOpen = open ?? mobileMenu?.classList.contains('hidden');
    mobileMenu?.classList.toggle('hidden', !isOpen);
    iconOpen?.classList.toggle('hidden', isOpen);
    iconClose?.classList.toggle('hidden', !isOpen);
    menuBtn?.setAttribute('aria-expanded', String(isOpen));
    mobileMenu?.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuBtn?.addEventListener('click', () => toggleMenu());

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active', 'text-white');
        link.classList.remove('text-muted');
      } else if (link.classList.contains('nav-link')) {
        link.classList.remove('active', 'text-white');
        link.classList.add('text-muted');
      }
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  const skillBars = document.querySelectorAll('.skill-bar');
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          if (width) {
            bar.style.setProperty('--bar-width', `${width}%`);
            bar.classList.add('animated');
          }
          barObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );
  skillBars.forEach((bar) => barObserver.observe(bar));

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      showFeedback('Veuillez remplir tous les champs.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Adresse email invalide.', 'error');
      return;
    }

    const subject = encodeURIComponent(`Contact portfolio — ${name}`);
    const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:votre.email@exemple.com?subject=${subject}&body=${body}`;

    showFeedback('Ouverture de votre client mail…', 'success');
    contactForm.reset();
  });

  function showFeedback(text, type) {
    if (!formFeedback) return;
    formFeedback.textContent = text;
    formFeedback.classList.remove('hidden', 'text-red-400', 'text-green-400');
    formFeedback.classList.add(type === 'error' ? 'text-red-400' : 'text-green-400');
  }
})();

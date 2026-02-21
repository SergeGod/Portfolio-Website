'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSmoothScroll();
  initMobileMenu();
  initBackToTop();
  initGpaAnimations();
  lucide.createIcons();
});

// ===== NAV: scrolled class + active links =====
function initNav() {
  const nav = document.querySelector('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Scrolled class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile menu if open
      closeMobileMenu();

      const navHeight = document.querySelector('nav').offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

// ===== MOBILE MENU =====
let mobileMenuOpen = false;

function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const overlay = document.getElementById('nav-mobile-overlay');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    mobileMenuOpen ? closeMobileMenu() : openMobileMenu();
  });
}

function openMobileMenu() {
  mobileMenuOpen = true;
  const hamburger = document.getElementById('nav-hamburger');
  const overlay = document.getElementById('nav-mobile-overlay');
  hamburger.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenuOpen = false;
  const hamburger = document.getElementById('nav-hamburger');
  const overlay = document.getElementById('nav-mobile-overlay');
  if (!hamburger || !overlay) return;
  hamburger.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== GPA BAR ANIMATIONS =====
function initGpaAnimations() {
  const bars = document.querySelectorAll('.gpa-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        // Small delay to ensure transition is visible
        setTimeout(() => {
          bar.style.width = bar.dataset.width;
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

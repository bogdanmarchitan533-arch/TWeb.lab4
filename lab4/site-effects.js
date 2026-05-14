/**
 * Efecte vizuale comune (Lab 3): apariție la scroll, header la derulare, micro-interacțiuni.
 */
(function () {
  'use strict';

  var header = document.querySelector('header');
  var observed = new WeakSet();

  function onHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { root: null, rootMargin: '0px 0px 80px 0px', threshold: 0.04 }
  );

  function markRevealable(el) {
    if (!el || observed.has(el)) return;
    el.classList.add('fx-reveal');
    io.observe(el);
    observed.set(el, true);
  }

  function defaultTargets() {
    return document.querySelectorAll(
      '.stat, .step-mini, .section-title, .steps-teaser, .page-hero, .filter-bar, ' +
        '.contact-hero, .contact-card, .map-placeholder, .contact-form-box, ' +
        '.step, .req-card, .cum-hero, .rezervare-wrapper, .car-detail-grid > *, ' +
        '.not-found, .car-card, .faq-item, .hero-text, .hero-image'
    );
  }

  function refreshReveal() {
    defaultTargets().forEach(markRevealable);
  }

  document.addEventListener('carsrendered', refreshReveal);

  document.addEventListener('DOMContentLoaded', function () {
    var logo = document.querySelector('.logo');
    refreshReveal();
    onHeaderScroll();
    window.addEventListener('scroll', onHeaderScroll, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var t = document.getElementById(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    if (logo) {
      logo.addEventListener('mouseenter', function () {
        logo.classList.remove('logo-pulse');
        void logo.offsetWidth;
        logo.classList.add('logo-pulse');
      });
    }
  });

  window.fxRevealRefresh = refreshReveal;
})();

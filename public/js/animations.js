/* ============================================
   ANIMATIONS.JS - St. Gonsalo Garcia College
   Lag-Free, High-Performance Interactive System
   ============================================ */

(function() {
  'use strict';

  // ===== SCROLL PROGRESS =====
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var scrollTop = window.scrollY || document.documentElement.scrollTop;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ===== HEADER SCROLL EFFECT =====
  function initHeaderEffects() {
    var header = document.querySelector('.header');
    if (!header) return;
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var scrollY = window.scrollY || document.documentElement.scrollTop;
          if (scrollY > 40) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ===== REVEAL ALL IMMEDIATELY (ZERO WAIT) =====
  function initRevealAnimations() {
    var elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-stagger');
    elements.forEach(function(el) {
      el.classList.add('reveal-visible');
    });
  }

  // ===== ANIMATED COUNTERS =====
  function initCounters() {
    var counterElements = document.querySelectorAll('.counter, .stat-number');
    if (!counterElements.length) return;

    if (typeof IntersectionObserver === 'undefined') {
      counterElements.forEach(function(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        if (target > 0) el.textContent = target.toLocaleString('en-IN');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10) || 0;
          if (target > 0) {
            el.textContent = target.toLocaleString('en-IN');
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    counterElements.forEach(function(el) { observer.observe(el); });
  }

  // ===== IMAGE LOADING (Instant & Clean) =====
  function initImageLoading() {
    document.querySelectorAll('img[data-src]').forEach(function(img) {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      img.classList.remove('image-blur-up');
      img.classList.add('loaded');
    });
  }

  // ===== IMAGE ERROR FALLBACK =====
  function initImageFallbacks() {
    var basePath = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/admin/') ? '../' : '';
    document.querySelectorAll('img').forEach(function(img) {
      img.addEventListener('error', function() {
        if (!this.getAttribute('data-fallback-tried')) {
          this.setAttribute('data-fallback-tried', 'true');
          this.src = basePath + 'images/banner-image-college.jpg';
        }
      });
    });
  }

  // ===== BACK TO TOP =====
  function initBackToTop() {
    var backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          if ((window.scrollY || document.documentElement.scrollTop) > 300) {
            backToTop.classList.add('visible');
          } else {
            backToTop.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== NOTICE TICKER =====
  function initNoticeTicker() {
    var ticker = document.querySelector('.notice-ticker');
    if (!ticker) return;
    var track = ticker.querySelector('.notice-ticker-track');
    if (!track) return;

    ticker.addEventListener('mouseenter', function() { track.style.animationPlayState = 'paused'; });
    ticker.addEventListener('mouseleave', function() { track.style.animationPlayState = 'running'; });
    ticker.addEventListener('focusin', function() { track.style.animationPlayState = 'paused'; });
    ticker.addEventListener('focusout', function() { track.style.animationPlayState = 'running'; });
  }

  // ===== SMOOTH SCROLL FOR ANCHORS =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (!href || href === '#' || href === '#main-content') return;
        try {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: top, behavior: 'smooth' });
          }
        } catch (err) {}
      });
    });
  }

  // ===== ACTIVE NAV LINK =====
  function initActiveNav() {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(function(link) {
      var href = (link.getAttribute('href') || '').split('/').pop();
      if (href && href === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // ===== INIT ON LOAD =====
  function init() {
    initScrollProgress();
    initHeaderEffects();
    initRevealAnimations();
    initCounters();
    initImageLoading();
    initImageFallbacks();
    initBackToTop();
    initNoticeTicker();
    initSmoothScroll();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

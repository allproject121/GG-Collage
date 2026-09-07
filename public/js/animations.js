/* ============================================
   ANIMATIONS.JS - GG College Premium
   Scroll Reveal, Counters, Header, Image Loading
   ============================================ */

(function() {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== SCROLL PROGRESS =====
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrollTop = window.scrollY;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          bar.style.width = progress + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ===== HEADER EFFECTS =====
  function initHeaderEffects() {
    var header = document.querySelector('.header');
    if (!header) return;
    var lastScrollY = 0;
    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrollY = window.scrollY;
          if (scrollY > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          lastScrollY = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ===== SCROLL REVEAL =====
  function initRevealAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-stagger').forEach(function(el) {
        el.classList.add('reveal-visible');
      });
      return;
    }

    var revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-stagger');

    if (!revealElements.length || typeof IntersectionObserver === 'undefined') {
      revealElements.forEach(function(el) { el.classList.add('reveal-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function(el) { observer.observe(el); });
  }

  // ===== ANIMATED COUNTERS =====
  function initCounters() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.counter, .stat-number').forEach(function(el) {
        var target = parseInt(el.getAttribute('data-count')) || 0;
        if (target > 0) el.textContent = target.toLocaleString();
      });
      return;
    }

    var counterElements = document.querySelectorAll('.counter, .stat-number');
    if (!counterElements.length || typeof IntersectionObserver === 'undefined') {
      counterElements.forEach(function(el) {
        var target = parseInt(el.getAttribute('data-count')) || 0;
        if (target > 0) el.textContent = target.toLocaleString();
      });
      return;
    }

    var animated = new Set();
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !animated.has(entry.target)) {
          animated.add(entry.target);
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count')) || 0;
          if (target > 0) animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(function(el) { observer.observe(el); });
  }

  function animateCounter(el, target) {
    var current = 0;
    var duration = 2000;
    var stepTime = 20;
    var steps = duration / stepTime;
    var increment = target / steps;
    var timer = setInterval(function() {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) {
        el.textContent = target.toLocaleString();
      }
    }, stepTime);
  }

  // ===== HERO ANIMATION =====
  function initHeroAnimation() {
    var heroAnimate = document.querySelector('.hero-animate');
    if (!heroAnimate) return;

    if (prefersReducedMotion) {
      heroAnimate.classList.add('hero-visible');
      return;
    }

    setTimeout(function() {
      heroAnimate.classList.add('hero-visible');
    }, 200);
  }

  // ===== IMAGE BLUR-UP LOADING =====
  function initImageLoading() {
    var blurImages = document.querySelectorAll('img.image-blur-up');
    if (!blurImages.length) return;

    if ('IntersectionObserver' in window) {
      var imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;

            function markLoaded() {
              img.classList.add('loaded');
              img.classList.remove('image-blur-up');
            }

            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }

            if (img.complete && img.naturalHeight > 0) {
              markLoaded();
            } else {
              img.addEventListener('load', markLoaded);
              img.addEventListener('error', function errHandler() {
                markLoaded();
                img.removeEventListener('error', errHandler);
              });
            }
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px 0px' });

      blurImages.forEach(function(img) { imageObserver.observe(img); });
    } else {
      blurImages.forEach(function(img) {
        img.classList.add('loaded');
        img.classList.remove('image-blur-up');
      });
    }
  }

  // ===== IMAGE ERROR FALLBACK =====
  function initImageFallbacks() {
    var basePath = '';
    var pathParts = window.location.pathname.split('/');
    if (pathParts.indexOf('pages') !== -1) {
      basePath = '../';
    }

    document.querySelectorAll('img').forEach(function(img) {
      img.addEventListener('error', function() {
        if (!this.getAttribute('data-fallback-tried')) {
          this.setAttribute('data-fallback-tried', 'true');
          this.src = basePath + 'images/image-fallback.svg';
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
        requestAnimationFrame(function() {
          if (window.scrollY > 400) {
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

    // Pause on hover
    ticker.addEventListener('mouseenter', function() {
      track.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', function() {
      track.style.animationPlayState = 'running';
    });

    // Keyboard support
    ticker.addEventListener('focusin', function() {
      track.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('focusout', function() {
      track.style.animationPlayState = 'running';
    });

    // Controls
    var prevBtn = ticker.querySelector('.ticker-prev');
    var nextBtn = ticker.querySelector('.ticker-next');
    var pauseBtn = ticker.querySelector('.ticker-pause');

    function getTranslateX(el) {
      var transform = window.getComputedStyle(el).transform;
      if (!transform || transform === 'none') return 0;
      var matrix = transform.match(/matrix\(([-\d.,\s]+)\)/);
      if (!matrix) return 0;
      return parseFloat(matrix[1].split(', ')[4]) || 0;
    }

    if (prevBtn) {
      prevBtn.setAttribute('aria-label', 'Previous notice');
      prevBtn.addEventListener('click', function() {
        track.style.animationPlayState = 'paused';
        var items = track.querySelectorAll('.notice-ticker-item');
        if (!items.length) return;
        var itemWidth = items[0].offsetWidth;
        if (itemWidth <= 0) return;
        var translateX = getTranslateX(track);
        var newX = Math.min(0, translateX + itemWidth);
        track.style.transition = 'transform 0.3s ease';
        track.style.transform = 'translateX(' + newX + 'px)';
        setTimeout(function() {
          track.style.transition = '';
          track.style.animationPlayState = 'running';
        }, 350);
      });
    }

    if (nextBtn) {
      nextBtn.setAttribute('aria-label', 'Next notice');
      nextBtn.addEventListener('click', function() {
        track.style.animationPlayState = 'paused';
        var items = track.querySelectorAll('.notice-ticker-item');
        if (!items.length) return;
        var itemWidth = items[0].offsetWidth;
        if (itemWidth <= 0) return;
        var translateX = getTranslateX(track);
        var maxTranslate = -(track.scrollWidth / 2);
        var newX = Math.max(maxTranslate, translateX - itemWidth);
        track.style.transition = 'transform 0.3s ease';
        track.style.transform = 'translateX(' + newX + 'px)';
        setTimeout(function() {
          track.style.transition = '';
          track.style.animationPlayState = 'running';
        }, 350);
      });
    }

    if (pauseBtn) {
      var paused = false;
      pauseBtn.addEventListener('click', function() {
        paused = !paused;
        track.style.animationPlayState = paused ? 'paused' : 'running';
        this.innerHTML = paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
        this.setAttribute('aria-label', paused ? 'Resume ticker' : 'Pause ticker');
      });
    }
  }

  // ===== TOAST NOTIFICATIONS =====
  function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = '<span>' + message + '</span>';
    document.body.appendChild(toast);

    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    var timer = setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);

    toast.addEventListener('mouseenter', function() {
      clearTimeout(timer);
    });
    toast.addEventListener('mouseleave', function() {
      timer = setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }, 2000);
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHORS =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '#main-content') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
          var navHeight = document.querySelector('.nav-wrapper') ? document.querySelector('.nav-wrapper').offsetHeight : 0;
          var offset = headerHeight + navHeight + 10;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // ===== ACTIVE NAV LINK =====
  function initActiveNav() {
    var currentPath = window.location.pathname;
    document.querySelectorAll('.nav-menu a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var fullPath = currentPath;
      if (href.charAt(0) !== '/' && !href.startsWith('http')) {
        var base = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        fullPath = base + href;
      }
      if (currentPath.endsWith(href) || currentPath === href || fullPath.endsWith(href)) {
        link.classList.add('active');
      }
    });
  }

  // ===== SIDEBAR ACTIVE LINK =====
  function initSidebarActive() {
    var currentHash = window.location.hash;
    var currentPath = window.location.pathname;
    document.querySelectorAll('.sidebar-menu a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && (currentPath.includes(href) || (currentHash && href.includes(currentHash)))) {
        link.classList.add('active');
      }
    });
  }

  // ===== EXTERNAL & PDF LINK INDICATORS =====
  function initLinkIndicators() {
    var hostname = window.location.hostname;
    document.querySelectorAll('a[href^="http"]:not(.btn):not([href*="' + hostname + '"])').forEach(function(link) {
      if (!link.classList.contains('no-external-icon') && !link.querySelector('img')) {
        link.classList.add('external-link');
        if (!link.getAttribute('target')) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });
    document.querySelectorAll('a[href$=".pdf"]:not(.btn)').forEach(function(link) {
      link.classList.add('pdf-link');
    });
  }

  // ===== PAGE TRANSITION =====
  function initViewTransitions() {
    if (!document.startViewTransition) return;
    document.querySelectorAll('a[href]').forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.endsWith('.pdf')) return;
      if (href.includes('logout') || link.getAttribute('type') === 'submit') return;
      link.addEventListener('click', function(e) {
        e.preventDefault();
        document.startViewTransition(function() {
          window.location.href = href;
        });
      });
    });
  }

  // ===== PARALLAX SCROLLING =====
  function initParallax() {
    var bg = document.querySelector('.parallax-bg');
    if (!bg || prefersReducedMotion) return;
    window.addEventListener('scroll', function() {
      bg.style.transform = 'translateY(' + (window.scrollY * 0.5) + 'px)';
    }, { passive: true });
  }

  // ===== CARD TILT =====
  function initCardTilt() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.card-tilt').forEach(function(card) {
      var inner = card.querySelector('.card-tilt-inner');
      if (!inner) return;
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -10;
        var rotateY = ((x - centerX) / centerX) * 10;
        inner.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      card.addEventListener('mouseleave', function() {
        inner.style.transform = 'rotateX(0) rotateY(0)';
      });
    });
  }

  // ===== MAGNETIC BUTTON =====
  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    document.querySelectorAll('.magnetic').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var maxDist = 15;
        var clamp = function(v) { return Math.max(-maxDist, Math.min(maxDist, v)); };
        btn.style.transform = 'translate(' + clamp(x * 0.3) + 'px, ' + clamp(y * 0.3) + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.3s ease';
        setTimeout(function() { btn.style.transition = ''; }, 300);
      });
    });
  }

  // ===== BOTTOM SHEET =====
  function initBottomSheet() {
    document.querySelectorAll('.bottom-sheet').forEach(function(sheet) {
      var openTriggers = document.querySelectorAll('[data-bottom-sheet="' + sheet.id + '"]');
      openTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
          e.preventDefault();
          sheet.classList.add('active');
        });
      });
      var closeTriggers = sheet.querySelectorAll('[data-dismiss="bottom-sheet"]');
      closeTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function() {
          sheet.classList.remove('active');
        });
      });
    });
  }

  // ===== HAMBURGER MORPH =====
  function initHamburgerMorph() {
    document.querySelectorAll('.nav-toggle').forEach(function(toggle) {
      toggle.addEventListener('click', function() {
        var icon = toggle.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars');
          icon.classList.toggle('fa-times');
        }
      });
    });
  }

  // ===== CURTAIN REVEAL =====
  function initCurtainReveal() {
    if (prefersReducedMotion) return;
    var curtains = document.querySelectorAll('.curtain-reveal');
    if (!curtains.length || typeof IntersectionObserver === 'undefined') {
      curtains.forEach(function(el) { el.classList.add('curtain-open'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('curtain-open');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    curtains.forEach(function(el) { observer.observe(el); });
  }

  // ===== TIMELINE OBSERVER =====
  function initTimeline() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.timeline-item').forEach(function(el) {
        el.classList.add('timeline-visible');
      });
      return;
    }
    var items = document.querySelectorAll('.timeline-item');
    if (!items.length || typeof IntersectionObserver === 'undefined') {
      items.forEach(function(el) { el.classList.add('timeline-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function(el) { observer.observe(el); });
  }

  // ===== PUBLIC API =====
  window.GGAnimations = {
    initScrollProgress: initScrollProgress,
    initHeaderEffects: initHeaderEffects,
    initRevealAnimations: initRevealAnimations,
    initCounters: initCounters,
    initHeroAnimation: initHeroAnimation,
    initImageLoading: initImageLoading,
    initImageFallbacks: initImageFallbacks,
    initBackToTop: initBackToTop,
    initNoticeTicker: initNoticeTicker,
    initSmoothScroll: initSmoothScroll,
    initActiveNav: initActiveNav,
    initSidebarActive: initSidebarActive,
    initLinkIndicators: initLinkIndicators,
    initViewTransitions: initViewTransitions,
    showToast: showToast,
    initParallax: initParallax,
    initCardTilt: initCardTilt,
    initMagneticButtons: initMagneticButtons,
    initBottomSheet: initBottomSheet,
    initHamburgerMorph: initHamburgerMorph,
    initCurtainReveal: initCurtainReveal,
    initTimeline: initTimeline,
    isReducedMotion: function() { return prefersReducedMotion; }
  };

  // ===== AUTO-INIT ON DOMContentLoaded =====
  document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initHeaderEffects();
    initRevealAnimations();
    initCounters();
    initHeroAnimation();
    initImageLoading();
    initImageFallbacks();
    initBackToTop();
    initNoticeTicker();
    initParallax();
    initCardTilt();
    initMagneticButtons();
    initBottomSheet();
    initHamburgerMorph();
    initCurtainReveal();
    initTimeline();
    initSmoothScroll();
    initActiveNav();
    initSidebarActive();
    initLinkIndicators();
    initViewTransitions();
  });
})();

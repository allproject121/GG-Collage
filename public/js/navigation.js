/* ============================================
   NAVIGATION.JS - Mobile Drawer, Mega Menu, Scroll
   ============================================ */

(function() {
  'use strict';

  // ===== MOBILE NAVIGATION =====
  function initMobileNav() {
    var navToggle = document.querySelector('.nav-toggle');
    var navClose = document.querySelector('.nav-close');
    var navMenu = document.querySelector('.nav-menu');
    var body = document.body;

    if (!navToggle || !navMenu) return;

    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    function openNav() {
      navMenu.classList.add('open');
      overlay.classList.add('active');
      navToggle.classList.add('active');
      body.style.overflow = 'hidden';
      navToggle.setAttribute('aria-expanded', 'true');
      // Focus trap
      var firstFocusable = navMenu.querySelector('a, button');
      if (firstFocusable) firstFocusable.focus();
    }

    function closeNav() {
      navMenu.classList.remove('open');
      overlay.classList.remove('active');
      navToggle.classList.remove('active');
      body.style.overflow = '';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }

    navToggle.addEventListener('click', function() {
      if (navMenu.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (navClose) {
      navClose.addEventListener('click', closeNav);
    }
    overlay.addEventListener('click', closeNav);

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeNav();
      }
    });

    // Mobile accordion submenus
    document.querySelectorAll('.nav-menu > li > a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          var parent = this.parentElement;
          var mega = parent.querySelector('.mega-menu');
          if (mega) {
            e.preventDefault();
            var isOpen = parent.classList.contains('open');
            // Close others
            document.querySelectorAll('.nav-menu > li.open').forEach(function(item) {
              if (item !== parent) item.classList.remove('open');
            });
            parent.classList.toggle('open');
          }
        }
      });
    });

    // Close on resize to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // ===== KEYBOARD DROPDOWN SUPPORT =====
  function initKeyboardDropdowns() {
    document.querySelectorAll('.nav-menu > li').forEach(function(item) {
      var link = item.querySelector('a');
      var mega = item.querySelector('.mega-menu');
      if (link && mega) {
        link.addEventListener('focus', function() {
          item.classList.add('hover');
        });
        item.addEventListener('mouseleave', function() {
          item.classList.remove('hover');
        });
        // Arrow key navigation in mega menu
        link.addEventListener('keydown', function(e) {
          if (e.key === 'ArrowDown' || e.key === 'Enter') {
            if (window.innerWidth > 768) {
              e.preventDefault();
              var firstLink = mega.querySelector('a');
              if (firstLink) firstLink.focus();
            }
          }
        });
        mega.querySelectorAll('a').forEach(function(megaLink, index, links) {
          megaLink.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (links[index + 1]) links[index + 1].focus();
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (links[index - 1]) links[index - 1].focus();
            }
            if (e.key === 'Escape') {
              link.focus();
              item.classList.remove('hover');
            }
          });
        });
      }
    });
  }

  // ===== PUBLIC API =====
  window.GGNavigation = {
    initMobileNav: initMobileNav,
    initKeyboardDropdowns: initKeyboardDropdowns
  };

  document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initKeyboardDropdowns();
  });
})();

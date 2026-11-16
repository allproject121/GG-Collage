/* ============================================
   ACCESSIBILITY.JS - Font, Contrast, Motion Controls
   ============================================ */

(function() {
  'use strict';

  var STORAGE_PREFIX = 'gg_access_';
  var body = document.body || document.documentElement;

  function initAccessibility() {
    body = document.body || document.documentElement;
    var accessBtn = document.getElementById('accessBtn');
    var accessPanel = document.getElementById('accessPanel');

    if (!accessBtn || !accessPanel) return;

    // Toggle panel
    accessBtn.addEventListener('click', function() {
      accessPanel.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!accessPanel.contains(e.target) && !accessBtn.contains(e.target)) {
        accessPanel.classList.remove('open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && accessPanel.classList.contains('open')) {
        accessPanel.classList.remove('open');
        accessBtn.focus();
      }
    });

    // Font size controls
    initFontSizeControls(accessPanel);

    // High contrast
    initContrastToggle(accessPanel);

    // Reduced motion
    initMotionToggle(accessPanel);

    // Underline links
    initUnderlineLinks(accessPanel);

    // Readable font
    initReadableFont(accessPanel);

    // Restore saved preferences
    restorePreferences();
  }

  function initFontSizeControls(panel) {
    var fontNormal = document.getElementById('fontNormal');
    var fontLarge = document.getElementById('fontLarge');
    var fontXLarge = document.getElementById('fontXLarge');
    var fontSmall = document.getElementById('fontSmall');

    if (fontNormal) {
      fontNormal.addEventListener('click', function() {
        body.classList.remove('font-large', 'font-xlarge');
        savePreference('fontSize', '');
        updateActiveButton(panel, 'fontNormal');
      });
    }
    if (fontLarge) {
      fontLarge.addEventListener('click', function() {
        body.classList.remove('font-xlarge');
        body.classList.add('font-large');
        savePreference('fontSize', 'font-large');
        updateActiveButton(panel, 'fontLarge');
      });
    }
    if (fontXLarge) {
      fontXLarge.addEventListener('click', function() {
        body.classList.remove('font-large');
        body.classList.add('font-xlarge');
        savePreference('fontSize', 'font-xlarge');
        updateActiveButton(panel, 'fontXLarge');
      });
    }
    if (fontSmall) {
      fontSmall.addEventListener('click', function() {
        body.classList.remove('font-large', 'font-xlarge');
        body.style.fontSize = '85%';
        savePreference('fontSize', 'small');
        updateActiveButton(panel, 'fontSmall');
      });
    }
  }

  function initContrastToggle(panel) {
    var contrastBtn = document.getElementById('contrastToggle');
    if (!contrastBtn) return;

    contrastBtn.addEventListener('click', function() {
      body.classList.toggle('high-contrast');
      var isActive = body.classList.contains('high-contrast');
      savePreference('highContrast', isActive ? 'true' : 'false');
      this.classList.toggle('active', isActive);
    });
  }

  function initMotionToggle(panel) {
    var motionBtn = document.getElementById('motionToggle');
    if (!motionBtn) return;

    motionBtn.addEventListener('click', function() {
      body.classList.toggle('reduced-motion');
      var isActive = body.classList.contains('reduced-motion');
      savePreference('reducedMotion', isActive ? 'true' : 'false');
      this.classList.toggle('active', isActive);

      // Also handle reveal elements
      if (isActive) {
        document.querySelectorAll('.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-stagger').forEach(function(el) {
          el.classList.add('reveal-visible');
        });
      }
    });
  }

  function initUnderlineLinks(panel) {
    var underlineBtn = document.getElementById('underlineLinks');
    if (!underlineBtn) return;

    underlineBtn.addEventListener('click', function() {
      body.classList.toggle('underline-links');
      var isActive = body.classList.contains('underline-links');
      savePreference('underlineLinks', isActive ? 'true' : 'false');
      this.classList.toggle('active', isActive);
    });
  }

  function initReadableFont(panel) {
    var readableBtn = document.getElementById('readableFont');
    if (!readableBtn) return;

    readableBtn.addEventListener('click', function() {
      body.classList.toggle('readable-font');
      var isActive = body.classList.contains('readable-font');
      savePreference('readableFont', isActive ? 'true' : 'false');
      this.classList.toggle('active', isActive);
    });
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, value);
    } catch (e) {
      // localStorage not available
    }
  }

  function getPreference(key) {
    try {
      return localStorage.getItem(STORAGE_PREFIX + key);
    } catch (e) {
      return null;
    }
  }

  function restorePreferences() {
    // Font size
    var fontSize = getPreference('fontSize');
    if (fontSize === 'font-large') {
      document.body.classList.add('font-large');
    } else if (fontSize === 'font-xlarge') {
      document.body.classList.add('font-xlarge');
    } else if (fontSize === 'small') {
      document.body.style.fontSize = '85%';
    }

    // High contrast
    if (getPreference('highContrast') === 'true') {
      document.body.classList.add('high-contrast');
    }

    // Reduced motion
    if (getPreference('reducedMotion') === 'true') {
      document.body.classList.add('reduced-motion');
    }

    // Underline links
    if (getPreference('underlineLinks') === 'true') {
      document.body.classList.add('underline-links');
    }

    // Readable font
    if (getPreference('readableFont') === 'true') {
      document.body.classList.add('readable-font');
    }

    // System reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }

    // Update active states on buttons
    updateActiveStates();
  }

  function updateActiveStates() {
    var panel = document.getElementById('accessPanel');
    if (!panel) return;

    if (document.body.classList.contains('high-contrast')) {
      var contrastBtn = document.getElementById('contrastToggle');
      if (contrastBtn) contrastBtn.classList.add('active');
    }
    if (document.body.classList.contains('reduced-motion')) {
      var motionBtn = document.getElementById('motionToggle');
      if (motionBtn) motionBtn.classList.add('active');
    }
    if (document.body.classList.contains('underline-links')) {
      var underlineBtn = document.getElementById('underlineLinks');
      if (underlineBtn) underlineBtn.classList.add('active');
    }
    if (document.body.classList.contains('readable-font')) {
      var readableBtn = document.getElementById('readableFont');
      if (readableBtn) readableBtn.classList.add('active');
    }
    if (document.body.classList.contains('font-large')) {
      var fontLargeBtn = document.getElementById('fontLarge');
      if (fontLargeBtn) fontLargeBtn.classList.add('active');
    }
  }

  function updateActiveButton(panel, activeId) {
    panel.querySelectorAll('button').forEach(function(btn) {
      btn.classList.remove('active');
    });
    var activeBtn = document.getElementById(activeId);
    if (activeBtn) activeBtn.classList.add('active');
  }

  window.GGAccessibility = {
    initAccessibility: initAccessibility
  };

  document.addEventListener('DOMContentLoaded', initAccessibility);
})();

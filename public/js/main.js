document.addEventListener('DOMContentLoaded', function() {

  var body = document.body;

  // ===== NOTICE TABS =====
  var noticeTabs = document.querySelectorAll('.notice-tab');
  var noticeGroups = document.querySelectorAll('.notice-group');
  if (noticeTabs.length) {
    noticeTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        noticeTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        var target = this.getAttribute('data-target');
        noticeGroups.forEach(function(g) {
          g.style.display = g.id === target ? 'block' : 'none';
        });
      });
    });
  }

  // ===== ACCORDION =====
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      this.classList.toggle('active');
      var accBody = this.nextElementSibling;
      if (accBody) {
        accBody.classList.toggle('open');
      }
    });
  });

  // ===== NOTICE BAR DISMISS =====
  var noticeClose = document.querySelector('.notice-bar .notice-close');
  var noticeBar = document.querySelector('.notice-bar');
  if (noticeClose && noticeBar) {
    noticeClose.addEventListener('click', function() {
      noticeBar.style.display = 'none';
      localStorage.setItem('noticeBarDismissed', 'true');
    });
    if (localStorage.getItem('noticeBarDismissed') === 'true') {
      noticeBar.style.display = 'none';
    }
  }

  // ===== IMPORTANT NOTICE POPUP =====
  var noticePopup = document.getElementById('importantNoticePopup');
  var noticePopupClose = document.getElementById('noticePopupClose');

  function dismissNoticePopup() {
    if (noticePopup) {
      noticePopup.classList.remove('active');
      body.style.overflow = '';
    }
  }

  if (noticePopup) {
    if (noticePopupClose) {
      noticePopupClose.addEventListener('click', dismissNoticePopup);
    }
    noticePopup.addEventListener('click', function(e) {
      if (e.target === this) dismissNoticePopup();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && noticePopup.classList.contains('active')) dismissNoticePopup();
    });
  }

  // ===== TESTIMONIAL SLIDER =====
  var testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    var slides = testimonialSlider.querySelectorAll('.testimonial-card');
    var prevBtn = document.getElementById('testPrev');
    var nextBtn = document.getElementById('testNext');
    var dotsContainer = document.getElementById('testDots');
    var currentSlide = 0;

    function showSlide(index) {
      slides.forEach(function(s, i) {
        s.style.display = i === index ? 'block' : 'none';
      });
      if (dotsContainer) {
        var dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach(function(d, i) {
          d.classList.toggle('active', i === index);
        });
      }
    }

    if (slides.length) {
      showSlide(0);
      if (dotsContainer) {
        slides.forEach(function(_, i) {
          var dot = document.createElement('button');
          dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', function() { showSlide(i); });
          dotsContainer.appendChild(dot);
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', function() {
          var current = Array.from(slides).findIndex(function(s) { return s.style.display !== 'none'; });
          showSlide((current - 1 + slides.length) % slides.length);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function() {
          var current = Array.from(slides).findIndex(function(s) { return s.style.display !== 'none'; });
          showSlide((current + 1) % slides.length);
        });
      }
    }
  }

  // ===== NOTICE MODAL (Event Delegation) =====
  var noticeModal = document.getElementById('noticeModal');
  var noticeModalClose = document.getElementById('noticeModalClose');

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-notice-modal]');
    if (btn) {
      e.preventDefault();
      var title = btn.getAttribute('data-title') || 'Notice';
      var date = btn.getAttribute('data-date') || '';
      var category = btn.getAttribute('data-category') || '';
      var modalBody = btn.getAttribute('data-body') || 'Notice content not available.';
      if (noticeModal) {
        var h3 = noticeModal.querySelector('.notice-modal-content h3');
        var meta = noticeModal.querySelector('.notice-meta');
        var bodyEl = noticeModal.querySelector('.notice-body');
        if (h3) h3.textContent = title;
        if (meta) meta.textContent = date + (category ? ' | ' + category : '');
        if (bodyEl) bodyEl.textContent = modalBody;
        noticeModal.classList.add('active');
        body.style.overflow = 'hidden';
      }
    }
  });

  if (noticeModalClose) {
    noticeModalClose.addEventListener('click', function() {
      if (noticeModal) noticeModal.classList.remove('active');
      body.style.overflow = '';
    });
  }
  if (noticeModal) {
    noticeModal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        body.style.overflow = '';
      }
    });
  }

  // ===== NOTICE FILTERS =====
  var filterCategory = document.getElementById('filterCategory');
  var filterYear = document.getElementById('filterYear');
  if (filterCategory) {
    filterCategory.addEventListener('change', filterNotices);
  }
  if (filterYear) {
    filterYear.addEventListener('change', filterNotices);
  }

  function filterNotices() {
    var cat = filterCategory ? filterCategory.value : '';
    var year = filterYear ? filterYear.value : '';
    document.querySelectorAll('.notice-item').forEach(function(item) {
      var itemCat = item.getAttribute('data-category') || '';
      var itemYear = item.getAttribute('data-year') || '';
      var show = (!cat || itemCat === cat) && (!year || itemYear === year);
      item.style.display = show ? 'flex' : 'none';
    });
  }

  // ===== NEW BADGE FOR RECENT NOTICES =====
  document.querySelectorAll('.notice-item[data-date]').forEach(function(item) {
    var dateStr = item.getAttribute('data-date');
    if (dateStr) {
      var itemDate = new Date(dateStr);
      var now = new Date();
      var diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) {
        var badge = document.createElement('span');
        badge.className = 'new-badge';
        badge.textContent = 'NEW';
        var titleEl = item.querySelector('.notice-title');
        if (titleEl) titleEl.appendChild(badge);
      }
    }
  });

  // ===== KEYBOARD SUPPORT FOR DROPDOWNS =====
  document.querySelectorAll('.nav-menu > li').forEach(function(item) {
    var link = item.querySelector('a');
    var mega = item.querySelector('.mega-menu');
    if (link && mega) {
      link.addEventListener('focus', function() { item.classList.add('hover'); });
      item.addEventListener('mouseleave', function() { item.classList.remove('hover'); });
    }
  });

  console.log('GG College Redesign - Loaded successfully');
});
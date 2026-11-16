/* ============================================
   GALLERY.JS - Lightbox, Filter, Swipe, Keyboard Navigation
   ============================================ */

(function() {
  'use strict';

  var lightbox, lightboxImg, lightboxClose, lightboxPrev, lightboxNext;
  var currentImageIndex = 0;
  var galleryImages = [];
  var body = document.body;
  var touchStartX = 0;
  var touchEndX = 0;
  var lightboxCounter, lightboxCaption;
  var touchMoveHandler;

  function refreshVisibleGalleryImages() {
    galleryImages = [];
    var allItems = document.querySelectorAll('.gallery-item');
    allItems.forEach(function(item) {
      // Check if item and its parent album are visible
      var albumSection = item.closest('.gallery-album-section');
      var isAlbumVisible = !albumSection || albumSection.style.display !== 'none';
      var isItemVisible = item.style.display !== 'none' && isAlbumVisible;

      if (isItemVisible) {
        galleryImages.push(item);
      }
    });
  }

  function initGalleryLightbox() {
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightboxImg');
    lightboxClose = document.getElementById('lightboxClose');
    lightboxPrev = document.getElementById('lightboxPrev');
    lightboxNext = document.getElementById('lightboxNext');

    if (!lightbox) return;

    var allItems = document.querySelectorAll('.gallery-item');
    allItems.forEach(function(item) {
      item.addEventListener('click', function() {
        refreshVisibleGalleryImages();
        var idx = galleryImages.indexOf(this);
        currentImageIndex = idx >= 0 ? idx : 0;
        openLightbox(this);
      });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'View image: ' + (item.querySelector('img') ? item.querySelector('img').alt : 'Gallery image'));
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    refreshVisibleGalleryImages();

    // Apply blur-up loading to gallery images
    allItems.forEach(function(item) {
      var img = item.querySelector('img');
      if (img) {
        img.classList.add('image-blur-up');
        if (img.complete && img.naturalHeight > 0) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', function() {
            this.classList.add('loaded');
          });
        }
      }
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
      lightbox.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
      });
    }
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateLightbox(-1);
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateLightbox(1);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightbox || !lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Touch/swipe support
    lightbox.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    // Dynamically create counter and caption elements if not present
    if (!lightbox.querySelector('.lightbox-counter')) {
      lightboxCounter = document.createElement('span');
      lightboxCounter.className = 'lightbox-counter';
      lightboxCounter.id = 'lightboxCounter';
      lightbox.appendChild(lightboxCounter);
    } else {
      lightboxCounter = document.getElementById('lightboxCounter');
    }
    if (!lightbox.querySelector('.lightbox-caption')) {
      lightboxCaption = document.createElement('div');
      lightboxCaption.className = 'lightbox-caption';
      lightboxCaption.id = 'lightboxCaption';
      lightbox.appendChild(lightboxCaption);
    } else {
      lightboxCaption = document.getElementById('lightboxCaption');
    }
  }

  function initGalleryFilters() {
    var filterBtns = document.querySelectorAll('.gallery-filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');

        var filter = this.getAttribute('data-filter') || 'all';
        var albumSections = document.querySelectorAll('.gallery-album-section');

        if (albumSections.length > 0) {
          albumSections.forEach(function(sec) {
            var cat = sec.getAttribute('data-category') || '';
            if (filter === 'all' || cat === filter) {
              sec.style.display = '';
            } else {
              sec.style.display = 'none';
            }
          });
        }

        refreshVisibleGalleryImages();
      });
    });
  }

  function handleFocusTrap(e) {
    var focusable = lightbox.querySelectorAll('button, [tabindex]:not([tabindex="-1"]), img[tabindex]');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  function openLightbox(item) {
    if (!lightbox || !lightboxImg) return;
    var img = item.querySelector('img');
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-modal', 'true');
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    touchMoveHandler = function(e) { e.preventDefault(); };
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('keydown', handleFocusTrap);
    // Update counter
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentImageIndex + 1) + ' / ' + galleryImages.length;
    }
    // Update caption
    if (lightboxCaption) {
      var captionEl = item.querySelector('.gallery-caption');
      lightboxCaption.textContent = captionEl ? captionEl.textContent : '';
    }
    // Focus trap
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.removeAttribute('aria-modal');
    body.style.overflow = '';
    body.style.touchAction = '';
    if (touchMoveHandler) {
      document.removeEventListener('touchmove', touchMoveHandler);
      touchMoveHandler = null;
    }
    document.removeEventListener('keydown', handleFocusTrap);
    // Return focus to the gallery item
    if (galleryImages[currentImageIndex]) {
      galleryImages[currentImageIndex].focus();
    }
  }

  function navigateLightbox(direction) {
    if (galleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    var currentItem = galleryImages[currentImageIndex];
    var img = currentItem.querySelector('img');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentImageIndex + 1) + ' / ' + galleryImages.length;
    }
    if (lightboxCaption) {
      var captionEl = currentItem.querySelector('.gallery-caption');
      lightboxCaption.textContent = captionEl ? captionEl.textContent : '';
    }
  }

  function handleSwipe() {
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateLightbox(1);
      } else {
        navigateLightbox(-1);
      }
    }
  }

  // ===== VIDEO CARD CLICK =====
  function initVideoCards() {
    document.querySelectorAll('.video-card[data-video-id]').forEach(function(card) {
      card.addEventListener('click', function() {
        var videoId = this.getAttribute('data-video-id');
        if (!videoId) return;
        var featuredIframe = document.getElementById('featuredVideoIframe');
        if (featuredIframe) {
          featuredIframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1';
          featuredIframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  window.GGGallery = {
    initGalleryLightbox: initGalleryLightbox,
    initGalleryFilters: initGalleryFilters,
    initVideoCards: initVideoCards,
    refreshVisibleGalleryImages: refreshVisibleGalleryImages
  };

  document.addEventListener('DOMContentLoaded', function() {
    initGalleryLightbox();
    initGalleryFilters();
    initVideoCards();
  });
})();

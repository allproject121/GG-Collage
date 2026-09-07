/* ============================================
   SEARCH.JS - Global Search with Keyboard Support
   ============================================ */

(function() {
  'use strict';

  var searchData = [
    { title: 'Home', url: 'index.html', category: 'Page' },
    { title: 'About Us', url: 'pages/about.html', category: 'Page' },
    { title: 'Mission & Vision', url: 'pages/about.html#vision-mission', category: 'Page' },
    { title: 'Principal', url: 'pages/about.html#principal', category: 'Page' },
    { title: 'Academic', url: 'pages/academic.html', category: 'Page' },
    { title: 'Programmes', url: 'pages/programmes.html', category: 'Page' },
    { title: 'Student Corner', url: 'pages/student-corner.html', category: 'Page' },
    { title: 'Activities', url: 'pages/activities.html', category: 'Page' },
    { title: 'Facilities', url: 'pages/facilities.html', category: 'Page' },
    { title: 'NIRF', url: 'pages/nirf.html', category: 'Page' },
    { title: 'IQAC', url: 'pages/iqac.html', category: 'Page' },
    { title: 'NAAC', url: 'pages/naac.html', category: 'Page' },
    { title: 'Alumni', url: 'pages/alumni.html', category: 'Page' },
    { title: 'Gallery', url: 'pages/gallery.html', category: 'Page' },
    { title: 'Contact Us', url: 'pages/contact.html', category: 'Page' },
    { title: 'Results', url: 'pages/student-corner.html#results', category: 'Page' },
    { title: 'Merit Lists', url: 'pages/student-corner.html#merit-lists', category: 'Page' },
    { title: 'Syllabus', url: 'pages/student-corner.html#syllabus', category: 'Page' },
    { title: 'Fee Structure', url: 'pages/student-corner.html#fee-structure', category: 'Page' },
    { title: 'Scholarships', url: 'pages/student-corner.html#scholarships', category: 'Page' },
    { title: 'B.A.', url: 'pages/programmes.html#ba', category: 'Programme' },
    { title: 'M.A.', url: 'pages/programmes.html#ma', category: 'Programme' },
    { title: 'B.Com', url: 'pages/programmes.html#bcom', category: 'Programme' },
    { title: 'BMS', url: 'pages/programmes.html#bms', category: 'Programme' },
    { title: 'M.Com', url: 'pages/programmes.html#mcom', category: 'Programme' },
    { title: 'B.Sc. IT', url: 'pages/programmes.html#bsit', category: 'Programme' },
    { title: 'M.Sc. IT', url: 'pages/programmes.html#mscit', category: 'Programme' },
    { title: 'B.Sc. Data Science', url: 'pages/programmes.html#datascience', category: 'Programme' },
    { title: 'Ph.D. Rural Development', url: 'pages/programmes.html#phd', category: 'Programme' },
    { title: 'NSS', url: 'pages/activities.html#nss', category: 'Activity' },
    { title: 'NCC', url: 'pages/activities.html#ncc', category: 'Activity' },
    { title: 'DLLE', url: 'pages/activities.html#dlle', category: 'Activity' },
    { title: 'Sports', url: 'pages/activities.html#sports', category: 'Activity' },
    { title: 'Cultural Activities', url: 'pages/activities.html#cultural', category: 'Activity' },
    { title: 'Grievance', url: 'pages/grievance.html', category: 'Page' },
    { title: 'Download Centre', url: 'pages/downloads.html', category: 'Page' },
    { title: 'Faculty Directory', url: 'pages/faculty.html', category: 'Page' },
    { title: 'Apply Online', url: 'pages/admission-apply.html', category: 'Admission' },
    { title: 'Check Application Status', url: 'pages/admission-status.html', category: 'Admission' },
    { title: 'Examination', url: 'pages/examination.html', category: 'Page' },
    { title: 'Notices', url: 'pages/notices.html', category: 'Page' },
    { title: 'Events', url: 'pages/events.html', category: 'Page' },
    { title: 'Departments', url: 'pages/departments.html', category: 'Page' },
    { title: 'Admin Login', url: 'admin/login.html', category: 'Admin' }
  ];

  // De-duplicate
  var seen = {};
  searchData = searchData.filter(function(i) {
    if (seen[i.url]) return false;
    seen[i.url] = true;
    return true;
  });

  var searchBtn = document.getElementById('searchBtn');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchClose = document.getElementById('searchClose');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var body = document.body;
  var debounceTimer = null;

  function initSearch() {
    if (!searchBtn || !searchOverlay) return;

    searchBtn.addEventListener('click', openSearch);

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    searchOverlay.addEventListener('click', function(e) {
      if (e.target === this) closeSearch();
    });

    document.addEventListener('keydown', function(e) {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
    });

    // Search input with debounce
    if (searchInput && searchResults) {
      searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          performSearch(searchInput.value);
        }, 200);
      });

      // Keyboard navigation in results
      searchInput.addEventListener('keydown', function(e) {
        var results = searchResults.querySelectorAll('a');
        var current = searchResults.querySelector('.search-result-active');
        var index = Array.from(results).indexOf(current);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (current) current.classList.remove('search-result-active');
          var next = results[index + 1] || results[0];
          if (next) {
            next.classList.add('search-result-active');
            next.scrollIntoView({ block: 'nearest' });
          }
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (current) current.classList.remove('search-result-active');
          var prev = results[index - 1] || results[results.length - 1];
          if (prev) {
            prev.classList.add('search-result-active');
            prev.scrollIntoView({ block: 'nearest' });
          }
        }
        if (e.key === 'Enter' && current) {
          e.preventDefault();
          window.location.href = current.getAttribute('href');
        }
      });
    }
  }

  function openSearch() {
    searchOverlay.classList.add('active');
    body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    if (searchResults) searchResults.innerHTML = '';
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    body.style.overflow = '';
  }

  function performSearch(query) {
    if (!searchResults) return;
    query = query.toLowerCase().trim();

    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    var results = searchData.filter(function(item) {
      return item.title.toLowerCase().indexOf(query) !== -1 ||
             item.category.toLowerCase().indexOf(query) !== -1;
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<div style="color:rgba(255,255,255,0.5);padding:1.5rem;text-align:center;"><i class="fas fa-search" style="font-size:1.5rem;display:block;margin-bottom:0.5rem;"></i>No results found for "' + escapeHtml(query) + '"</div>';
      return;
    }

    var html = '';
    results.slice(0, 10).forEach(function(item) {
      var highlighted = highlightMatch(item.title, query);
      html += '<a href="' + item.url + '">' + highlighted + ' <small>' + item.category + '</small></a>';
    });
    searchResults.innerHTML = html;
  }

  function highlightMatch(text, query) {
    var regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
    return text.replace(regex, '<strong style="color:var(--color-gold);">$1</strong>');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  window.GGSearch = {
    initSearch: initSearch,
    openSearch: openSearch,
    closeSearch: closeSearch
  };

  document.addEventListener('DOMContentLoaded', initSearch);
})();

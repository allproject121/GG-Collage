/* ============================================
   SEARCH.JS - Global Search with Safe Path Resolution
   ============================================ */

(function() {
  'use strict';

  var searchData = [
    { title: 'Home', url: 'index.html', category: 'Page' },
    { title: 'About Us', url: 'pages/about.html', category: 'Page' },
    { title: 'History & Management', url: 'pages/about.html#history', category: 'About' },
    { title: 'Mission & Vision', url: 'pages/about.html#vision-mission', category: 'About' },
    { title: 'Principal\'s Desk - Dr. Somnath Vibhute', url: 'pages/about.html#principal', category: 'About' },
    { title: 'Chairman\'s Message - Most Rev. Thomas D\'Souza', url: 'pages/about.html#chairman', category: 'About' },
    { title: 'Academic Overview', url: 'pages/academic.html', category: 'Page' },
    { title: 'Programmes & Courses', url: 'pages/programmes.html', category: 'Page' },
    { title: 'Departments Directory', url: 'pages/departments.html', category: 'Page' },
    { title: 'Faculty Members', url: 'pages/faculty.html', category: 'Page' },
    { title: 'Student Corner', url: 'pages/student-corner.html', category: 'Page' },
    { title: 'Activities & Committees', url: 'pages/activities.html', category: 'Page' },
    { title: 'Campus Facilities', url: 'pages/facilities.html', category: 'Page' },
    { title: 'Library (Knowledge Resource Centre)', url: 'pages/library.html', category: 'Facility' },
    { title: 'NIRF Reports & Data', url: 'pages/nirf.html', category: 'IQAC/NAAC' },
    { title: 'IQAC Cell', url: 'pages/iqac.html', category: 'IQAC/NAAC' },
    { title: 'NAAC Accreditation (B Grade)', url: 'pages/naac.html', category: 'IQAC/NAAC' },
    { title: 'Alumni Association & Registration', url: 'pages/alumni.html', category: 'Alumni' },
    { title: 'Photo & Video Gallery', url: 'pages/gallery.html', category: 'Gallery' },
    { title: 'Media Centre', url: 'pages/media-centre.html', category: 'Page' },
    { title: 'Contact Us & Campus Location', url: 'pages/contact.html', category: 'Contact' },
    { title: 'Examination Notices & Timetables', url: 'pages/examination.html', category: 'Examination' },
    { title: 'Examination Results', url: 'pages/examination.html#results', category: 'Examination' },
    { title: 'Question Papers Archive', url: 'pages/examination.html#question-papers', category: 'Examination' },
    { title: 'Download Prospectus & Forms', url: 'pages/downloads.html', category: 'Downloads' },
    { title: 'Latest College Notices', url: 'pages/notices.html', category: 'Notices' },
    { title: 'Upcoming Events & Seminars', url: 'pages/events.html', category: 'Events' },
    { title: 'Online Admission Apply (2026-27)', url: 'pages/admission-apply.html', category: 'Admission' },
    { title: 'Check Admission Status', url: 'pages/admission-status.html', category: 'Admission' },
    { title: 'Admissions Guidelines & Eligibility', url: 'pages/admissions.html', category: 'Admission' },
    { title: 'Student Grievance Redressal Portal', url: 'pages/grievance.html', category: 'Student Service' },
    { title: 'Women Development Cell (WDC)', url: 'pages/wdc.html', category: 'Committee' },
    { title: 'Career Katta (Placement & Competitive Exam)', url: 'pages/career-katta.html', category: 'Career' },
    { title: 'SWAYAM & NPTEL MOOC Courses', url: 'pages/swayam.html', category: 'Academics' },
    { title: 'National Education Policy (NEP 2020)', url: 'pages/nep.html', category: 'Academics' },
    { title: 'Add-on & Certificate Courses', url: 'pages/addon-courses.html', category: 'Academics' },
    { title: 'Course Outcomes & Programme Outcomes', url: 'pages/course-outcomes.html', category: 'Academics' },
    { title: 'CO-PO Mapping Matrix', url: 'pages/co-mapping.html', category: 'Academics' },
    { title: 'Top Recruiters & Placement Partners', url: 'pages/recruiters.html', category: 'Career' },
    { title: 'College Committees List', url: 'pages/committees.html', category: 'About' },
    { title: 'Privacy Policy', url: 'pages/privacy-policy.html', category: 'Policy' },
    { title: 'Accessibility Statement', url: 'pages/accessibility-statement.html', category: 'Policy' },

    // Courses / Programmes
    { title: 'B.A. (Bachelor of Arts)', url: 'pages/programmes.html#ba', category: 'UG Programme' },
    { title: 'B.Com (Bachelor of Commerce)', url: 'pages/programmes.html#bcom', category: 'UG Programme' },
    { title: 'BMS (Bachelor of Management Studies)', url: 'pages/programmes.html#bms', category: 'UG Programme' },
    { title: 'BAF (B.Com in Accounting & Finance)', url: 'pages/programmes.html#baf', category: 'UG Programme' },
    { title: 'BBI (B.Com in Banking & Insurance)', url: 'pages/programmes.html#bbi', category: 'UG Programme' },
    { title: 'BFM (B.Com in Financial Markets)', url: 'pages/programmes.html#bfm', category: 'UG Programme' },
    { title: 'B.Sc. IT (Information Technology)', url: 'pages/programmes.html#bscit', category: 'UG Programme' },
    { title: 'B.Sc. Data Science', url: 'pages/programmes.html#datascience', category: 'UG Programme' },
    { title: 'M.Com (Accountancy & Business Management)', url: 'pages/programmes.html#mcom', category: 'PG Programme' },
    { title: 'M.A. in Rural Development & Economics', url: 'pages/programmes.html#ma', category: 'PG Programme' },
    { title: 'M.Sc. IT (Master of Science in IT)', url: 'pages/programmes.html#mscit', category: 'PG Programme' },
    { title: 'Ph.D. Center in Rural Development', url: 'pages/programmes.html#phd', category: 'Research Programme' },

    // Activities
    { title: 'NSS (National Service Scheme)', url: 'pages/activities.html#nss', category: 'Activity' },
    { title: 'NCC (National Cadet Corps)', url: 'pages/activities.html#ncc', category: 'Activity' },
    { title: 'DLLE (Lifelong Learning & Extension)', url: 'pages/activities.html#dlle', category: 'Activity' },
    { title: 'Sports & Athletics', url: 'pages/activities.html#sports', category: 'Activity' },
    { title: 'Cultural Events & Annual Fest', url: 'pages/activities.html#cultural', category: 'Activity' },

    // Admin
    { title: 'Admin Login', url: 'admin/login.html', category: 'Admin' }
  ];

  // Helper to resolve URLs safely whether on root, in /pages/, or in /admin/
  function resolveSearchUrl(rawUrl) {
    var inPages = window.location.pathname.indexOf('/pages/') !== -1;
    var inAdmin = window.location.pathname.indexOf('/admin/') !== -1;
    if (inPages) {
      if (rawUrl.startsWith('pages/')) return rawUrl.substring(6);
      return '../' + rawUrl;
    }
    if (inAdmin) {
      if (rawUrl.startsWith('admin/')) return rawUrl.substring(6);
      return '../' + rawUrl;
    }
    return rawUrl;
  }

  var searchBtn = document.getElementById('searchBtn');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchClose = document.getElementById('searchClose');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
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
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
    });

    if (searchInput && searchResults) {
      searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          performSearch(searchInput.value);
        }, 150);
      });

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
    document.body.style.overflow = 'hidden';
    if (searchInput) {
      searchInput.value = '';
      setTimeout(function() { searchInput.focus(); }, 50);
    }
    if (searchResults) searchResults.innerHTML = '';
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function performSearch(query) {
    if (!searchResults) return;
    query = (query || '').toLowerCase().trim();

    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    var results = searchData.filter(function(item) {
      return item.title.toLowerCase().indexOf(query) !== -1 ||
             item.category.toLowerCase().indexOf(query) !== -1;
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<div style="color:rgba(255,255,255,0.7);padding:1.5rem;text-align:center;"><i class="fas fa-search" style="font-size:1.5rem;display:block;margin-bottom:0.5rem;"></i>No results found for "' + escapeHtml(query) + '"</div>';
      return;
    }

    var html = '';
    results.slice(0, 10).forEach(function(item) {
      var targetUrl = resolveSearchUrl(item.url);
      var highlighted = highlightMatch(item.title, query);
      html += '<a href="' + targetUrl + '" style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;color:#fff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.1);transition:background 0.2s;">' +
              '<span>' + highlighted + '</span>' +
              '<small style="background:rgba(200,168,78,0.25);color:#C8A84E;padding:2px 8px;border-radius:4px;font-size:0.75rem;">' + item.category + '</small>' +
              '</a>';
    });
    searchResults.innerHTML = html;
  }

  function highlightMatch(text, query) {
    var regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
    return text.replace(regex, '<strong style="color:#C8A84E;">$1</strong>');
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

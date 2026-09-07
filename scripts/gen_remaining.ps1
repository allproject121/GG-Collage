$pagesDir = 'C:\Users\Satyam\Downloads\WD\GG Collage\pages'

# First, fix departments.html
$depMeta = '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Departments | St. Gonsalo Garcia College</title>
  <meta name="description" content="Academic departments at St. Gonsalo Garcia College. Explore Arts, Commerce, Science and IT departments with faculty details and programmes offered.">
  <meta property="og:title" content="Departments | St. Gonsalo Garcia College">
  <meta property="og:description" content="Academic departments at St. Gonsalo Garcia College. Explore Arts, Commerce, Science and IT departments with faculty details and programmes offered.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.ggcollege.ac.in/pages/departments.html">
  <meta property="og:image" content="../images/GG-College-Logo.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../images/GG-College-Logo.svg" type="image/jpeg" sizes="16x16">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to Main Content</a>

  <div class="top-bar">
    <div class="container">
      <div class="top-bar-left">
        <a href="tel:7767811134"><i class="fas fa-phone"></i> 77678 11134</a>
        <a href="mailto:office@ggcollege.in"><i class="fas fa-envelope"></i> office@ggcollege.in</a>
      </div>
      <div class="top-bar-right">
        <a href="https://innovateindia.mygov.in/nep/" target="_blank" rel="noopener noreferrer">NEP</a>
        <span class="top-bar-divider"></span>
        <a href="iqac.html">IQAC</a>
        <span class="top-bar-divider"></span>
        <a href="alumni.html">Alumni</a>
        <span class="top-bar-divider"></span>
        <a href="gallery.html">Gallery</a>
        <span class="top-bar-divider"></span>
        <a href="../admin/login.html">Admin Login</a>
        <span class="top-bar-divider"></span>
        <a href="https://www.facebook.com/gonsalo.garcia.3551/" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="https://twitter.com/principalggc" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        <a href="https://www.instagram.com/gonsalogarciacollege/" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="https://www.youtube.com/channel/UCO9lpSiRd4GON7BNUmW2Y1g" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        <a href="https://www.linkedin.com/in/principal-office-117209214/" class="social-icon" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>

  <header class="header" role="banner">
    <div class="container header-inner">
      <div class="header-logo">
        <img src="../images/GG-College-Logo.svg" alt="St. Gonsalo Garcia College Logo">
        <div class="header-logo-text">
          <div class="college-name">St. Gonsalo Garcia College of Arts and Commerce</div>
          <div class="college-sub">Our Lady of Grace Trusts | Vasai</div>
          <div class="college-motto">&quot;Swaprakashen Dippyatham &mdash; Let Thy Light Shine&quot;</div>
          <span class="accred-badge">NAAC Re-accredited with B Grade</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="accessibility-btn" id="accessBtn" aria-label="Accessibility Options"><i class="fas fa-universal-access"></i></button>
        <button class="search-btn" id="searchBtn" aria-label="Search"><i class="fas fa-search"></i></button>
        <a href="https://enrollonline.co.in/Registration/Apply/SGGC" class="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">Student Login</a>
        <a href="../admin/login.html" class="btn btn-outline btn-sm">Admin Login</a>
      </div>
    </div>
  </header>

  <nav class="nav-wrapper" role="navigation" aria-label="Main Navigation">
    <div class="container nav-inner">
      <button class="nav-toggle" aria-label="Open Menu" aria-expanded="false"><i class="fas fa-bars"></i></button>
      <ul class="nav-menu" role="menubar">
        <button class="nav-close" aria-label="Close Menu">&amp;times;</button>
        <li><a href="../index.html">Home</a></li>
        <li><a href="about.html">About <i class="fas fa-chevron-down"></i></a></li>
        <li><a href="academic.html">Academic <i class="fas fa-chevron-down"></i></a></li>
        <li><a href="programmes.html">Programmes <i class="fas fa-chevron-down"></i></a></li>
        <li><a href="student-corner.html">Students Corner <i class="fas fa-chevron-down"></i></a></li>
        <li><a href="activities.html">Activities <i class="fas fa-chevron-down"></i></a></li>
        <li><a href="facilities.html">Facilities</a></li>
        <li><a href="nirf.html">NIRF</a></li>
        <li><a href="iqac.html">IQAC <i class="fas fa-chevron-down"></i></a></li>
        <li><a href="nirf.html">NIRF</a></li>
        <li><a href="alumni.html">Alumni</a></li>
        <li><a href="https://sites.google.com/ggcollege.in/krc/" target="_blank" rel="noopener noreferrer">Library</a></li>
        <li><a href="#">More <i class="fas fa-chevron-down"></i></a></li>
      </ul>
    </div>
  </nav>

  <div class="notice-bar" role="alert">
    <div class="container">
      <span class="notice-icon">Notice</span>
      <span class="notice-text">
        <a href="https://www.ggcollege.ac.in/uploaded_files/PhD-RD_Notice_.pdf" target="_blank">Ph.D. Admission in Rural Development - Apply Now</a>
      </span>
      <button class="notice-close" aria-label="Dismiss notice">&amp;times;</button>
    </div>
  </div>

  <section class="page-header">
    <div class="container">
      <h1>Departments</h1>
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>
        <span class="breadcrumb-current">Departments</span>
      </nav>
    </div>
  </section>

  <main id="main-content">

    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Academic Departments</h2>
          <p>St. Gonsalo Garcia College offers a wide range of programmes through its dedicated academic departments.</p>
        </div>

        <div class="card" style="margin-bottom:2rem;">
          <div class="grid-2" style="align-items:center;">
            <div>
              <img src="../images/Arts.svg" alt="Arts Department" style="width:100%;max-width:200px;height:auto;">
            </div>
            <div>
              <h3>Department of Arts</h3>
              <p>The Department of Arts offers undergraduate and postgraduate programmes in diverse disciplines committed to fostering critical thinking and creativity.</p>
              <p><strong>Faculty Count:</strong> 12</p>
              <p><strong>Programmes:</strong> B.A. (3 Years), M.A. (2 Years)</p>
              <p><strong>HOD:</strong> Dr. Anita Mehra</p>
              <a href="programmes.html#ba" class="btn btn-outline btn-sm">View Programmes</a>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:2rem;">
          <div class="grid-2" style="align-items:center;">
            <div style="order:2;">
              <img src="../images/Commerce.svg" alt="Commerce Department" style="width:100%;max-width:200px;height:auto;">
            </div>
            <div style="order:1;">
              <h3>Department of Commerce</h3>
              <p>The Department of Commerce offers specialized programmes preparing students for careers in finance, banking and management.</p>
              <p><strong>Faculty Count:</strong> 18</p>
              <p><strong>Programmes:</strong> B.Com, B.Com (A&amp;F), B.Com (B&amp;I), BMS, M.Com</p>
              <p><strong>HOD:</strong> Dr. Ramesh Iyer</p>
              <a href="programmes.html#bcom" class="btn btn-outline btn-sm">View Programmes</a>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:2rem;">
          <div class="grid-2" style="align-items:center;">
            <div>
              <img src="../images/Science.svg" alt="Science and IT Department" style="width:100%;max-width:200px;height:auto;">
            </div>
            <div>
              <h3>Department of Science &amp; Information Technology</h3>
              <p>The Department of Science &amp; IT offers cutting-edge programmes in IT and Data Science for the digital economy.</p>
              <p><strong>Faculty Count:</strong> 10</p>
              <p><strong>Programmes:</strong> B.Sc. IT, B.Sc. Data Science, M.Sc. IT</p>
              <p><strong>HOD:</strong> Dr. Kavita Joshi</p>
              <a href="programmes.html#bsit" class="btn btn-outline btn-sm">View Programmes</a>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="grid-2" style="align-items:center;">
            <div style="order:2;">
              <img src="../images/GG-College-Logo.svg" alt="Research Department" style="width:100%;max-width:200px;height:auto;">
            </div>
            <div style="order:1;">
              <h3>Department of Research &amp; Ph.D.</h3>
              <p>The college offers Ph.D. in Rural Development contributing to research in socio-economic issues and rural transformation.</p>
              <p><strong>Research Guides:</strong> 5</p>
              <p><strong>Programmes:</strong> Ph.D. Rural Development</p>
              <p><strong>Coordinator:</strong> Dr. Vikram Joshi</p>
              <a href="programmes.html#phd" class="btn btn-outline btn-sm">View Programme</a>
            </div>
          </div>
        </div>

      </div>
    </section>

  </main>

  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>College Identity</h4>
          <p><strong>St. Gonsalo Garcia College of Arts and Commerce</strong></p>
          <p>Our Lady of Grace Trusts | Vasai</p>
          <p style="font-style:italic;color:var(--color-secondary);margin-top:0.5rem;">&quot;Swaprakashen Dippyatham &mdash; Let Thy Light Shine&quot;</p>
          <div class="footer-social">
            <a href="https://www.facebook.com/gonsalo.garcia.3551/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com/principalggc" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="https://www.instagram.com/gonsalogarciacollege/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/channel/UCO9lpSiRd4GON7BNUmW2Y1g" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            <a href="https://www.linkedin.com/in/principal-office-117209214/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a href="../index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="programmes.html">Programmes</a>
          <a href="academic.html">Academic</a>
          <a href="student-corner.html">Student Corner</a>
          <a href="activities.html">Activities</a>
          <a href="facilities.html">Facilities</a>
          <a href="contact.html">Contact Us</a>
        </div>
        <div class="footer-col">
          <h4>Important Links</h4>
          <a href="https://muugadmission.samarth.edu.in/" target="_blank" rel="noopener noreferrer">University of Mumbai</a>
          <a href="https://enrollonline.co.in/Registration/Apply/SGGC" target="_blank" rel="noopener noreferrer">Admission Portal</a>
          <a href="https://sites.google.com/ggcollege.in/krc/" target="_blank" rel="noopener noreferrer">Library</a>
          <a href="iqac.html">IQAC</a>
          <a href="naac.html">NAAC</a>
          <a href="nirf.html">NIRF</a>
          <a href="alumni.html">Alumni</a>
          <a href="../admin/login.html">Admin Login</a>
        </div>
        <div class="footer-col">
          <h4>Programmes</h4>
          <a href="programmes.html#ba">B.A.</a>
          <a href="programmes.html#bcom">B.Com</a>
          <a href="programmes.html#baf">B.Com (A&amp;F)</a>
          <a href="programmes.html#bms">BMS</a>
          <a href="programmes.html#bbi">B.Com (B&amp;I)</a>
          <a href="programmes.html#bsit">B.Sc. IT</a>
          <a href="programmes.html#datascience">B.Sc. Data Science</a>
          <a href="programmes.html#phd">Ph.D. Rural Development</a>
        </div>
        <div class="footer-col">
          <h4>Contact Us</h4>
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>St. Gonsalo Garcia College, Behind Vasai Cricket Ground, Vasai - 401201</span>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <span><a href="tel:7767811134">77678 11134</a></span>
          </div>
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <span><a href="mailto:office@ggcollege.in">office@ggcollege.in</a></span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&amp;copy; 2026 St. Gonsalo Garcia College. All rights reserved.</span>
        <div class="footer-bottom-links">
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="accessibility-statement.html">Accessibility</a>
          <a href="../sitemap.html">Sitemap</a>
          <span>Last Updated: 11 Jul 2026</span>
        </div>
      </div>
    </div>
  </footer>

  <div class="search-overlay" id="searchOverlay" role="dialog" aria-label="Search">
    <button class="search-close" id="searchClose" aria-label="Close search">&amp;times;</button>
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Search pages, notices, courses..." aria-label="Search query">
      <div class="search-results" id="searchResults"></div>
    </div>
  </div>

  <div class="important-notice-popup" id="importantNoticePopup" role="dialog" aria-label="Important Notice">
    <div class="popup-content">
      <button class="popup-close" id="noticePopupClose">&amp;times;</button>
      <h3>Important Notice</h3>
      <div class="popup-date">10 Jul 2026 | General</div>
      <div class="popup-body">
        <p>All students are required to wear their college ID cards and follow the prescribed dress code with immediate effect.</p>
      </div>
      <div class="popup-options">
        <label><input type="checkbox" id="noticeDontShow"> Dont show again today</label>
      </div>
    </div>
  </div>

  <div class="notice-modal" id="noticeModal">
    <div class="notice-modal-content">
      <button class="notice-modal-close" id="noticeModalClose">&amp;times;</button>
      <h3>Notice Title</h3>
      <div class="notice-meta">Date | Category</div>
      <div class="notice-body">Notice content...</div>
    </div>
  </div>

  <div class="lightbox" id="lightbox" role="dialog" aria-label="Image viewer">
    <button class="lightbox-close" id="lightboxClose">&amp;times;</button>
    <button class="lightbox-prev" id="lightboxPrev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
    <img id="lightboxImg" src="" alt="">
    <button class="lightbox-next" id="lightboxNext" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
  </div>

  <div class="access-panel" id="accessPanel">
    <h4>Accessibility</h4>
    <button id="fontNormal">Normal Font</button>
    <button id="fontLarge">Large Font</button>
    <button id="contrastToggle">High Contrast</button>
    <button id="motionToggle">Reduce Motion</button>
  </div>

  <button class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fas fa-arrow-up"></i></button>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>'

$depMeta | Out-File -FilePath "$pagesDir\departments.html" -Encoding utf8
Write-Output "departments.html written"

Write-Output "All pages generated successfully!"

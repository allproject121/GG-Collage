const fs = require('fs');
let content = fs.readFileSync('public/pages/gallery.html', 'utf8');
const mainStart = content.indexOf('<main');
const mainEnd = content.indexOf('</main>') + 7;

const newMain = `<main id="main-content" class="page-transition">
  <!-- ===== GALLERY INTRODUCTION & FILTERS ===== -->
  <section class="section glass-card card-shine card-gold-top" style="padding-bottom: 1.5rem;">
    <div class="container">
      <div class="section-header reveal">
        <h2>Explore Our Photo Gallery</h2>
        <p>Glimpses of campus life, academic excellence, dignitary visits, and vibrant cultural spirit at St. Gonsalo Garcia College, Vasai</p>
      </div>
      <div class="gallery-filters reveal">
        <button type="button" class="gallery-filter-btn active" data-filter="all" aria-pressed="true"><i class="fas fa-th-large"></i> All Photos</button>
        <button type="button" class="gallery-filter-btn" data-filter="campus" aria-pressed="false"><i class="fas fa-university"></i> Campus &amp; Infrastructure</button>
        <button type="button" class="gallery-filter-btn" data-filter="academics" aria-pressed="false"><i class="fas fa-graduation-cap"></i> Conferences &amp; Academics</button>
        <button type="button" class="gallery-filter-btn" data-filter="dignitaries" aria-pressed="false"><i class="fas fa-user-tie"></i> Dignitaries &amp; Visits</button>
        <button type="button" class="gallery-filter-btn" data-filter="cultural" aria-pressed="false"><i class="fas fa-music"></i> Cultural &amp; Events</button>
        <button type="button" class="gallery-filter-btn" data-filter="sports" aria-pressed="false"><i class="fas fa-running"></i> Sports &amp; Athletics</button>
      </div>
    </div>
  </section>

  <!-- ===== ALBUM 1: Campus & Infrastructure ===== -->
  <section class="section section-alt glass-card card-shine card-gold-top gallery-album-section" id="album-campus" data-category="campus">
    <div class="container">
      <h3 class="album-title"><i class="fas fa-university"></i> Campus &amp; Infrastructure</h3>
      <p class="album-desc">Serene campus environment behind Vasai Cricket Ground, equipped with modern academic blocks, auditoriums, and smart classrooms.</p>
      <div class="gallery-grid reveal-stagger">
        <div class="gallery-item">
          <img src="../images/banner-image-college.jpg" alt="St. Gonsalo Garcia College Campus Frontage" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Main College Entrance &amp; Heritage Campus</div>
        </div>
        <div class="gallery-item">
          <img src="../images/gallery-real-1.jpg" alt="College Courtyard and Quadrangle" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Central Courtyard &amp; Academic Wings</div>
        </div>
        <div class="gallery-item">
          <img src="../images/gallery-real-2.jpg" alt="Modern Audio-Visual Seminar Hall" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Fully Air-Conditioned Seminar Hall</div>
        </div>
        <div class="gallery-item">
          <img src="../images/admission-banner.jpg" alt="Student Facilitation and Admission Center" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Student Facilitation &amp; Admin Wing</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ALBUM 2: International Conference on Sustainable Development ===== -->
  <section class="section glass-card card-shine card-gold-top gallery-album-section" id="album-conference" data-category="academics">
    <div class="container">
      <h3 class="album-title"><i class="fas fa-globe"></i> International Conference on Sustainable Development</h3>
      <p class="album-desc">Multidisciplinary international conference bringing together national and global academic delegates, researchers, and distinguished scholars.</p>
      <div class="gallery-grid reveal-stagger">
        <div class="gallery-item">
          <img src="../images/thumb-1.jpg" alt="International Conference - Inaugural Lighting of Lamp" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Inauguration &amp; Lighting of Lamp</div>
        </div>
        <div class="gallery-item">
          <img src="../images/thumb-2.jpg" alt="International Conference - Keynote Paper Presentation" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Keynote Research Presentation</div>
        </div>
        <div class="gallery-item">
          <img src="../images/gallery-real-3.jpg" alt="Academic Council &amp; Resource Persons dais" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Distinguished Panel on Dais</div>
        </div>
        <div class="gallery-item">
          <img src="../images/Certificate.png" alt="NAAC Re-Accreditation Certificate" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">NAAC Re-Accreditation Honors</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ALBUM 3: Dignitaries & Archbishop Visit ===== -->
  <section class="section section-alt glass-card card-shine card-gold-top gallery-album-section" id="album-archbishop" data-category="dignitaries">
    <div class="container">
      <h3 class="album-title"><i class="fas fa-church"></i> Archbishop Leopoldo Girelli's Pastoral Visit</h3>
      <p class="album-desc">Historic pastoral and institutional visit of Archbishop Leopoldo Girelli, Apostolic Nuncio to India, to St. Gonsalo Garcia College.</p>
      <div class="gallery-grid reveal-stagger">
        <div class="gallery-item">
          <img src="../images/thumb-3.jpg" alt="Archbishop Leopoldo Girelli Felicitation Ceremony" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Felicitation of Apostolic Nuncio</div>
        </div>
        <div class="gallery-item">
          <img src="../images/chairman.jpg" alt="Most Rev. Thomas D'Souza, Chairman" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Most Rev. Thomas D'Souza - Chairman</div>
        </div>
        <div class="gallery-item">
          <img src="../images/principal.jpg" alt="Dr. Somnath Vibhute, I/C Principal" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Dr. Somnath Vibhute - I/C Principal</div>
        </div>
        <div class="gallery-item">
          <img src="../images/gallery-real-3.jpg" alt="Dignitaries and Management Council" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Management Trust &amp; Academic Council</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ALBUM 4: Career Guidance & Competitive Exams ===== -->
  <section class="section glass-card card-shine card-gold-top gallery-album-section" id="album-upsc" data-category="academics">
    <div class="container">
      <h3 class="album-title"><i class="fas fa-book-reader"></i> UPSC / MPSC &amp; Career Katta Center</h3>
      <p class="album-desc">Equipping students of Vasai and Palghar district with competitive exam coaching, interview guidance, and professional career pathways.</p>
      <div class="gallery-grid reveal-stagger">
        <div class="gallery-item">
          <img src="../images/thumb-4.jpg" alt="UPSC / MPSC Guidance Inauguration" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Inauguration of Competitive Exam Wing</div>
        </div>
        <div class="gallery-item">
          <img src="../images/thumb-2.jpg" alt="Expert Lecture on Civil Services Preparation" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Civil Services Preparation Masterclass</div>
        </div>
        <div class="gallery-item">
          <img src="../images/gallery-real-2.jpg" alt="Career Katta Orientation in Seminar Hall" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Career Katta Orientation Seminar</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ALBUM 5: Farewell & Convocation Ceremony ===== -->
  <section class="section section-alt glass-card card-shine card-gold-top gallery-album-section" id="album-convocation" data-category="cultural">
    <div class="container">
      <h3 class="album-title"><i class="fas fa-user-graduate"></i> Convocation &amp; Farewell Functions</h3>
      <p class="album-desc">Celebrating academic achievements, graduation honors, and emotional farewells for our outgoing batches.</p>
      <div class="gallery-grid reveal-stagger">
        <div class="gallery-item">
          <img src="../images/thumb-5.jpg" alt="Degree Distribution and Convocation" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Annual Degree Distribution Ceremony</div>
        </div>
        <div class="gallery-item">
          <img src="../images/thumb-1.jpg" alt="Farewell Felicitation by Juniors" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Graduation Felicitation &amp; Honours</div>
        </div>
        <div class="gallery-item">
          <img src="../images/gallery-real-3.jpg" alt="Faculty Blessings to Graduates" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Faculty Valedictory Address</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ALBUM 6: Cultural Events & Youth Fest ===== -->
  <section class="section glass-card card-shine card-gold-top gallery-album-section" id="album-cultural" data-category="cultural">
    <div class="container">
      <h3 class="album-title"><i class="fas fa-guitar"></i> Cultural Events &amp; Youth Festival</h3>
      <p class="album-desc">Vibrant music, dance, theatre, and artistic celebrations showcasing the diverse talents of GG College youth.</p>
      <div class="gallery-grid reveal-stagger">
        <div class="gallery-item">
          <img src="../images/thumb-6.jpg" alt="Cultural Dance Performance" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Annual Youth Festival Performances</div>
        </div>
        <div class="gallery-item">
          <img src="../images/thumb-5.jpg" alt="Stage Show &amp; Musical Events" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Inter-Collegiate Music &amp; Theatre</div>
        </div>
        <div class="gallery-item">
          <img src="../images/thumb-1.jpg" alt="Traditional Day Celebrations" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Ethnic &amp; Traditional Day Celebrations</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== ALBUM 7: Annual Sports Day ===== -->
  <section class="section section-alt glass-card card-shine card-gold-top gallery-album-section" id="album-sports" data-category="sports">
    <div class="container">
      <h3 class="album-title"><i class="fas fa-running"></i> Annual Sports Day &amp; Athletic Meet</h3>
      <p class="album-desc">Promoting fitness, sportsmanship, and athletic excellence across track, field, and indoor sporting events.</p>
      <div class="gallery-grid reveal-stagger">
        <div class="gallery-item">
          <img src="../images/thumb-7.jpg" alt="Track and Field Athletic Competitions" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Track &amp; Field Athletic Meet</div>
        </div>
        <div class="gallery-item">
          <img src="../images/thumb-6.jpg" alt="Trophy &amp; Medal Distribution Ceremony" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Championship Trophy &amp; Medal Honours</div>
        </div>
        <div class="gallery-item">
          <img src="../images/thumb-4.jpg" alt="Inter-Class Cricket &amp; Football Tournament" loading="lazy" class="image-blur-up">
          <div class="gallery-caption">Inter-Collegiate Team Sports</div>
        </div>
      </div>
    </div>
  </section>
</main>`;

content = content.slice(0, mainStart) + newMain + content.slice(mainEnd);
fs.writeFileSync('public/pages/gallery.html', content, 'utf8');
console.log('Successfully updated gallery.html with real photos and category filters!');

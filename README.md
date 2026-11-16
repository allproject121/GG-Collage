# St. Gonsalo Garcia College of Arts and Commerce (GG College) - Web Portal

> **Official Modern Web Portal for St. Gonsalo Garcia College of Arts and Commerce**, Vasai West, Palghar, Maharashtra (Affiliated to the University of Mumbai, Re-accredited with 'B' Grade by NAAC).

---

## 🏛️ About the College
**St. Gonsalo Garcia College of Arts and Commerce**, established in 1984 by the *Catholic Diocese of Vasai* (under Our Lady of Grace Trust), is a premier higher education institution in Vasai-Virar region. The college offers undergraduate, postgraduate, and self-financing professional courses affiliated with the University of Mumbai.

- **Motto:** *"Swaprakashen Dippyatham — Let Thy Light Shine"*
- **Location:** Papdy, Vasai West, Dist. Palghar - 401 207, Maharashtra, India
- **Accreditation:** NAAC Re-accredited with 'B' Grade

---

## 🚀 Key Features & Highlights

### ⚡ Performance & Zero-Lag Architecture
- **60 FPS Smooth Scrolling:** Optimized CSS and script execution without heavy GPU backdrop filters or thrashing listeners.
- **Instant Rendering:** Immediate component rendering with zero opacity blockers or delayed scroll triggers.
- **Auto-Responsive Layout:** Pixel-perfect layout adaptation across mobile (375px+), tablet (768px - 1024px), and desktop (1440px+) screens without any horizontal overflow.

### 📚 Academics & Programmes
- **Undergraduate Programmes:** B.A., B.Com, BMS, BAF (Accounting & Finance), BBI (Banking & Insurance), BFM (Financial Markets), B.Sc. (Information Technology), B.Sc. (Data Science).
- **Postgraduate & Research:** M.Com, M.A., and Ph.D. research programmes.
- **Add-on & Certificate Courses:** Skill-development and value-added courses aligned with National Education Policy (NEP 2020).
- **Outcome-Based Education (OBE):** Defined Course Outcomes (CO), Programme Outcomes (PO), and CO-PO mapping matrix.

### 📝 Admissions & Student Services
- **Online Admission Integration:** Direct integration with Mumbai University & SGGC Online Admission Portal (`enrollonline.co.in`).
- **Admission Tracking:** Live status check portal for application forms.
- **Student Grievance Redressal Portal:** Online grievance submission and status tracking.
- **Career Katta & Placement Cell:** Career guidance, competitive examination preparation (UPSC/MPSC/Banking), and placement drives.
- **Committees & Cells:** Women Development Cell (WDC), IQAC, NIRF, NSS, NCC, Cultural & Sports committees.

### 📑 Examination Portal
- **Real-Time Exam Notices & Timetables:** Department-wise timetable downloads.
- **Results & Revaluation:** Direct links to semester examination results and revaluation forms.
- **Question Paper Archive:** Past semester examination question papers for student revision.

### ♿ Accessibility & Search
- **Universal Accessibility Tool:** Interactive accessibility panel supporting font size adjustment (Normal, Large, Extra Large), high-contrast mode, dyslexia-friendly readable font, link underlines, and reduced motion.
- **Instant Global Search:** Real-time search across all 37+ college pages, notices, departments, and downloadable forms.

---

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose (with automated in-memory mock data fallback for 100% offline uptime)
- **Frontend:** Semantic HTML5, Modern CSS3 (CSS Variables, Flexbox, Grid), Vanilla JavaScript (ES6+)
- **Security & Utilities:** Helmet, CORS, Rate Limiting, Centralized Error Handling, Express Validator
- **Assets:** Official college crest, campus quad photography, faculty & leadership portraits

---

## 📂 Project Structure

```text
GG-Collage/
├── config/              # Database connection & configurations
├── middleware/          # Authentication & validation middleware
├── models/              # Mongoose schema models (Notice, Exam, Faculty, etc.)
├── public/              # Frontend client assets
│   ├── admin/           # Administrative portal (dashboard, login)
│   ├── css/             # Stylesheets (style, animations, components, responsive, accessibility)
│   ├── images/          # Official college images, banners, logos & icons
│   ├── js/              # Modular JavaScript (main, navigation, search, accessibility, etc.)
│   ├── pages/           # 37+ Subpages (about, admissions, programmes, examination, etc.)
│   └── index.html       # Primary College Homepage
├── routes/              # Express API route controllers
│   ├── noticeRoutes.js
│   ├── examinationRoutes.js
│   ├── facultyRoutes.js
│   └── downloadRoutes.js
├── scripts/             # Asset synchronization & verification scripts
├── utils/               # Mock data store, helpers & fallback handlers
├── .gitignore           # Git ignore configuration
├── package.json         # Dependencies and project metadata
├── server.js            # Main Express application entrypoint
└── README.md            # Project documentation
```

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- [Git](https://git-scm.com/)
- (Optional) [MongoDB](https://www.mongodb.com/) running locally or via MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/allproject121/GG-Collage.git
cd GG-Collage
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ggcollege
SESSION_SECRET=your_secret_key_here
```
*(Note: If MongoDB is not running, the application automatically boots into zero-lag standalone mode using the built-in mock datastore.)*

### 4. Run the Server
```bash
npm start
# or using node directly:
node server.js
```

Open your browser and navigate to:
- **Local machine:** [http://localhost:3000](http://localhost:3000)
- **Local Network / Mobile Wi-Fi:** `http://<YOUR_LOCAL_IP>:3000`

---

## 🔗 Key Endpoints & APIs

| Route | Method | Description |
|---|---|---|
| `/` | `GET` | Main College Homepage |
| `/api/notices` | `GET` | Retrieve latest college notices & circulars |
| `/api/examination/notices` | `GET` | Exam circulars & updates |
| `/api/examination/timetables` | `GET` | Course & semester timetables |
| `/api/examination/results` | `GET` | University exam result links |
| `/api/examination/question-papers` | `GET` | Question papers archive |
| `/api/faculty` | `GET` | Faculty staff directory by department |
| `/api/gallery` | `GET` | Campus & event photo gallery items |

---

## 📜 License & Credits
- Developed for **St. Gonsalo Garcia College of Arts and Commerce, Vasai**.
- All official emblems, trademarks, and campus imagery belong to **Our Lady of Grace Trust / St. Gonsalo Garcia College**.

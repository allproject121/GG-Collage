/**
 * Fallback data provider for St. Gonsalo Garcia College, Vasai
 * Used seamlessly when MongoDB is offline or disconnected so all features
 * and pages load in <1ms without 10-second connection timeouts or lag.
 */

const mockNotices = [
  {
    _id: 'mock-notice-1',
    title: 'Ph.D. Admission in Rural Development (2026) — Apply Now',
    shortDescription: 'Applications are invited from eligible candidates for admission to Ph.D. in Rural Development research center.',
    body: 'Applications are invited from eligible candidates for admission to Ph.D. in Rural Development affiliated to the University of Mumbai. Interested candidates must submit their application form along with PET/NET/SET certificates to the research center office.',
    category: 'Admission',
    department: 'Research',
    noticeDate: new Date('2026-07-10'),
    pdfUrl: 'https://www.ggcollege.ac.in/uploaded_files/PhD-RD_Notice_.pdf',
    isImportant: true,
    isPinned: true,
    status: 'Published'
  },
  {
    _id: 'mock-notice-2',
    title: 'First Year UG (B.A., B.Com, BMS, B.Sc. IT) Online Admissions 2026',
    shortDescription: 'Online admission process for First Year Degree College programmes has commenced on University and College portals.',
    body: 'All aspiring students seeking admission to FY B.A., B.Com, B.Com (A&F), B.Com (B&I), B.M.S., and B.Sc. (IT) must first register on the University of Mumbai portal and then complete the college application form online.',
    category: 'Admission',
    department: 'Admissions',
    noticeDate: new Date('2026-06-15'),
    externalUrl: 'https://enrollonline.co.in/Registration/Apply/SGGC',
    isImportant: true,
    isPinned: true,
    status: 'Published'
  },
  {
    _id: 'mock-notice-3',
    title: 'Mandatory ID Card & College Dress Code Compliance',
    shortDescription: 'All students must display college ID cards and adhere to the prescribed campus dress code.',
    body: 'All students are strictly required to wear their college ID cards while on campus and follow the prescribed college dress code with immediate effect. Non-compliance will invite disciplinary action.',
    category: 'General',
    department: 'General Administration',
    noticeDate: new Date('2026-07-08'),
    isImportant: true,
    isPinned: false,
    status: 'Published'
  },
  {
    _id: 'mock-notice-4',
    title: 'University Examination Timetable for Semester II & IV (Regular & ATKT)',
    shortDescription: 'Detailed examination timetable released for B.Com, B.A., and B.Sc. IT Semester II and Semester IV.',
    body: 'The University of Mumbai semester end examination timetable for FY and SY regular and ATKT students has been published on the examination notice board and student corner.',
    category: 'Examination',
    department: 'Examination',
    noticeDate: new Date('2026-05-20'),
    isImportant: false,
    isPinned: false,
    status: 'Published'
  },
  {
    _id: 'mock-notice-5',
    title: 'UPSC / MPSC Free Competitive Examination Coaching Batch Registration',
    shortDescription: 'Career Katta organises free guidance sessions and study material distribution for civil services aspirants.',
    body: 'St. Gonsalo Garcia College Career Katta Centre announces the commencement of a fresh batch for UPSC / MPSC competitive examinations. Registrations are open to all second and third year students.',
    category: 'Placement',
    department: 'Career Katta',
    noticeDate: new Date('2026-05-12'),
    isImportant: false,
    isPinned: false,
    status: 'Published'
  },
  {
    _id: 'mock-notice-6',
    title: 'International Multidisciplinary Conference on Sustainable Development — Proceedings',
    shortDescription: 'Conference proceedings and research paper compendium now available in the Knowledge Resource Centre.',
    body: 'The research compendium featuring scholarly papers presented during the International Conference on Sustainable Development has been catalogued in the college central library.',
    category: 'IQAC',
    department: 'IQAC',
    noticeDate: new Date('2026-04-28'),
    isImportant: false,
    isPinned: false,
    status: 'Published'
  }
];

const mockEvents = [
  {
    _id: 'mock-event-1',
    title: 'Awareness Campaign: Surakshit Bachpan, Surakshit Bhavishya',
    description: 'Implementation of state-level student safety, gender sensitization, and community awareness programme.',
    eventDate: new Date('2026-06-20'),
    time: '10:00 AM - 01:00 PM',
    venue: 'College Quadrangle, Vasai',
    category: 'Awareness',
    imageUrl: 'images/thumb-4.jpg'
  },
  {
    _id: 'mock-event-2',
    title: 'One Day Multidisciplinary International Conference',
    description: 'International scholars and researchers assemble to address contemporary sustainable economic growth.',
    eventDate: new Date('2026-05-15'),
    time: '09:30 AM - 05:00 PM',
    venue: 'College Seminar Hall & Auditorium',
    category: 'Conference',
    imageUrl: 'images/thumb-1.jpg'
  },
  {
    _id: 'mock-event-3',
    title: 'Annual Convocation & Degree Certificate Distribution',
    description: 'Honouring our graduating students of Arts, Commerce, and Information Technology.',
    eventDate: new Date('2026-04-10'),
    time: '10:30 AM onwards',
    venue: 'St. Gonsalo Garcia College Auditorium',
    category: 'Convocation',
    imageUrl: 'images/thumb-5.jpg'
  },
  {
    _id: 'mock-event-4',
    title: 'Annual Sports Day & Athletic Meet',
    description: 'Track and field events, inter-class championships, and athletic awards distribution.',
    eventDate: new Date('2026-03-05'),
    time: '08:00 AM - 04:00 PM',
    venue: 'Vasai Cricket Ground & College Sports Arena',
    category: 'Sports',
    imageUrl: 'images/thumb-7.jpg'
  }
];

const mockDepartments = [
  { _id: 'dept-1', name: 'Commerce & Accountancy', code: 'COM', description: 'Department offering B.Com, B.Com A&F, B.Com B&I, and M.Com.' },
  { _id: 'dept-2', name: 'Information Technology', code: 'IT', description: 'Department offering B.Sc. IT, M.Sc. IT, and B.Sc. Data Science.' },
  { _id: 'dept-3', name: 'Management Studies (BMS)', code: 'BMS', description: 'Department offering Bachelor of Management Studies in Finance, Marketing & HR.' },
  { _id: 'dept-4', name: 'English', code: 'ENG', description: 'Department offering B.A. and M.A. in English Literature & Communication.' },
  { _id: 'dept-5', name: 'Economics', code: 'ECO', description: 'Department offering B.A. and Ph.D. research programmes in Economics.' },
  { _id: 'dept-6', name: 'Rural Development', code: 'RD', description: 'Dedicated Ph.D. research centre in Rural Development studies.' }
];

const mockFaculty = [
  {
    _id: 'fac-1',
    name: 'Dr. Somnath Vibhute',
    fullName: 'Dr. Somnath Vibhute',
    designation: 'I/C Principal & Professor',
    department: 'Commerce & Accountancy',
    departmentId: { _id: 'dept-1', name: 'Commerce & Accountancy', slug: 'com' },
    qualification: 'M.Com, Ph.D.',
    specialisation: 'Advanced Accountancy & Financial Management',
    email: 'principal@ggcollege.in',
    photoUrl: '../images/principal.jpg',
    profileImageUrl: '../images/principal.jpg'
  },
  {
    _id: 'fac-2',
    name: 'Prof. Joseph Rodrigues',
    fullName: 'Prof. Joseph Rodrigues',
    designation: 'Vice Principal & Associate Professor',
    department: 'Commerce & Accountancy',
    departmentId: { _id: 'dept-1', name: 'Commerce & Accountancy', slug: 'com' },
    qualification: 'M.Com, M.Phil',
    specialisation: 'Business Economics & Financial Markets',
    email: 'viceprincipal@ggcollege.in',
    photoUrl: '../images/principal.jpg',
    profileImageUrl: '../images/principal.jpg'
  },
  {
    _id: 'fac-3',
    name: 'Dr. Sneha Patil',
    fullName: 'Dr. Sneha Patil',
    designation: 'Associate Professor & HOD',
    department: 'English',
    departmentId: { _id: 'dept-4', name: 'English', slug: 'eng' },
    qualification: 'M.A., Ph.D.',
    specialisation: 'Indian English Literature & Cultural Studies',
    email: 'english@ggcollege.in',
    photoUrl: '../images/thumb-2.jpg',
    profileImageUrl: '../images/thumb-2.jpg'
  },
  {
    _id: 'fac-4',
    name: 'Prof. Amit Deshmukh',
    fullName: 'Prof. Amit Deshmukh',
    designation: 'Assistant Professor & Coordinator',
    department: 'Information Technology',
    departmentId: { _id: 'dept-2', name: 'Information Technology', slug: 'it' },
    qualification: 'M.Sc. IT, NET',
    specialisation: 'Data Science, Cloud Computing & AI',
    email: 'it@ggcollege.in',
    photoUrl: '../images/thumb-4.jpg',
    profileImageUrl: '../images/thumb-4.jpg'
  },
  {
    _id: 'fac-5',
    name: 'Dr. Vinod Nair',
    fullName: 'Dr. Vinod Nair',
    designation: 'Associate Professor',
    department: 'Economics',
    departmentId: { _id: 'dept-5', name: 'Economics', slug: 'eco' },
    qualification: 'M.A. Economics, Ph.D.',
    specialisation: 'Rural Economics & Development Studies',
    email: 'economics@ggcollege.in',
    photoUrl: '../images/thumb-1.jpg',
    profileImageUrl: '../images/thumb-1.jpg'
  },
  {
    _id: 'fac-6',
    name: 'Prof. Meena Sharma',
    fullName: 'Prof. Meena Sharma',
    designation: 'Assistant Professor',
    department: 'Banking & Insurance',
    departmentId: { _id: 'dept-1', name: 'Commerce & Accountancy', slug: 'com' },
    qualification: 'M.Com, MBA Finance',
    specialisation: 'Banking Regulations & Risk Analysis',
    email: 'banking@ggcollege.in',
    photoUrl: '../images/thumb-6.jpg',
    profileImageUrl: '../images/thumb-6.jpg'
  },
  {
    _id: 'fac-7',
    name: 'Prof. Rahul Gonsalves',
    fullName: 'Prof. Rahul Gonsalves',
    designation: 'Assistant Professor',
    department: 'Management Studies (BMS)',
    departmentId: { _id: 'dept-3', name: 'Management Studies (BMS)', slug: 'bms' },
    qualification: 'MMS Marketing, UGC-NET',
    specialisation: 'Strategic Marketing & Consumer Behaviour',
    email: 'bms@ggcollege.in',
    photoUrl: '../images/thumb-3.jpg',
    profileImageUrl: '../images/thumb-3.jpg'
  },
  {
    _id: 'fac-8',
    name: 'Prof. Priya Fernandes',
    fullName: 'Prof. Priya Fernandes',
    designation: 'Assistant Professor',
    department: 'Accounting & Finance (BAF)',
    departmentId: { _id: 'dept-1', name: 'Commerce & Accountancy', slug: 'com' },
    qualification: 'M.Com, CA-Inter',
    specialisation: 'Auditing, Taxation & Corporate Accounting',
    email: 'baf@ggcollege.in',
    photoUrl: '../images/thumb-5.jpg',
    profileImageUrl: '../images/thumb-5.jpg'
  }
];

const mockDownloads = [
  { _id: 'dl-1', title: 'College Prospectus 2026-27', category: 'Prospectus', fileUrl: 'https://www.ggcollege.ac.in/GG_COLLEGE_PROSPECTUS_cnv-23-06-25.pdf', fileType: 'pdf' },
  { _id: 'dl-2', title: 'College Organogram & Administrative Structure', category: 'Policy', fileUrl: 'https://www.ggcollege.ac.in/uploaded_files/Organisation_for_web.pdf', fileType: 'pdf' },
  { _id: 'dl-3', title: 'Ph.D. Rural Development Application Notice', category: 'Admission', fileUrl: 'https://www.ggcollege.ac.in/uploaded_files/PhD-RD_Notice_.pdf', fileType: 'pdf' },
  { _id: 'dl-4', title: 'FY B.Com / B.A. Syllabus (CBCS & NEP Curriculum)', category: 'Syllabus', fileUrl: 'https://www.ggcollege.ac.in/', fileType: 'pdf' },
  { _id: 'dl-5', title: 'Examination Revaluation & Verification Form', category: 'Examination Forms', fileUrl: 'https://www.ggcollege.ac.in/', fileType: 'pdf' }
];

const mockExamNotices = [
  { _id: 'en-1', title: 'Semester II & IV Hall Ticket Distribution Notice', noticeDate: new Date('2026-05-10'), isImportant: true, status: 'Published' },
  { _id: 'en-2', title: 'ATKT Examination Application Form Submission Schedule', noticeDate: new Date('2026-04-18'), isImportant: false, status: 'Published' }
];

const mockExamTimetables = [
  { _id: 'tt-1', title: 'FY B.Com & B.A. Semester II Examination Timetable (Summer 2026)', programme: 'B.Com / B.A.', semester: 'Sem II', academicYear: '2025-2026', fileUrl: 'https://www.ggcollege.ac.in/' },
  { _id: 'tt-2', title: 'SY B.Sc. IT Semester IV Examination Timetable (Summer 2026)', programme: 'B.Sc. IT', semester: 'Sem IV', academicYear: '2025-2026', fileUrl: 'https://www.ggcollege.ac.in/' }
];

const mockResultLinks = [
  { _id: 'res-1', title: 'TY B.Com Semester VI Examination Results', programme: 'B.Com', semester: 'Sem VI', academicYear: '2025-2026', linkUrl: 'https://muugadmission.samarth.edu.in/' },
  { _id: 'res-2', title: 'TY B.Sc. IT Semester VI Examination Results', programme: 'B.Sc. IT', semester: 'Sem VI', academicYear: '2025-2026', linkUrl: 'https://muugadmission.samarth.edu.in/' }
];

const mockQuestionPapers = [
  { _id: 'qp-1', title: 'Financial Accounting - Sem I (Winter 2025)', programme: 'B.Com', semester: 'Sem I', year: 2025, fileUrl: 'https://www.ggcollege.ac.in/' },
  { _id: 'qp-2', title: 'Python Programming - Sem II (Summer 2025)', programme: 'B.Sc. IT', semester: 'Sem II', year: 2025, fileUrl: 'https://www.ggcollege.ac.in/' }
];

const mockGallery = [
  { _id: 'gal-1', title: 'College Campus & Academic Quad', imageUrl: 'images/banner-image-college.jpg', album: 'Campus Life', category: 'Campus', caption: 'St. Gonsalo Garcia College Campus Building', displayOrder: 1, isFeatured: true },
  { _id: 'gal-2', title: 'Faculty of Arts Seminar', imageUrl: 'images/Arts.jpg', album: 'Academics', category: 'Academic', caption: 'Annual Arts Colloquium & Interactive Workshop', displayOrder: 2, isFeatured: true },
  { _id: 'gal-3', title: 'Commerce & Industry Conclave', imageUrl: 'images/Commerce.jpg', album: 'Academics', category: 'Academic', caption: 'Commerce Department National Seminar', displayOrder: 3, isFeatured: true },
  { _id: 'gal-4', title: 'Annual Cultural Festival - Zephyr', imageUrl: 'images/cultural-activity.svg', album: 'Events', category: 'Cultural', caption: 'Student performances and cultural exhibits', displayOrder: 4, isFeatured: true },
  { _id: 'gal-5', title: 'DLLE Community Outreach Programme', imageUrl: 'images/dlle-activity.svg', album: 'Community', category: 'Outreach', caption: 'Extension and Lifelong Learning field outreach', displayOrder: 5, isFeatured: false },
  { _id: 'gal-6', title: 'Sports & Athletics Day', imageUrl: 'images/sports-activity.svg', album: 'Sports', category: 'Sports', caption: 'Annual Inter-collegiate Sports Meet at Vasai Grounds', displayOrder: 6, isFeatured: false }
];

module.exports = {
  mockNotices,
  mockEvents,
  mockDepartments,
  mockFaculty,
  mockDownloads,
  mockExamNotices,
  mockExamTimetables,
  mockResultLinks,
  mockQuestionPapers,
  mockGallery
};

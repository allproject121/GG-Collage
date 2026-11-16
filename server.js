require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const compression = require('compression');

const Admin = require('./models/Admin');
const Contact = require('./models/Contact');
const Alumni = require('./models/Alumni');
const Grievance = require('./models/Grievance');
const Notice = require('./models/Notice');
const Event = require('./models/Event');
const Video = require('./models/Video');
const Download = require('./models/Download');
const Department = require('./models/Department');
const Faculty = require('./models/Faculty');
const AdmissionApplication = require('./models/AdmissionApplication');
const ExamNotice = require('./models/ExamNotice');
const ExamTimetable = require('./models/ExamTimetable');
const ResultLink = require('./models/ResultLink');
const QuestionPaper = require('./models/QuestionPaper');
const Gallery = require('./models/Gallery');
const WebsiteSettings = require('./models/WebsiteSettings');

const noticeRoutes = require('./routes/noticeRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const examinationRoutes = require('./routes/examinationRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const {
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
} = require('./utils/mockData');

const app = express();
const PORT = process.env.PORT || 3000;

// Environment fallbacks for local/development use
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ggcollege';
const JWT_SECRET = process.env.JWT_SECRET || 'ggcollege_jwt_secret_dev_key_2026_secure';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.MONGODB_URI) { console.error('FATAL: MONGODB_URI is not set in production'); process.exit(1); }
  if (!process.env.JWT_SECRET) { console.error('FATAL: JWT_SECRET is not set in production'); process.exit(1); }
}

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(compression());
app.use(express.urlencoded({ extended: true }));

// Security Headers Middleware
app.use(function(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// API security: Check Origin header on mutating requests
app.use('/api', function(req, res, next) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.get('Origin') || req.get('Referer') || '';
    if (origin && !origin.includes('ggcollege.ac.in') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  next();
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try after 15 minutes.' }
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many submissions. Please try after 15 minutes.' }
});

// Block backend source files from public access
const BLOCKED_PREFIXES = ['/server.js', '/package.json', '/package-lock.json', '/.env', '/.gitignore', '/.env.example', '/models/', '/node_modules/', '/server.ps1', '/routes/', '/middleware/', '/utils/', '/scripts/'];
app.use((req, res, next) => {
  const blocked = BLOCKED_PREFIXES.some(p => req.path.startsWith(p) || req.path === p.replace(/\/$/, ''));
  if (blocked) return res.status(403).json({ error: 'Forbidden' });
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true,
  lastModified: true,
  setHeaders: function(res, filepath) {
    if (filepath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (filepath.endsWith('.css') || filepath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
  }
}));

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sanitizeStr(v, maxLen) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, maxLen || 1000);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(v) {
  if (!v) return true;
  return /^[\d\s\-+()]{7,20}$/.test(v);
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ======================== AUTH MIDDLEWARE ========================
function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function objectIdMiddleware(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  next();
}

// ======================== AUTH ROUTES ========================
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const username = sanitizeStr(req.body.username, 100);
    const password = req.body.password || '';
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ username: admin.username });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
});

// ======================== FORM ROUTES ========================
app.post('/api/contact', formLimiter, async (req, res) => {
  try {
    const name = sanitizeStr(req.body.name, 200);
    const email = sanitizeStr(req.body.email, 200);
    const phone = sanitizeStr(req.body.phone, 20);
    const subject = sanitizeStr(req.body.subject, 300);
    const message = sanitizeStr(req.body.message, 5000);
    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!email || !isValidEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (phone && !isValidPhone(phone)) return res.status(400).json({ error: 'Invalid phone number' });
    await Contact.create({ name, email, phone, subject, message });
    res.json({ message: 'Thank you for your enquiry. We will get back to you soon.' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/alumni', formLimiter, async (req, res) => {
  try {
    const name = sanitizeStr(req.body.name, 200);
    const email = sanitizeStr(req.body.email, 200);
    const phone = sanitizeStr(req.body.phone, 20);
    const graduationYear = sanitizeStr(req.body.graduationYear, 20);
    const programme = sanitizeStr(req.body.programme, 200);
    const occupation = sanitizeStr(req.body.occupation, 200);
    const message = sanitizeStr(req.body.message, 5000);
    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!email || !isValidEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (!phone || !isValidPhone(phone)) return res.status(400).json({ error: 'Valid phone number is required' });
    if (!graduationYear) return res.status(400).json({ error: 'Graduation year is required' });
    if (!programme) return res.status(400).json({ error: 'Programme is required' });
    await Alumni.create({ name, email, phone, graduationYear, programme, occupation, message });
    res.json({ message: 'Thank you for registering! We will get back to you.' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/grievances', formLimiter, async (req, res) => {
  try {
    const name = sanitizeStr(req.body.name, 200);
    const email = sanitizeStr(req.body.email, 200);
    const category = sanitizeStr(req.body.category, 100);
    const description = sanitizeStr(req.body.description, 5000);
    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!email || !isValidEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!description) return res.status(400).json({ error: 'Description is required' });
    await Grievance.create({ name, email, category, description });
    res.json({ message: 'Your grievance has been submitted. We will review it shortly.' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================== ADMIN API ROUTES ========================

// Contacts delete (singular & plural)
app.delete(['/api/admin/contact/:id', '/api/admin/contacts/:id'], authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Alumni delete
app.delete('/api/admin/alumni/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Grievances delete (singular & plural)
app.delete(['/api/admin/grievance/:id', '/api/admin/grievances/:id'], authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Grievance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Grievances status update (singular & plural)
app.patch(['/api/admin/grievance/:id/status', '/api/admin/grievances/:id/status'], authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const status = req.body.status === 'resolved' ? 'resolved' : 'pending';
    await Grievance.findByIdAndUpdate(req.params.id, { status }, { runValidators: true });
    res.json({ message: 'Updated' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ======================== NOTICE & EVENT ROUTES ========================
app.post('/api/admin/notices', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const body = sanitizeStr(req.body.body, 10000);
    const shortDescription = sanitizeStr(req.body.shortDescription || body, 500);
    const fullDescription = sanitizeStr(req.body.fullDescription || body, 10000);
    const category = sanitizeStr(req.body.category, 100) || 'General';
    const department = sanitizeStr(req.body.department, 100);
    const noticeDate = req.body.noticeDate || req.body.date || new Date().toISOString().split('T')[0];
    const expiryDate = sanitizeStr(req.body.expiryDate, 50) || '';
    const pdfUrl = sanitizeStr(req.body.pdfUrl, 1000);
    const externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    const isImportant = req.body.isImportant === true;
    const isPinned = req.body.isPinned === true;
    const rawStatus = String(req.body.status || 'Draft').toLowerCase();
    const status = rawStatus === 'published' ? 'Published' : rawStatus === 'archived' ? 'Archived' : 'Draft';
    if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });
    const notice = await Notice.create({ title, shortDescription, fullDescription, body, category, department, noticeDate, expiryDate, pdfUrl, externalUrl, isImportant, isPinned, status, createdBy: req.admin?.username || '' });
    res.json(notice);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/notices/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.body !== undefined) {
      update.body = sanitizeStr(req.body.body, 10000);
      update.shortDescription = sanitizeStr(req.body.shortDescription || req.body.body, 500);
      update.fullDescription = sanitizeStr(req.body.fullDescription || req.body.body, 10000);
    }
    if (req.body.shortDescription !== undefined) update.shortDescription = sanitizeStr(req.body.shortDescription, 500);
    if (req.body.fullDescription !== undefined) update.fullDescription = sanitizeStr(req.body.fullDescription, 10000);
    if (req.body.date !== undefined) update.noticeDate = sanitizeStr(req.body.date, 50);
    if (req.body.noticeDate !== undefined) update.noticeDate = sanitizeStr(req.body.noticeDate, 50);
    if (req.body.expiryDate !== undefined) update.expiryDate = sanitizeStr(req.body.expiryDate, 50);
    if (req.body.category !== undefined) update.category = sanitizeStr(req.body.category, 100);
    if (req.body.department !== undefined) update.department = sanitizeStr(req.body.department, 100);
    if (req.body.pdfUrl !== undefined) update.pdfUrl = sanitizeStr(req.body.pdfUrl, 1000);
    if (req.body.externalUrl !== undefined) update.externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    if (req.body.isImportant !== undefined) update.isImportant = req.body.isImportant === true;
    if (req.body.isPinned !== undefined) update.isPinned = req.body.isPinned === true;
    if (req.body.status !== undefined) {
      const s = String(req.body.status).toLowerCase();
      update.status = s === 'published' ? 'Published' : s === 'archived' ? 'Archived' : 'Draft';
    }
    const notice = await Notice.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ error: 'Not found' });
    res.json(notice);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/notices/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/admin/events', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const date = sanitizeStr(req.body.date, 50);
    const description = sanitizeStr(req.body.description, 5000);
    const imageUrl = sanitizeStr(req.body.imageUrl, 1000);
    if (!title || !date || !description) return res.status(400).json({ error: 'Title, date and description are required' });
    const event = await Event.create({ title, date, description, imageUrl });
    res.json(event);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/events/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.date !== undefined) update.date = sanitizeStr(req.body.date, 50);
    if (req.body.description !== undefined) update.description = sanitizeStr(req.body.description, 5000);
    if (req.body.imageUrl !== undefined) update.imageUrl = sanitizeStr(req.body.imageUrl, 1000);
    const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json(event);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/events/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ======================== GALLERY ROUTES ========================
app.post('/api/admin/gallery', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const imageUrl = sanitizeStr(req.body.imageUrl, 1000);
    const album = sanitizeStr(req.body.album, 200);
    const category = sanitizeStr(req.body.category, 200);
    const caption = sanitizeStr(req.body.caption, 1000);
    const displayOrder = parseInt(req.body.displayOrder) || 0;
    const isFeatured = req.body.isFeatured === true;
    if (!title || !imageUrl) return res.status(400).json({ error: 'Title and image URL are required' });
    const gallery = await Gallery.create({ title, imageUrl, album, category, caption, displayOrder, isFeatured });
    res.json(gallery);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/gallery/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.imageUrl !== undefined) update.imageUrl = sanitizeStr(req.body.imageUrl, 1000);
    if (req.body.album !== undefined) update.album = sanitizeStr(req.body.album, 200);
    if (req.body.category !== undefined) update.category = sanitizeStr(req.body.category, 200);
    if (req.body.caption !== undefined) update.caption = sanitizeStr(req.body.caption, 1000);
    if (req.body.displayOrder !== undefined) update.displayOrder = parseInt(req.body.displayOrder) || 0;
    if (req.body.isFeatured !== undefined) update.isFeatured = req.body.isFeatured === true;
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!gallery) return res.status(404).json({ error: 'Not found' });
    res.json(gallery);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/gallery/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/gallery', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockGallery);
  }
  try {
    const gallery = await Gallery.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(gallery);
  } catch { res.json(mockGallery); }
});

// ======================== WEBSITE SETTINGS ROUTES ========================
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({});
    }
    res.json(settings);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/settings', authMiddleware, async (req, res) => {
  try {
    // Map alternate field names from dashboard
    if (req.body.copyright !== undefined && req.body.copyrightText === undefined) {
      req.body.copyrightText = req.body.copyright;
    }
    if (req.body.footerDescription !== undefined && req.body.footerText === undefined) {
      req.body.footerText = req.body.footerDescription;
    }

    const allowedFields = [
      'collegeName', 'tagline', 'address', 'phone', 'email', 'description',
      'facebook', 'twitter', 'instagram', 'youtube', 'linkedin',
      'footerText', 'copyrightText', 'gaId',
      'metaTitle', 'metaDescription', 'metaKeywords',
      'themeStyle', 'animationLevel', 'glassIntensity', 'heroEffect',
      'tickerSpeed', 'enableCounters', 'enablePageTransitions',
      'enableGalleryAnimations', 'enableBackgroundPatterns'
    ];
    const update = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === 'boolean') {
          update[field] = req.body[field];
        } else if (typeof req.body[field] === 'number') {
          update[field] = req.body[field];
        } else {
          update[field] = sanitizeStr(String(req.body[field]), 1000);
        }
      }
    });
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create(update);
    } else {
      settings = await WebsiteSettings.findByIdAndUpdate(settings._id, update, { new: true, runValidators: true });
    }
    res.json(settings);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ======================== VIDEO ROUTES ========================
app.post('/api/admin/videos', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const youtubeUrl = sanitizeStr(req.body.youtubeUrl, 1000);
    const description = sanitizeStr(req.body.description, 5000);
    const isFeatured = req.body.isFeatured === true;
    const publishedDate = sanitizeStr(req.body.publishedDate, 50);
    if (!title || !youtubeUrl) return res.status(400).json({ error: 'Title and YouTube URL are required' });
    const urlPattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;
    if (!urlPattern.test(youtubeUrl)) return res.status(400).json({ error: 'Invalid YouTube URL' });
    const videoIdMatch = youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/)([\w-]+)/);
    const youtubeVideoId = videoIdMatch ? videoIdMatch[1] : '';
    const thumbnailUrl = youtubeVideoId ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` : '';
    const video = await Video.create({ title, youtubeUrl, youtubeVideoId, description, thumbnailUrl, isFeatured, publishedDate });
    res.json(video);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/videos/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.youtubeUrl !== undefined) {
      const youtubeUrl = sanitizeStr(req.body.youtubeUrl, 1000);
      const urlPattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w-]+/;
      if (!urlPattern.test(youtubeUrl)) return res.status(400).json({ error: 'Invalid YouTube URL' });
      update.youtubeUrl = youtubeUrl;
      const videoIdMatch = youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/)([\w-]+)/);
      update.youtubeVideoId = videoIdMatch ? videoIdMatch[1] : '';
      update.thumbnailUrl = update.youtubeVideoId ? `https://img.youtube.com/vi/${update.youtubeVideoId}/hqdefault.jpg` : '';
    }
    if (req.body.description !== undefined) update.description = sanitizeStr(req.body.description, 5000);
    if (req.body.isFeatured !== undefined) update.isFeatured = req.body.isFeatured === true;
    if (req.body.publishedDate !== undefined) update.publishedDate = sanitizeStr(req.body.publishedDate, 50);
    const video = await Video.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!video) return res.status(404).json({ error: 'Not found' });
    res.json(video);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/videos/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

const defaultVideos = [
  { _id: 'vid-1', title: 'St. Gonsalo Garcia College Campus Tour', youtubeVideoId: '1Lh4b-n9hK8', isFeatured: true, description: 'Virtual tour of GG College campus, sports ground, library and laboratories.' }
];

app.get('/api/videos', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(defaultVideos);
  }
  try {
    const videos = await Video.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.json(videos);
  } catch { res.json(defaultVideos); }
});

app.get('/api/videos/all', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(defaultVideos);
  }
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch { res.json(defaultVideos); }
});

// ======================== ADMIN DOWNLOADS ========================
app.post('/api/admin/downloads', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const description = sanitizeStr(req.body.description, 2000);
    const category = req.body.category || 'Other';
    const academicYear = sanitizeStr(req.body.academicYear, 20);
    const fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    const externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    const fileType = sanitizeStr(req.body.fileType, 50);
    const fileSize = sanitizeStr(req.body.fileSize, 50);
    const rawStatus = String(req.body.status || 'Draft').toLowerCase();
    const status = rawStatus === 'published' ? 'Published' : rawStatus === 'archived' ? 'Archived' : 'Draft';
    const isFeatured = req.body.isFeatured === true;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const download = await Download.create({ title, description, category, academicYear, fileUrl, externalUrl, fileType, fileSize, status, isFeatured });
    res.json(download);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/downloads/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.description !== undefined) update.description = sanitizeStr(req.body.description, 2000);
    if (req.body.category !== undefined) update.category = req.body.category;
    if (req.body.academicYear !== undefined) update.academicYear = sanitizeStr(req.body.academicYear, 20);
    if (req.body.fileUrl !== undefined) update.fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    if (req.body.externalUrl !== undefined) update.externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    if (req.body.fileType !== undefined) update.fileType = sanitizeStr(req.body.fileType, 50);
    if (req.body.fileSize !== undefined) update.fileSize = sanitizeStr(req.body.fileSize, 50);
    if (req.body.status !== undefined) {
      const s = String(req.body.status).toLowerCase();
      update.status = s === 'published' ? 'Published' : s === 'archived' ? 'Archived' : 'Draft';
    }
    if (req.body.isFeatured !== undefined) update.isFeatured = req.body.isFeatured === true;
    const download = await Download.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!download) return res.status(404).json({ error: 'Not found' });
    res.json(download);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/downloads/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Download.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ======================== ADMIN DEPARTMENTS ========================
app.post('/api/admin/departments', authMiddleware, async (req, res) => {
  try {
    const name = sanitizeStr(req.body.name, 200);
    const slug = sanitizeStr(req.body.slug, 200).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const shortDescription = sanitizeStr(req.body.shortDescription, 500);
    const fullDescription = sanitizeStr(req.body.fullDescription, 5000);
    const email = sanitizeStr(req.body.email, 200);
    const phone = sanitizeStr(req.body.phone, 20);
    const imageUrl = sanitizeStr(req.body.imageUrl, 1000);
    const displayOrder = parseInt(req.body.displayOrder) || 0;
    const status = req.body.status === 'Draft' ? 'Draft' : 'Published';
    if (!name) return res.status(400).json({ error: 'Department name is required' });
    const dept = await Department.create({ name, slug, shortDescription, fullDescription, email, phone, imageUrl, displayOrder, status });
    res.json(dept);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/departments/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.name !== undefined) update.name = sanitizeStr(req.body.name, 200);
    if (req.body.slug !== undefined) update.slug = sanitizeStr(req.body.slug, 200).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (req.body.shortDescription !== undefined) update.shortDescription = sanitizeStr(req.body.shortDescription, 500);
    if (req.body.fullDescription !== undefined) update.fullDescription = sanitizeStr(req.body.fullDescription, 5000);
    if (req.body.hodFacultyId !== undefined) update.hodFacultyId = isValidObjectId(req.body.hodFacultyId) ? req.body.hodFacultyId : null;
    if (req.body.email !== undefined) update.email = sanitizeStr(req.body.email, 200);
    if (req.body.phone !== undefined) update.phone = sanitizeStr(req.body.phone, 20);
    if (req.body.imageUrl !== undefined) update.imageUrl = sanitizeStr(req.body.imageUrl, 1000);
    if (req.body.displayOrder !== undefined) update.displayOrder = parseInt(req.body.displayOrder) || 0;
    if (req.body.status !== undefined) update.status = req.body.status;
    const dept = await Department.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!dept) return res.status(404).json({ error: 'Not found' });
    res.json(dept);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/departments/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    await Faculty.updateMany({ departmentId: req.params.id }, { $set: { departmentId: null } });
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ======================== ADMIN FACULTY ========================
app.post('/api/admin/faculty', authMiddleware, async (req, res) => {
  try {
    const fullName = sanitizeStr(req.body.fullName || req.body.name, 200);
    const designation = sanitizeStr(req.body.designation, 200);
    const departmentId = isValidObjectId(req.body.departmentId) ? req.body.departmentId : null;
    const qualification = sanitizeStr(req.body.qualification, 500);
    const specialisation = sanitizeStr(req.body.specialisation, 500);
    const experience = sanitizeStr(req.body.experience, 200);
    const subjects = sanitizeStr(req.body.subjects, 500);
    const email = sanitizeStr(req.body.email, 200);
    const phone = sanitizeStr(req.body.phone, 20);
    const profileImageUrl = sanitizeStr(req.body.profileImageUrl || req.body.imageUrl, 1000);
    const message = sanitizeStr(req.body.message, 2000);
    const displayOrder = parseInt(req.body.displayOrder) || 0;
    const status = req.body.status === 'Draft' ? 'Draft' : 'Published';
    if (!fullName) return res.status(400).json({ error: 'Faculty name is required' });
    const f = await Faculty.create({ fullName, designation, departmentId, qualification, specialisation, experience, subjects, email, phone, profileImageUrl, message, displayOrder, status });
    res.json(f);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/faculty/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.fullName !== undefined || req.body.name !== undefined) update.fullName = sanitizeStr(req.body.fullName || req.body.name, 200);
    if (req.body.designation !== undefined) update.designation = sanitizeStr(req.body.designation, 200);
    if (req.body.departmentId !== undefined) update.departmentId = isValidObjectId(req.body.departmentId) ? req.body.departmentId : null;
    if (req.body.qualification !== undefined) update.qualification = sanitizeStr(req.body.qualification, 500);
    if (req.body.specialisation !== undefined) update.specialisation = sanitizeStr(req.body.specialisation, 500);
    if (req.body.experience !== undefined) update.experience = sanitizeStr(req.body.experience, 200);
    if (req.body.subjects !== undefined) update.subjects = sanitizeStr(req.body.subjects, 500);
    if (req.body.email !== undefined) update.email = sanitizeStr(req.body.email, 200);
    if (req.body.phone !== undefined) update.phone = sanitizeStr(req.body.phone, 20);
    if (req.body.profileImageUrl !== undefined || req.body.imageUrl !== undefined) update.profileImageUrl = sanitizeStr(req.body.profileImageUrl || req.body.imageUrl, 1000);
    if (req.body.message !== undefined) update.message = sanitizeStr(req.body.message, 2000);
    if (req.body.displayOrder !== undefined) update.displayOrder = parseInt(req.body.displayOrder) || 0;
    if (req.body.status !== undefined) update.status = req.body.status;
    const f = await Faculty.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!f) return res.status(404).json({ error: 'Not found' });
    res.json(f);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/faculty/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ======================== ADMIN ADMISSIONS ========================
function normalizeAdmissionStatus(st) {
  if (!st) return 'Submitted';
  const s = String(st).toLowerCase();
  if (s === 'admitted' || s === 'approved') return 'Approved';
  if (s === 'rejected') return 'Rejected';
  if (s === 'review' || s === 'under review') return 'Under Review';
  if (s === 'documents required') return 'Documents Required';
  if (s === 'cancelled') return 'Cancelled';
  return 'Submitted';
}

app.put(['/api/admin/admissions/:id', '/api/admin/applications/:id'], authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.status !== undefined || req.body.applicationStatus !== undefined) {
      update.applicationStatus = normalizeAdmissionStatus(req.body.applicationStatus || req.body.status);
    }
    if (req.body.adminRemark !== undefined) update.adminRemark = sanitizeStr(req.body.adminRemark, 2000);
    const appRecord = await AdmissionApplication.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!appRecord) return res.status(404).json({ error: 'Not found' });
    res.json(appRecord);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete(['/api/admin/admissions/:id', '/api/admin/applications/:id'], authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await AdmissionApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ======================== ADMIN EXAMINATION ========================

// Exam Notices
app.post('/api/admin/examNotices', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const body = sanitizeStr(req.body.body || req.body.description, 10000);
    const category = req.body.category || 'General';
    const pdfUrl = sanitizeStr(req.body.pdfUrl, 1000);
    const externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    const noticeDate = req.body.date || req.body.noticeDate ? new Date(req.body.date || req.body.noticeDate) : new Date();
    const isImportant = req.body.isImportant === true;
    const status = (req.body.status || 'draft').toLowerCase() === 'published' ? 'Published' : 'Draft';
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const notice = await ExamNotice.create({ title, body: body || title, category, pdfUrl, externalUrl, noticeDate, isImportant, status });
    res.json(notice);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/examNotices/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.body !== undefined || req.body.description !== undefined) update.body = sanitizeStr(req.body.body || req.body.description, 10000);
    if (req.body.category !== undefined) update.category = req.body.category;
    if (req.body.pdfUrl !== undefined) update.pdfUrl = sanitizeStr(req.body.pdfUrl, 1000);
    if (req.body.externalUrl !== undefined) update.externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    if (req.body.date !== undefined || req.body.noticeDate !== undefined) update.noticeDate = new Date(req.body.date || req.body.noticeDate);
    if (req.body.isImportant !== undefined) update.isImportant = req.body.isImportant === true;
    if (req.body.status !== undefined) update.status = String(req.body.status).toLowerCase() === 'published' ? 'Published' : 'Draft';
    const notice = await ExamNotice.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ error: 'Not found' });
    res.json(notice);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/examNotices/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await ExamNotice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Timetables
app.post('/api/admin/timetables', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const course = sanitizeStr(req.body.course || req.body.programme, 200) || 'All';
    const semester = sanitizeStr(req.body.semester, 50) || '1';
    const division = sanitizeStr(req.body.division, 50);
    const examinationType = req.body.examinationType || 'University';
    const startDate = req.body.startDate || req.body.date ? new Date(req.body.startDate || req.body.date) : new Date();
    const endDate = req.body.endDate ? new Date(req.body.endDate) : startDate;
    const academicYear = sanitizeStr(req.body.academicYear, 20);
    const fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    const status = (req.body.status || 'published').toLowerCase() === 'draft' ? 'Draft' : 'Published';
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const timetable = await ExamTimetable.create({ title, course, semester, division, examinationType, startDate, endDate, academicYear, fileUrl, status });
    res.json(timetable);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/timetables/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.course !== undefined || req.body.programme !== undefined) update.course = sanitizeStr(req.body.course || req.body.programme, 200);
    if (req.body.semester !== undefined) update.semester = sanitizeStr(req.body.semester, 50);
    if (req.body.division !== undefined) update.division = sanitizeStr(req.body.division, 50);
    if (req.body.examinationType !== undefined) update.examinationType = req.body.examinationType;
    if (req.body.startDate !== undefined || req.body.date !== undefined) update.startDate = new Date(req.body.startDate || req.body.date);
    if (req.body.endDate !== undefined) update.endDate = new Date(req.body.endDate);
    if (req.body.academicYear !== undefined) update.academicYear = sanitizeStr(req.body.academicYear, 20);
    if (req.body.fileUrl !== undefined) update.fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    if (req.body.status !== undefined) update.status = String(req.body.status).toLowerCase() === 'draft' ? 'Draft' : 'Published';
    const timetable = await ExamTimetable.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!timetable) return res.status(404).json({ error: 'Not found' });
    res.json(timetable);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/timetables/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await ExamTimetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Results
app.post('/api/admin/results', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const course = sanitizeStr(req.body.course || req.body.programme, 200) || 'All';
    const semester = sanitizeStr(req.body.semester, 50) || '1';
    const resultDate = req.body.resultDate || req.body.date ? new Date(req.body.resultDate || req.body.date) : new Date();
    const externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    const academicYear = sanitizeStr(req.body.academicYear, 20);
    const status = (req.body.status || 'published').toLowerCase() === 'draft' ? 'Draft' : 'Published';
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const result = await ResultLink.create({ title, course, semester, resultDate, externalUrl, academicYear, status });
    res.json(result);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/results/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.course !== undefined || req.body.programme !== undefined) update.course = sanitizeStr(req.body.course || req.body.programme, 200);
    if (req.body.semester !== undefined) update.semester = sanitizeStr(req.body.semester, 50);
    if (req.body.resultDate !== undefined || req.body.date !== undefined) update.resultDate = new Date(req.body.resultDate || req.body.date);
    if (req.body.externalUrl !== undefined) update.externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    if (req.body.academicYear !== undefined) update.academicYear = sanitizeStr(req.body.academicYear, 20);
    if (req.body.status !== undefined) update.status = String(req.body.status).toLowerCase() === 'draft' ? 'Draft' : 'Published';
    const result = await ResultLink.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json(result);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/results/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await ResultLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Question Papers
app.post('/api/admin/questionPapers', authMiddleware, async (req, res) => {
  try {
    const subject = sanitizeStr(req.body.subject || req.body.title, 300);
    const subjectCode = sanitizeStr(req.body.subjectCode, 50);
    const course = sanitizeStr(req.body.course || req.body.programme, 200) || 'All';
    const semester = sanitizeStr(req.body.semester, 50) || '1';
    const examinationType = req.body.examinationType || 'University';
    const academicYear = sanitizeStr(req.body.academicYear, 20);
    const fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    const status = (req.body.status || 'published').toLowerCase() === 'draft' ? 'Draft' : 'Published';
    if (!subject) return res.status(400).json({ error: 'Subject is required' });
    const paper = await QuestionPaper.create({ subject, subjectCode, course, semester, examinationType, academicYear, fileUrl, status });
    res.json(paper);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.put('/api/admin/questionPapers/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.subject !== undefined || req.body.title !== undefined) update.subject = sanitizeStr(req.body.subject || req.body.title, 300);
    if (req.body.subjectCode !== undefined) update.subjectCode = sanitizeStr(req.body.subjectCode, 50);
    if (req.body.course !== undefined || req.body.programme !== undefined) update.course = sanitizeStr(req.body.course || req.body.programme, 200);
    if (req.body.semester !== undefined) update.semester = sanitizeStr(req.body.semester, 50);
    if (req.body.examinationType !== undefined) update.examinationType = req.body.examinationType;
    if (req.body.academicYear !== undefined) update.academicYear = sanitizeStr(req.body.academicYear, 20);
    if (req.body.fileUrl !== undefined) update.fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    if (req.body.status !== undefined) update.status = String(req.body.status).toLowerCase() === 'draft' ? 'Draft' : 'Published';
    const paper = await QuestionPaper.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!paper) return res.status(404).json({ error: 'Not found' });
    res.json(paper);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/questionPapers/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await QuestionPaper.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Events public
app.get('/api/events', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockEvents);
  }
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch { res.json(mockEvents); }
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', database: dbStatus, timestamp: new Date().toISOString() });
});

// ======================== MOUNT MODULE ROUTES ========================
app.use('/api/notices', noticeRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/examination', examinationRoutes);
app.use('/api/examinations', examinationRoutes);
app.use('/api/departments', facultyRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admissions', admissionRoutes);

// Admin data endpoint with full entity formatting & aliases
app.get('/api/admin/data', authMiddleware, async (req, res) => {
  try {
    const [contacts, alumni, grievances, notices, events, videos, downloads, departments, facultyList, admissions, examNotices, examTimetables, resultLinks, questionPapers, gallery, settings] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }),
      Alumni.find().sort({ createdAt: -1 }),
      Grievance.find().sort({ createdAt: -1 }),
      Notice.find().sort({ createdAt: -1 }),
      Event.find().sort({ createdAt: -1 }),
      Video.find().sort({ createdAt: -1 }),
      Download.find().sort({ createdAt: -1 }),
      Department.find().sort({ displayOrder: 1, name: 1 }),
      Faculty.find().populate('departmentId', 'name slug').sort({ displayOrder: 1, fullName: 1 }),
      AdmissionApplication.find().sort({ createdAt: -1 }),
      ExamNotice.find().sort({ createdAt: -1 }),
      ExamTimetable.find().sort({ createdAt: -1 }),
      ResultLink.find().sort({ createdAt: -1 }),
      QuestionPaper.find().sort({ createdAt: -1 }),
      Gallery.find().sort({ displayOrder: 1, createdAt: -1 }),
      WebsiteSettings.findOne()
    ]);

    // Format admissions with UI aliases
    const formattedAdmissions = admissions.map(a => {
      const obj = a.toObject();
      obj.name = obj.applicantName;
      obj.programme = obj.selectedProgramme;
      obj.status = obj.applicationStatus;
      obj.dob = obj.dateOfBirth;
      obj.pincode = obj.postalCode;
      return obj;
    });

    // Format question papers with UI aliases
    const formattedQPs = questionPapers.map(qp => {
      const obj = qp.toObject();
      obj.title = obj.title || obj.subject;
      obj.programme = obj.programme || obj.course;
      return obj;
    });

    // Format timetables with UI aliases
    const formattedTimetables = examTimetables.map(tt => {
      const obj = tt.toObject();
      obj.programme = obj.programme || obj.course;
      obj.date = obj.date || obj.startDate;
      return obj;
    });

    // Format results with UI aliases
    const formattedResults = resultLinks.map(r => {
      const obj = r.toObject();
      obj.programme = obj.programme || obj.course;
      obj.date = obj.date || obj.resultDate;
      return obj;
    });

    // Format exam notices with UI aliases
    const formattedExamNotices = examNotices.map(en => {
      const obj = en.toObject();
      obj.date = obj.date || en.noticeDate;
      return obj;
    });

    // Format settings with UI aliases
    let settingsObj = settings ? settings.toObject() : {};
    settingsObj.copyright = settingsObj.copyright || settingsObj.copyrightText || '';
    settingsObj.footerDescription = settingsObj.footerDescription || settingsObj.footerText || '';

    res.json({
      contacts,
      alumni,
      grievances,
      notices,
      events,
      videos,
      downloads,
      departments,
      faculty: facultyList,
      admissions: formattedAdmissions,
      examNotices: formattedExamNotices,
      timetables: formattedTimetables,
      examTimetables: formattedTimetables,
      results: formattedResults,
      resultLinks: formattedResults,
      questionPapers: formattedQPs,
      gallery,
      settings: settingsObj
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================== SEED ADMIN ========================
async function seedAdmin() {
  try {
    const existing = await Admin.findOne({ username: ADMIN_USERNAME });
    if (!existing) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await Admin.create({ username: ADMIN_USERNAME, password: hashed });
      console.log(`Default admin created: ${ADMIN_USERNAME}`);
    }
  } catch (err) {
    console.error('Seed admin error:', err.message);
  }
}

// Start HTTP server immediately so static files are always served
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log('MongoDB connected successfully');
    await seedAdmin();
  })
  .catch(err => {
    console.warn('MongoDB connection note: Database is currently unavailable (' + err.message + ').');
    console.warn('Fallback data store active: All pages and API endpoints will respond instantly with zero lag.');
  });

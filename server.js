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

const app = express();
const PORT = process.env.PORT || 3000;

const { MONGODB_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI) { console.error('FATAL: MONGODB_URI is not set'); process.exit(1); }
if (!JWT_SECRET) { console.error('FATAL: JWT_SECRET is not set'); process.exit(1); }
if (!ADMIN_USERNAME) { console.error('FATAL: ADMIN_USERNAME is not set'); process.exit(1); }
if (!ADMIN_PASSWORD) { console.error('FATAL: ADMIN_PASSWORD is not set'); process.exit(1); }

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(compression());
app.use(express.urlencoded({ extended: true }));

// CSP Middleware
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
  max: 5,
  message: { error: 'Too many login attempts. Try after 15 minutes.' }
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many submissions. Please try after 15 minutes.' }
});

// Block backend source files from public access
// Security: When creating ZIP distributions, ensure .env and node_modules/ are excluded
const BLOCKED_PREFIXES = ['/server.js', '/package.json', '/package-lock.json', '/.env', '/.gitignore', '/.env.example', '/models/', '/node_modules/', '/server.ps1'];
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

app.delete('/api/admin/contact/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/alumni/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.delete('/api/admin/grievance/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    await Grievance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.patch('/api/admin/grievance/:id/status', authMiddleware, objectIdMiddleware, async (req, res) => {
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
    const status = ['Published','Draft','Archived'].includes(req.body.status) ? req.body.status : 'Draft';
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
    if (req.body.status !== undefined) update.status = ['Published','Draft','Archived'].includes(req.body.status) ? req.body.status : 'Draft';
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
  try {
    const gallery = await Gallery.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(gallery);
  } catch { res.status(500).json({ error: 'Server error' }); }
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
    const allowedFields = [
      'collegeName', 'tagline', 'address', 'phone', 'email', 'description',
      'facebook', 'twitter', 'instagram', 'youtube', 'linkedin',
      'footerText', 'copyrightText',
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

// Public API
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.json(videos);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/videos/all', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find({ status: 'Published' }).sort({ isPinned: -1, noticeDate: -1 }).limit(parseInt(req.query.limit) || 100);
    res.json(notices);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ======================== NEW MODULE ROUTES ========================
app.use('/api/notices', noticeRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/examination', examinationRoutes);
app.use('/api/departments', facultyRoutes);
app.use('/api/admissions', admissionRoutes);

// Admin data endpoint - extended for new modules
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
    res.json({ contacts, alumni, grievances, notices, events, videos, downloads, departments, faculty: facultyList, admissions, examNotices, examTimetables, resultLinks, questionPapers, gallery, settings });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ======================== SEED ADMIN ========================
async function seedAdmin() {
  const existing = await Admin.findOne({ username: ADMIN_USERNAME });
  if (!existing) {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await Admin.create({ username: ADMIN_USERNAME, password: hashed });
    console.log('Admin user created');
  }
}

// ======================== MONGOOSE CONNECTION ========================
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

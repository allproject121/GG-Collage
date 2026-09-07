const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { sanitizeStr, isValidObjectId } = require('../utils/helpers');
const { authMiddleware, objectIdMiddleware } = require('../middleware/auth');

const VALID_CATEGORIES = ['Admission','Examination','Scholarship','Event','General','University','Placement','IQAC','NAAC','NIRF'];
const VALID_STATUSES = ['Draft','Published','Archived'];

// Public: Get published notices with pagination, search, filters
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const query = { status: 'Published' };
    if (req.query.category && req.query.category !== 'all') {
      query.category = { $regex: new RegExp('^' + req.query.category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') };
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: searchRegex }, { shortDescription: searchRegex }, { body: searchRegex }];
    }
    if (req.query.dateFrom || req.query.dateTo) {
      query.noticeDate = {};
      if (req.query.dateFrom) query.noticeDate.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) query.noticeDate.$lte = new Date(req.query.dateTo);
    }
    const total = await Notice.countDocuments(query);
    const notices = await Notice.find(query)
      .sort({ isPinned: -1, noticeDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    res.json({ notices, total, page, totalPages: Math.ceil(total / limit) });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Public: Get pinned notices
router.get('/pinned', async (req, res) => {
  try {
    const notices = await Notice.find({ status: 'Published', isPinned: true }).sort({ noticeDate: -1 }).select('-__v');
    res.json(notices);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Public: Get important notices
router.get('/important', async (req, res) => {
  try {
    const notices = await Notice.find({ status: 'Published', isImportant: true }).sort({ noticeDate: -1 }).select('-__v');
    res.json(notices);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Public: Get archived notices
router.get('/archived', async (req, res) => {
  try {
    const notices = await Notice.find({ status: 'Archived' }).sort({ noticeDate: -1 }).select('-__v');
    res.json(notices);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Get all notices (including drafts)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).select('-__v');
    res.json(notices);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Create notice
router.post('/', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const shortDescription = sanitizeStr(req.body.shortDescription || req.body.body, 500);
    const fullDescription = sanitizeStr(req.body.fullDescription || req.body.body, 10000);
    const category = VALID_CATEGORIES.includes(req.body.category) ? req.body.category : 'General';
    const department = sanitizeStr(req.body.department, 100);
    const noticeDate = sanitizeStr(req.body.noticeDate || req.body.date, 50) || new Date().toISOString().split('T')[0];
    const expiryDate = sanitizeStr(req.body.expiryDate, 50) || '';
    const pdfUrl = sanitizeStr(req.body.pdfUrl, 1000);
    const externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    const isImportant = req.body.isImportant === true;
    const isPinned = req.body.isPinned === true;
    const status = VALID_STATUSES.includes(req.body.status) ? req.body.status : 'Draft';
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const notice = await Notice.create({ title, shortDescription, fullDescription, category, department, noticeDate, expiryDate, pdfUrl, externalUrl, isImportant, isPinned, status });
    res.json(notice);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Update notice
router.put('/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.shortDescription !== undefined) update.shortDescription = sanitizeStr(req.body.shortDescription, 500);
    if (req.body.fullDescription !== undefined) update.fullDescription = sanitizeStr(req.body.fullDescription, 10000);
    if (req.body.body !== undefined) {
      update.shortDescription = sanitizeStr(req.body.body, 500);
      update.fullDescription = sanitizeStr(req.body.body, 10000);
    }
    if (req.body.category !== undefined) update.category = VALID_CATEGORIES.includes(req.body.category) ? req.body.category : 'General';
    if (req.body.department !== undefined) update.department = sanitizeStr(req.body.department, 100);
    if (req.body.noticeDate !== undefined) update.noticeDate = sanitizeStr(req.body.noticeDate, 50);
    if (req.body.date !== undefined) update.noticeDate = sanitizeStr(req.body.date, 50);
    if (req.body.expiryDate !== undefined) update.expiryDate = sanitizeStr(req.body.expiryDate, 50);
    if (req.body.pdfUrl !== undefined) update.pdfUrl = sanitizeStr(req.body.pdfUrl, 1000);
    if (req.body.externalUrl !== undefined) update.externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    if (req.body.isImportant !== undefined) update.isImportant = req.body.isImportant === true;
    if (req.body.isPinned !== undefined) update.isPinned = req.body.isPinned === true;
    if (req.body.status !== undefined) update.status = VALID_STATUSES.includes(req.body.status) ? req.body.status : 'Draft';
    const notice = await Notice.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ error: 'Not found' });
    res.json(notice);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Delete notice
router.delete('/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

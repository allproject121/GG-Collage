const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Download = require('../models/Download');
const { mockDownloads } = require('../utils/mockData');
const { sanitizeStr, isValidObjectId } = require('../utils/helpers');
const { authMiddleware, objectIdMiddleware } = require('../middleware/auth');

const VALID_CATEGORIES = ['Prospectus','Admission Forms','Examination Forms','Scholarship Forms','Academic Calendar','Timetable','NAAC Documents','NIRF Reports','IQAC Documents','Policies','Annual Reports','Question Papers','Other'];

function getFilteredMockDownloads(req) {
  let filtered = [...mockDownloads];
  if (req.query.category && req.query.category !== 'all') {
    filtered = filtered.filter(d => d.category.toLowerCase() === req.query.category.toLowerCase());
  }
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    filtered = filtered.filter(d => (d.title && d.title.toLowerCase().includes(s)));
  }
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
  const skip = (page - 1) * limit;
  const paginated = filtered.slice(skip, skip + limit);
  return { downloads: paginated, total: filtered.length, page, totalPages: Math.ceil(filtered.length / limit) };
}

// Public: Get published downloads
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(getFilteredMockDownloads(req));
  }
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;
    const query = { status: 'Published' };
    if (req.query.category && req.query.category !== 'all') {
      query.category = { $regex: new RegExp('^' + req.query.category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') };
    }
    if (req.query.academicYear && req.query.academicYear !== 'all') {
      query.academicYear = req.query.academicYear;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }
    const total = await Download.countDocuments(query);
    const downloads = await Download.find(query)
      .sort({ isFeatured: -1, publishedDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    res.json({ downloads, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    res.json(getFilteredMockDownloads(req));
  }
});

// Public: Get featured downloads
router.get('/featured', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockDownloads.slice(0, 3));
  }
  try {
    const downloads = await Download.find({ status: 'Published', isFeatured: true }).sort({ publishedDate: -1 }).limit(6).select('-__v');
    res.json(downloads);
  } catch {
    res.json(mockDownloads.slice(0, 3));
  }
});

// Public: Get single download
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const download = await Download.findOne({ _id: req.params.id, status: 'Published' }).select('-__v');
    if (!download) return res.status(404).json({ error: 'Not found' });
    res.json(download);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Public: Increment download count
router.post('/:id/count', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await Download.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
    res.json({ message: 'Counted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Get all downloads
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const downloads = await Download.find().sort({ createdAt: -1 }).select('-__v');
    res.json(downloads);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Create download
router.post('/', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const description = sanitizeStr(req.body.description, 2000);
    const category = VALID_CATEGORIES.includes(req.body.category) ? req.body.category : 'Other';
    const academicYear = sanitizeStr(req.body.academicYear, 20);
    const fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    const externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    const fileType = sanitizeStr(req.body.fileType, 50);
    const fileSize = sanitizeStr(req.body.fileSize, 50);
    const status = ['Published','Draft','Archived'].includes(req.body.status) ? req.body.status : 'Draft';
    const isFeatured = req.body.isFeatured === true;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const download = await Download.create({ title, description, category, academicYear, fileUrl, externalUrl, fileType, fileSize, status, isFeatured });
    res.json(download);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Update download
router.put('/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.description !== undefined) update.description = sanitizeStr(req.body.description, 2000);
    if (req.body.category !== undefined) update.category = VALID_CATEGORIES.includes(req.body.category) ? req.body.category : 'Other';
    if (req.body.academicYear !== undefined) update.academicYear = sanitizeStr(req.body.academicYear, 20);
    if (req.body.fileUrl !== undefined) update.fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    if (req.body.externalUrl !== undefined) update.externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    if (req.body.fileType !== undefined) update.fileType = sanitizeStr(req.body.fileType, 50);
    if (req.body.fileSize !== undefined) update.fileSize = sanitizeStr(req.body.fileSize, 50);
    if (req.body.status !== undefined) update.status = ['Published','Draft','Archived'].includes(req.body.status) ? req.body.status : 'Draft';
    if (req.body.isFeatured !== undefined) update.isFeatured = req.body.isFeatured === true;
    const download = await Download.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!download) return res.status(404).json({ error: 'Not found' });
    res.json(download);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Delete download
router.delete('/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await Download.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

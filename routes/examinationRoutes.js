const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ExamNotice = require('../models/ExamNotice');
const ExamTimetable = require('../models/ExamTimetable');
const ResultLink = require('../models/ResultLink');
const QuestionPaper = require('../models/QuestionPaper');
const { mockExamNotices, mockExamTimetables, mockResultLinks, mockQuestionPapers } = require('../utils/mockData');
const { sanitizeStr, isValidObjectId } = require('../utils/helpers');
const { authMiddleware, objectIdMiddleware } = require('../middleware/auth');

// ===== BASE ROUTE =====
router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'examination', endpoints: ['/notices', '/timetables', '/results', '/question-papers'] });
});

// ===== PUBLIC EXAM NOTICES =====
router.get('/notices', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ notices: mockExamNotices, total: mockExamNotices.length, page: 1, totalPages: 1 });
  }
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const query = { status: 'Published' };
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: searchRegex }, { body: searchRegex }];
    }
    const total = await ExamNotice.countDocuments(query);
    const notices = await ExamNotice.find(query).sort({ noticeDate: -1 }).skip(skip).limit(limit).select('-__v');
    res.json({ notices, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    res.json({ notices: mockExamNotices, total: mockExamNotices.length, page: 1, totalPages: 1 });
  }
});

// ===== PUBLIC TIMETABLES =====
router.get('/timetables', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockExamTimetables);
  }
  try {
    const query = { status: 'Published' };
    if (req.query.course) query.course = { $regex: new RegExp(req.query.course.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') };
    if (req.query.semester) query.semester = req.query.semester;
    if (req.query.academicYear) query.academicYear = req.query.academicYear;
    const timetables = await ExamTimetable.find(query).sort({ startDate: -1 }).select('-__v');
    res.json(timetables);
  } catch {
    res.json(mockExamTimetables);
  }
});

// ===== PUBLIC RESULTS =====
router.get('/results', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockResultLinks);
  }
  try {
    const query = { status: 'Published' };
    if (req.query.course) query.course = { $regex: new RegExp(req.query.course.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') };
    if (req.query.semester) query.semester = req.query.semester;
    if (req.query.academicYear) query.academicYear = req.query.academicYear;
    const results = await ResultLink.find(query).sort({ resultDate: -1 }).select('-__v');
    res.json(results);
  } catch {
    res.json(mockResultLinks);
  }
});

// ===== PUBLIC QUESTION PAPERS =====
router.get('/question-papers', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ questionPapers: mockQuestionPapers, total: mockQuestionPapers.length, page: 1, totalPages: 1 });
  }
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;
    const query = { status: 'Published' };
    if (req.query.course) query.course = { $regex: new RegExp(req.query.course.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') };
    if (req.query.semester) query.semester = req.query.semester;
    if (req.query.academicYear) query.academicYear = req.query.academicYear;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ subject: searchRegex }, { subjectCode: searchRegex }];
    }
    const total = await QuestionPaper.countDocuments(query);
    const questionPapers = await QuestionPaper.find(query).sort({ year: -1, examSession: 1 }).skip(skip).limit(limit).select('-__v');
    res.json({ questionPapers, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    res.json({ questionPapers: mockQuestionPapers, total: mockQuestionPapers.length, page: 1, totalPages: 1 });
  }
});

// ===== ADMIN EXAM NOTICES =====
router.post('/notices', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const body = sanitizeStr(req.body.body, 10000);
    const category = ['Internal','University','Hall Ticket','ATKT','Revaluation','General'].includes(req.body.category) ? req.body.category : 'General';
    const pdfUrl = sanitizeStr(req.body.pdfUrl, 1000);
    const externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    const noticeDate = req.body.noticeDate ? new Date(req.body.noticeDate) : new Date();
    const isImportant = req.body.isImportant === true;
    const status = ['Published','Draft','Archived'].includes(req.body.status) ? req.body.status : 'Draft';
    if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });
    const notice = await ExamNotice.create({ title, body, category, pdfUrl, externalUrl, noticeDate, isImportant, status });
    res.json(notice);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.put('/notices/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.body !== undefined) update.body = sanitizeStr(req.body.body, 10000);
    if (req.body.category !== undefined) update.category = req.body.category;
    if (req.body.pdfUrl !== undefined) update.pdfUrl = sanitizeStr(req.body.pdfUrl, 1000);
    if (req.body.externalUrl !== undefined) update.externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    if (req.body.noticeDate !== undefined) update.noticeDate = new Date(req.body.noticeDate);
    if (req.body.isImportant !== undefined) update.isImportant = req.body.isImportant === true;
    if (req.body.status !== undefined) update.status = req.body.status;
    const notice = await ExamNotice.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ error: 'Not found' });
    res.json(notice);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/notices/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await ExamNotice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ===== ADMIN TIMETABLES =====
router.post('/timetables', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const course = sanitizeStr(req.body.course, 200);
    const semester = sanitizeStr(req.body.semester, 50);
    const division = sanitizeStr(req.body.division, 50);
    const examinationType = ['Internal','University','ATKT','Revaluation'].includes(req.body.examinationType) ? req.body.examinationType : 'University';
    const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
    const endDate = req.body.endDate ? new Date(req.body.endDate) : new Date();
    const academicYear = sanitizeStr(req.body.academicYear, 20);
    const fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    const status = ['Published','Draft','Archived'].includes(req.body.status) ? req.body.status : 'Draft';
    if (!title || !course || !semester) return res.status(400).json({ error: 'Title, course and semester are required' });
    const timetable = await ExamTimetable.create({ title, course, semester, division, examinationType, startDate, endDate, academicYear, fileUrl, status });
    res.json(timetable);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.put('/timetables/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.course !== undefined) update.course = sanitizeStr(req.body.course, 200);
    if (req.body.semester !== undefined) update.semester = sanitizeStr(req.body.semester, 50);
    if (req.body.division !== undefined) update.division = sanitizeStr(req.body.division, 50);
    if (req.body.examinationType !== undefined) update.examinationType = req.body.examinationType;
    if (req.body.startDate !== undefined) update.startDate = new Date(req.body.startDate);
    if (req.body.endDate !== undefined) update.endDate = new Date(req.body.endDate);
    if (req.body.academicYear !== undefined) update.academicYear = sanitizeStr(req.body.academicYear, 20);
    if (req.body.fileUrl !== undefined) update.fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    if (req.body.status !== undefined) update.status = req.body.status;
    const timetable = await ExamTimetable.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!timetable) return res.status(404).json({ error: 'Not found' });
    res.json(timetable);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/timetables/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await ExamTimetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ===== ADMIN RESULTS =====
router.post('/results', authMiddleware, async (req, res) => {
  try {
    const title = sanitizeStr(req.body.title, 300);
    const course = sanitizeStr(req.body.course, 200);
    const semester = sanitizeStr(req.body.semester, 50);
    const resultDate = req.body.resultDate ? new Date(req.body.resultDate) : new Date();
    const externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    const academicYear = sanitizeStr(req.body.academicYear, 20);
    const status = ['Published','Draft'].includes(req.body.status) ? req.body.status : 'Draft';
    if (!title || !course || !semester) return res.status(400).json({ error: 'Title, course and semester are required' });
    const result = await ResultLink.create({ title, course, semester, resultDate, externalUrl, academicYear, status });
    res.json(result);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.put('/results/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const update = {};
    if (req.body.title !== undefined) update.title = sanitizeStr(req.body.title, 300);
    if (req.body.course !== undefined) update.course = sanitizeStr(req.body.course, 200);
    if (req.body.semester !== undefined) update.semester = sanitizeStr(req.body.semester, 50);
    if (req.body.resultDate !== undefined) update.resultDate = new Date(req.body.resultDate);
    if (req.body.externalUrl !== undefined) update.externalUrl = sanitizeStr(req.body.externalUrl, 1000);
    if (req.body.academicYear !== undefined) update.academicYear = sanitizeStr(req.body.academicYear, 20);
    if (req.body.status !== undefined) update.status = req.body.status;
    const result = await ResultLink.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json(result);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/results/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await ResultLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ===== ADMIN QUESTION PAPERS =====
router.post('/question-papers', authMiddleware, async (req, res) => {
  try {
    const subject = sanitizeStr(req.body.subject, 300);
    const subjectCode = sanitizeStr(req.body.subjectCode, 50);
    const course = sanitizeStr(req.body.course, 200);
    const semester = sanitizeStr(req.body.semester, 50);
    const examinationType = ['Internal','University','ATKT'].includes(req.body.examinationType) ? req.body.examinationType : 'University';
    const academicYear = sanitizeStr(req.body.academicYear, 20);
    const fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    const status = ['Published','Draft'].includes(req.body.status) ? req.body.status : 'Draft';
    if (!subject || !course || !semester) return res.status(400).json({ error: 'Subject, course and semester are required' });
    const paper = await QuestionPaper.create({ subject, subjectCode, course, semester, examinationType, academicYear, fileUrl, status });
    res.json(paper);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.put('/question-papers/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const update = {};
    if (req.body.subject !== undefined) update.subject = sanitizeStr(req.body.subject, 300);
    if (req.body.subjectCode !== undefined) update.subjectCode = sanitizeStr(req.body.subjectCode, 50);
    if (req.body.course !== undefined) update.course = sanitizeStr(req.body.course, 200);
    if (req.body.semester !== undefined) update.semester = sanitizeStr(req.body.semester, 50);
    if (req.body.examinationType !== undefined) update.examinationType = req.body.examinationType;
    if (req.body.academicYear !== undefined) update.academicYear = sanitizeStr(req.body.academicYear, 20);
    if (req.body.fileUrl !== undefined) update.fileUrl = sanitizeStr(req.body.fileUrl, 1000);
    if (req.body.status !== undefined) update.status = req.body.status;
    const paper = await QuestionPaper.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!paper) return res.status(404).json({ error: 'Not found' });
    res.json(paper);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/question-papers/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await QuestionPaper.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ===== ADMIN ALL DATA =====
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const [notices, timetables, results, papers] = await Promise.all([
      ExamNotice.find().sort({ createdAt: -1 }).select('-__v'),
      ExamTimetable.find().sort({ createdAt: -1 }).select('-__v'),
      ResultLink.find().sort({ createdAt: -1 }).select('-__v'),
      QuestionPaper.find().sort({ createdAt: -1 }).select('-__v')
    ]);
    res.json({ notices, timetables, results, papers });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

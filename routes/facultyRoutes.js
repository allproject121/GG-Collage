const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const Faculty = require('../models/Faculty');
const { sanitizeStr, isValidObjectId } = require('../utils/helpers');
const { authMiddleware, objectIdMiddleware } = require('../middleware/auth');

// ===== PUBLIC DEPARTMENTS =====
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find({ status: 'Published' }).sort({ displayOrder: 1, name: 1 }).select('-__v');
    res.json(departments);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const dept = await Department.findOne({ slug: req.params.slug, status: 'Published' }).select('-__v').populate('hodFacultyId', 'fullName designation qualification specialisation profileImageUrl');
    if (!dept) return res.status(404).json({ error: 'Department not found' });
    const faculty = await Faculty.find({ departmentId: dept._id, status: 'Published' }).sort({ displayOrder: 1, fullName: 1 }).select('-__v');
    res.json({ department: dept, faculty });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ===== PUBLIC FACULTY =====
router.get('/faculty/all', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const query = { status: 'Published' };
    if (req.query.department) {
      const dept = await Department.findOne({ slug: req.query.department });
      if (dept) query.departmentId = dept._id;
    }
    if (req.query.designation) {
      query.designation = { $regex: new RegExp(req.query.designation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') };
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ fullName: searchRegex }, { subjects: searchRegex }, { specialisation: searchRegex }];
    }
    const total = await Faculty.countDocuments(query);
    const faculty = await Faculty.find(query).populate('departmentId', 'name slug').sort({ displayOrder: 1, fullName: 1 }).skip(skip).limit(limit).select('-__v');
    res.json({ faculty, total, page, totalPages: Math.ceil(total / limit) });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.get('/faculty/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const f = await Faculty.findOne({ _id: req.params.id, status: 'Published' }).populate('departmentId', 'name slug').select('-__v');
    if (!f) return res.status(404).json({ error: 'Faculty not found' });
    res.json(f);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ===== ADMIN DEPARTMENTS =====
router.post('/admin/departments', authMiddleware, async (req, res) => {
  try {
    const name = sanitizeStr(req.body.name, 200);
    const slug = sanitizeStr(req.body.slug, 200).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const shortDescription = sanitizeStr(req.body.shortDescription, 500);
    const fullDescription = sanitizeStr(req.body.fullDescription, 5000);
    const email = sanitizeStr(req.body.email, 200);
    const phone = sanitizeStr(req.body.phone, 20);
    const imageUrl = sanitizeStr(req.body.imageUrl, 1000);
    const displayOrder = parseInt(req.body.displayOrder) || 0;
    const status = ['Published','Draft'].includes(req.body.status) ? req.body.status : 'Published';
    if (!name) return res.status(400).json({ error: 'Department name is required' });
    const dept = await Department.create({ name, slug, shortDescription, fullDescription, email, phone, imageUrl, displayOrder, status });
    res.json(dept);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.put('/admin/departments/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
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

router.delete('/admin/departments/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await Department.findByIdAndDelete(req.params.id);
    await Faculty.updateMany({ departmentId: req.params.id }, { $set: { departmentId: null } });
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// ===== ADMIN FACULTY =====
router.post('/admin/faculty', authMiddleware, async (req, res) => {
  try {
    const fullName = sanitizeStr(req.body.fullName, 200);
    const designation = sanitizeStr(req.body.designation, 200);
    const departmentId = isValidObjectId(req.body.departmentId) ? req.body.departmentId : null;
    const qualification = sanitizeStr(req.body.qualification, 500);
    const specialisation = sanitizeStr(req.body.specialisation, 500);
    const experience = sanitizeStr(req.body.experience, 200);
    const subjects = sanitizeStr(req.body.subjects, 500);
    const email = sanitizeStr(req.body.email, 200);
    const phone = sanitizeStr(req.body.phone, 20);
    const profileImageUrl = sanitizeStr(req.body.profileImageUrl, 1000);
    const message = sanitizeStr(req.body.message, 2000);
    const displayOrder = parseInt(req.body.displayOrder) || 0;
    const status = ['Published','Draft'].includes(req.body.status) ? req.body.status : 'Published';
    if (!fullName) return res.status(400).json({ error: 'Faculty name is required' });
    const f = await Faculty.create({ fullName, designation, departmentId, qualification, specialisation, experience, subjects, email, phone, profileImageUrl, message, displayOrder, status });
    res.json(f);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.put('/admin/faculty/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const update = {};
    if (req.body.fullName !== undefined) update.fullName = sanitizeStr(req.body.fullName, 200);
    if (req.body.designation !== undefined) update.designation = sanitizeStr(req.body.designation, 200);
    if (req.body.departmentId !== undefined) update.departmentId = isValidObjectId(req.body.departmentId) ? req.body.departmentId : null;
    if (req.body.qualification !== undefined) update.qualification = sanitizeStr(req.body.qualification, 500);
    if (req.body.specialisation !== undefined) update.specialisation = sanitizeStr(req.body.specialisation, 500);
    if (req.body.experience !== undefined) update.experience = sanitizeStr(req.body.experience, 200);
    if (req.body.subjects !== undefined) update.subjects = sanitizeStr(req.body.subjects, 500);
    if (req.body.email !== undefined) update.email = sanitizeStr(req.body.email, 200);
    if (req.body.phone !== undefined) update.phone = sanitizeStr(req.body.phone, 20);
    if (req.body.profileImageUrl !== undefined) update.profileImageUrl = sanitizeStr(req.body.profileImageUrl, 1000);
    if (req.body.message !== undefined) update.message = sanitizeStr(req.body.message, 2000);
    if (req.body.displayOrder !== undefined) update.displayOrder = parseInt(req.body.displayOrder) || 0;
    if (req.body.status !== undefined) update.status = req.body.status;
    const f = await Faculty.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!f) return res.status(404).json({ error: 'Not found' });
    res.json(f);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/admin/faculty/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin all data
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const [departments, faculty] = await Promise.all([
      Department.find().sort({ displayOrder: 1, name: 1 }).select('-__v'),
      Faculty.find().populate('departmentId', 'name slug').sort({ displayOrder: 1, fullName: 1 }).select('-__v')
    ]);
    res.json({ departments, faculty });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

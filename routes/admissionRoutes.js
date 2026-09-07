const express = require('express');
const router = express.Router();
const AdmissionApplication = require('../models/AdmissionApplication');
const { sanitizeStr, isValidObjectId, isValidEmail, isValidPhone, generateApplicationNumber } = require('../utils/helpers');
const { authMiddleware, objectIdMiddleware } = require('../middleware/auth');

// Public: Submit admission application
router.post('/', async (req, res) => {
  try {
    const applicantName = sanitizeStr(req.body.applicantName, 200);
    const dateOfBirth = sanitizeStr(req.body.dateOfBirth, 20);
    const gender = ['Male','Female','Other','Prefer not to say'].includes(req.body.gender) ? req.body.gender : '';
    const email = sanitizeStr(req.body.email, 200);
    const phone = sanitizeStr(req.body.phone, 20);
    const address = sanitizeStr(req.body.address, 500);
    const city = sanitizeStr(req.body.city, 100);
    const state = sanitizeStr(req.body.state, 100);
    const postalCode = sanitizeStr(req.body.postalCode, 10);
    const selectedProgramme = sanitizeStr(req.body.selectedProgramme, 200);
    const previousQualification = sanitizeStr(req.body.previousQualification, 200);
    const previousBoardOrUniversity = sanitizeStr(req.body.previousBoardOrUniversity, 200);
    const previousPercentage = sanitizeStr(req.body.previousPercentage, 20);
    const category = ['General','OBC','SC','ST','EWS','Other','Prefer not to say'].includes(req.body.category) ? req.body.category : 'General';
    const applicantMessage = sanitizeStr(req.body.applicantMessage, 2000);

    if (!applicantName) return res.status(400).json({ error: 'Applicant name is required' });
    if (!dateOfBirth) return res.status(400).json({ error: 'Date of birth is required' });
    if (!gender) return res.status(400).json({ error: 'Gender is required' });
    if (!email || !isValidEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (!phone || !isValidPhone(phone)) return res.status(400).json({ error: 'Valid phone number is required' });
    if (!selectedProgramme) return res.status(400).json({ error: 'Programme selection is required' });

    const applicationNumber = generateApplicationNumber();
    const app = await AdmissionApplication.create({
      applicationNumber, applicantName, dateOfBirth, gender, email, phone,
      address, city, state, postalCode, selectedProgramme,
      previousQualification, previousBoardOrUniversity, previousPercentage,
      category, applicantMessage
    });
    res.json({ message: 'Application submitted successfully', applicationNumber, applicationId: app._id });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Public: Check application status
router.post('/status', async (req, res) => {
  try {
    const applicationNumber = sanitizeStr(req.body.applicationNumber, 50);
    const identifier = sanitizeStr(req.body.identifier, 200);
    if (!applicationNumber) return res.status(400).json({ error: 'Application number is required' });
    if (!identifier) return res.status(400).json({ error: 'Phone or email is required' });

    const query = { applicationNumber };
    if (identifier.includes('@')) {
      query.email = identifier.toLowerCase();
    } else {
      query.phone = identifier;
    }
    const app = await AdmissionApplication.findOne(query).select('applicationNumber applicantName applicationStatus updatedAt');
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json({
      applicationNumber: app.applicationNumber,
      applicantName: app.applicantName,
      status: app.applicationStatus,
      lastUpdated: app.updatedAt
    });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Get all applications
router.get('/admin/applications', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.status && req.query.status !== 'all') query.applicationStatus = req.query.status;
    if (req.query.programme && req.query.programme !== 'all') query.selectedProgramme = { $regex: new RegExp(req.query.programme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') };
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ applicantName: searchRegex }, { applicationNumber: searchRegex }, { email: searchRegex }];
    }
    const total = await AdmissionApplication.countDocuments(query);
    const applications = await AdmissionApplication.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-__v');
    res.json({ applications, total, page, totalPages: Math.ceil(total / limit) });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Get single application
router.get('/admin/applications/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const app = await AdmissionApplication.findById(req.params.id).select('-__v');
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Update application status
router.patch('/admin/applications/:id/status', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    const status = ['Submitted','Under Review','Documents Required','Approved','Rejected','Cancelled'].includes(req.body.status) ? req.body.status : 'Submitted';
    const adminRemark = sanitizeStr(req.body.adminRemark || '', 2000);
    const update = { applicationStatus: status };
    if (adminRemark) update.adminRemark = adminRemark;
    const app = await AdmissionApplication.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Delete application
router.delete('/admin/applications/:id', authMiddleware, objectIdMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
    await AdmissionApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Export applications as CSV
router.get('/admin/export/csv', authMiddleware, async (req, res) => {
  try {
    const query = {};
    if (req.query.status && req.query.status !== 'all') query.applicationStatus = req.query.status;
    if (req.query.programme && req.query.programme !== 'all') query.selectedProgramme = req.query.programme;
    const apps = await AdmissionApplication.find(query).sort({ createdAt: -1 }).select('-__v');
    const headers = ['Application No','Name','DOB','Gender','Email','Phone','City','State','Programme','Qualification','Board','Percentage','Category','Status','Submitted','Admin Remark'];
    const rows = apps.map(a => [
      a.applicationNumber, a.applicantName, a.dateOfBirth, a.gender, a.email, a.phone,
      a.city, a.state, a.selectedProgramme, a.previousQualification, a.previousBoardOrUniversity,
      a.previousPercentage, a.category, a.applicationStatus, new Date(a.createdAt).toISOString().split('T')[0], a.adminRemark
    ].map(v => '"' + String(v || '').replace(/"/g, '""') + '"').join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=admissions-export.csv');
    res.send(csv);
  } catch { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;

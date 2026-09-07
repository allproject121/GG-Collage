const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, default: '', trim: true },
  fullDescription: { type: String, default: '', trim: true },
  date: { type: String, default: '' },
  category: { type: String, default: 'General' },
  department: { type: String, default: '', trim: true },
  noticeDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, default: null },
  pdfUrl: { type: String, default: '' },
  externalUrl: { type: String, default: '', trim: true },
  body: { type: String, default: '', trim: true },
  isImportant: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  status: { type: String, enum: ['Draft','Published','Archived'], default: 'Draft' },
  createdBy: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);

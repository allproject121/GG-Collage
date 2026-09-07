const mongoose = require('mongoose');

const resultLinkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  semester: { type: String, required: true, trim: true },
  resultDate: { type: Date, default: Date.now },
  externalUrl: { type: String, default: '', trim: true },
  academicYear: { type: String, default: '', trim: true },
  status: { type: String, enum: ['Published','Draft'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('ResultLink', resultLinkSchema);

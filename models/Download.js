const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  category: { type: String, required: true, enum: ['Prospectus','Admission Forms','Examination Forms','Scholarship Forms','Academic Calendar','Timetable','NAAC Documents','NIRF Reports','IQAC Documents','Policies','Annual Reports','Question Papers','Other'], default: 'Other' },
  academicYear: { type: String, default: '', trim: true },
  fileUrl: { type: String, default: '', trim: true },
  externalUrl: { type: String, default: '', trim: true },
  fileType: { type: String, default: '', trim: true },
  fileSize: { type: String, default: '', trim: true },
  status: { type: String, enum: ['Published','Draft','Archived'], default: 'Draft' },
  isFeatured: { type: Boolean, default: false },
  downloadCount: { type: Number, default: 0 },
  publishedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Download', downloadSchema);

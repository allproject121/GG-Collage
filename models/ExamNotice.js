const mongoose = require('mongoose');

const examNoticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  body: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Internal','University','Hall Ticket','ATKT','Revaluation','General'], default: 'General' },
  pdfUrl: { type: String, default: '', trim: true },
  externalUrl: { type: String, default: '', trim: true },
  noticeDate: { type: Date, default: Date.now },
  isImportant: { type: Boolean, default: false },
  status: { type: String, enum: ['Published','Draft','Archived'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('ExamNotice', examNoticeSchema);

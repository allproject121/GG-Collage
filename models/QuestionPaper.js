const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  subjectCode: { type: String, default: '', trim: true },
  course: { type: String, required: true, trim: true },
  semester: { type: String, required: true, trim: true },
  examinationType: { type: String, enum: ['Internal','University','ATKT'], default: 'University' },
  academicYear: { type: String, default: '', trim: true },
  fileUrl: { type: String, default: '', trim: true },
  status: { type: String, enum: ['Published','Draft'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);

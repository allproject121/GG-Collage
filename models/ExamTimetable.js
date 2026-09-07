const mongoose = require('mongoose');

const examTimetableSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  semester: { type: String, required: true, trim: true },
  division: { type: String, default: '', trim: true },
  examinationType: { type: String, enum: ['Internal','University','ATKT','Revaluation'], default: 'University' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  academicYear: { type: String, default: '', trim: true },
  fileUrl: { type: String, default: '', trim: true },
  status: { type: String, enum: ['Published','Draft','Archived'], default: 'Draft' }
}, { timestamps: true });

module.exports = mongoose.model('ExamTimetable', examTimetableSchema);

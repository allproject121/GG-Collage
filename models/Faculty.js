const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  designation: { type: String, default: '', trim: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
  qualification: { type: String, default: '', trim: true },
  specialisation: { type: String, default: '', trim: true },
  experience: { type: String, default: '', trim: true },
  subjects: { type: String, default: '', trim: true },
  email: { type: String, default: '', trim: true, lowercase: true },
  phone: { type: String, default: '', trim: true },
  profileImageUrl: { type: String, default: '', trim: true },
  message: { type: String, default: '', trim: true },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['Published','Draft'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);

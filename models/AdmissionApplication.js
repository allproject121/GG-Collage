const mongoose = require('mongoose');

const admissionApplicationSchema = new mongoose.Schema({
  applicationNumber: { type: String, required: true, unique: true, trim: true },
  applicantName: { type: String, required: true, trim: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, enum: ['Male','Female','Other','Prefer not to say'], required: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, default: '', trim: true },
  city: { type: String, default: '', trim: true },
  state: { type: String, default: '', trim: true },
  postalCode: { type: String, default: '', trim: true },
  selectedProgramme: { type: String, required: true, trim: true },
  previousQualification: { type: String, default: '', trim: true },
  previousBoardOrUniversity: { type: String, default: '', trim: true },
  previousPercentage: { type: String, default: '', trim: true },
  category: { type: String, enum: ['General','OBC','SC','ST','EWS','Other','Prefer not to say'], default: 'General' },
  documentUrls: { type: [String], default: [] },
  applicantMessage: { type: String, default: '', trim: true },
  applicationStatus: { type: String, enum: ['Submitted','Under Review','Documents Required','Approved','Rejected','Cancelled'], default: 'Submitted' },
  adminRemark: { type: String, default: '', trim: true }
}, { timestamps: true });

admissionApplicationSchema.index({ email: 1 });
admissionApplicationSchema.index({ phone: 1 });
admissionApplicationSchema.index({ applicationStatus: 1 });

module.exports = mongoose.model('AdmissionApplication', admissionApplicationSchema);

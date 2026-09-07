const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  shortDescription: { type: String, default: '', trim: true },
  fullDescription: { type: String, default: '', trim: true },
  hodFacultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: null },
  email: { type: String, default: '', trim: true, lowercase: true },
  phone: { type: String, default: '', trim: true },
  imageUrl: { type: String, default: '', trim: true },
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['Published','Draft'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);

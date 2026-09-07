const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  graduationYear: { type: String, required: true },
  programme: { type: String, required: true, trim: true },
  occupation: { type: String, trim: true, default: '' },
  message: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);

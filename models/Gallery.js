const mongoose = require('mongoose');
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 300 },
  imageUrl: { type: String, required: true, trim: true, maxlength: 1000 },
  album: { type: String, trim: true, maxlength: 200, default: '' },
  category: { type: String, trim: true, maxlength: 200, default: '' },
  caption: { type: String, trim: true, maxlength: 1000, default: '' },
  displayOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Gallery', gallerySchema);

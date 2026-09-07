const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  youtubeUrl: { type: String, required: true, trim: true },
  youtubeVideoId: { type: String, required: true },
  description: { type: String, trim: true, default: '' },
  thumbnailUrl: { type: String, trim: true, default: '' },
  isFeatured: { type: Boolean, default: false },
  publishedDate: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);

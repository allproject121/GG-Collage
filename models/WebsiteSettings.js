const mongoose = require('mongoose');
const websiteSettingsSchema = new mongoose.Schema({
  collegeName: { type: String, default: 'St. Gonsalo Garcia College of Arts and Commerce', maxlength: 300 },
  tagline: { type: String, default: '', maxlength: 500 },
  address: { type: String, default: '', maxlength: 1000 },
  phone: { type: String, default: '', maxlength: 50 },
  email: { type: String, default: '', maxlength: 200 },
  description: { type: String, default: '', maxlength: 5000 },
  // Social media
  facebook: { type: String, default: '', maxlength: 1000 },
  twitter: { type: String, default: '', maxlength: 1000 },
  instagram: { type: String, default: '', maxlength: 1000 },
  youtube: { type: String, default: '', maxlength: 1000 },
  linkedin: { type: String, default: '', maxlength: 1000 },
  // Footer
  footerText: { type: String, default: '', maxlength: 2000 },
  copyrightText: { type: String, default: '', maxlength: 500 },
  // SEO
  metaTitle: { type: String, default: '', maxlength: 300 },
  metaDescription: { type: String, default: '', maxlength: 1000 },
  metaKeywords: { type: String, default: '', maxlength: 1000 },
  gaId: { type: String, default: '', maxlength: 100 },
  // Theme & effects
  themeStyle: { type: String, enum: ['classic', 'modern', 'premium'], default: 'premium' },
  animationLevel: { type: String, enum: ['off', 'minimal', 'standard', 'enhanced'], default: 'standard' },
  glassIntensity: { type: String, enum: ['off', 'light', 'medium'], default: 'medium' },
  heroEffect: { type: String, enum: ['static', 'fade', 'kenburns'], default: 'kenburns' },
  tickerSpeed: { type: Number, default: 30, min: 10, max: 120 },
  enableCounters: { type: Boolean, default: true },
  enablePageTransitions: { type: Boolean, default: true },
  enableGalleryAnimations: { type: Boolean, default: true },
  enableBackgroundPatterns: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);

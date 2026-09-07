const mongoose = require('mongoose');

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function sanitizeStr(v, maxLen) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, maxLen || 1000);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidPhone(v) {
  if (!v) return true;
  return /^[\d\s\-+()]{7,20}$/.test(v);
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `GGC-ADM-${year}-${random}`;
}

function isValidUrl(v) {
  if (!v) return true;
  try {
    const url = new URL(v);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = { escapeHtml, sanitizeStr, isValidEmail, isValidPhone, isValidObjectId, generateApplicationNumber, isValidUrl };

// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, required: true },
  technologies: [{ type: String, trim: true }],
  githubLink:   { type: String, default: '' },
  liveLink:     { type: String, default: '' },
  imageUrl:     { type: String, default: '' },
  featured:     { type: Boolean, default: false },
  category:     { type: String, enum: ['web', 'mobile', 'ml', 'other'], default: 'web' },
  order:        { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

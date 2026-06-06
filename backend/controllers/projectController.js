// controllers/projectController.js
const Project = require('../models/Project');

// GET /api/projects
exports.getAll = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { technologies:{ $regex: search, $options: 'i' } }
    ];
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/projects/:id
exports.getOne = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/projects  (admin)
exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(t => t.trim());
    }
    const project = await Project.create(data);
    res.status(201).json({ project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/projects/:id  (admin)
exports.update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    if (typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map(t => t.trim());
    }
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/projects/:id  (admin)
exports.remove = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

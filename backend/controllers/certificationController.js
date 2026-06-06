// controllers/certificationController.js
const Certification = require('../models/Certification');

exports.getAll = async (req, res) => {
  try {
    const certs = await Certification.find().sort({ date: -1 });
    res.json({ certifications: certs });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    const cert = await Certification.create(data);
    res.status(201).json({ certification: cert });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    const cert = await Certification.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!cert) return res.status(404).json({ error: 'Certification not found' });
    res.json({ certification: cert });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certification not found' });
    res.json({ message: 'Certification deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

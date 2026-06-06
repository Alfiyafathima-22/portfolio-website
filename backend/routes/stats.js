// routes/stats.js — Visitor counter endpoint
const router  = require('express').Router();
const Visitor = require('../models/Visitor');

// POST /api/stats/visit  — increment today's counter
router.post('/visit', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const doc = await Visitor.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.json({ date: today, count: doc.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/visits  — total visitor count
router.get('/visits', async (req, res) => {
  try {
    const result = await Visitor.aggregate([{ $group: { _id: null, total: { $sum: '$count' } } }]);
    res.json({ total: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

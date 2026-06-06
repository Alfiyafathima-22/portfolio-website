const express = require("express");
const router = express.Router();
const Certification = require("../models/Certification");

// GET all certifications
router.get("/", async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });

    res.json({ certifications }); // ✅ IMPORTANT FORMAT
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
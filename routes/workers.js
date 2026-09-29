const express = require('express');
const router  = express.Router();
const Worker  = require('../models/Worker');

// GET /api/workers
// Query params (all optional):
//   ?location=nashik        → case-insensitive partial match on location
//   ?available=true|false   → filter by availability
//   ?skill=harvesting       → case-insensitive partial match on skill
router.get('/', async (req, res) => {
  try {
    const filter = {};

    // Location filter
    if (req.query.location && req.query.location.trim() !== '') {
      filter.location = { $regex: req.query.location.trim(), $options: 'i' };
    }

    // Availability filter
    if (req.query.available !== undefined && req.query.available !== '') {
      filter.available = req.query.available === 'true';
    }

    // Skill filter
    if (req.query.skill && req.query.skill.trim() !== '') {
      filter.skill = { $regex: req.query.skill.trim(), $options: 'i' };
    }

    const workers = await Worker.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: workers.length, data: workers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/workers — register a new worker
router.post('/', async (req, res) => {
  try {
    const { name, phone, skill, location, available } = req.body;

    if (!name || !phone || !skill || !location) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const worker = new Worker({
      name,
      phone,
      skill,
      location,
      available: available !== undefined ? Boolean(available) : true
    });

    await worker.save();
    res.status(201).json({ success: true, message: 'Worker registered successfully!', data: worker });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;

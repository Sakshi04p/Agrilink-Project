const express = require('express');
const router  = express.Router();
const Job     = require('../models/Job');

// GET /api/jobs
// Query params (optional):
//   ?location=nashik   → case-insensitive partial match
//   ?workType=harvest  → case-insensitive partial match
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.location && req.query.location.trim() !== '') {
      filter.location = { $regex: req.query.location.trim(), $options: 'i' };
    }

    if (req.query.workType && req.query.workType.trim() !== '') {
      filter.workType = { $regex: req.query.workType.trim(), $options: 'i' };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/jobs — post a new job
router.post('/', async (req, res) => {
  try {
    const { workType, location, phone } = req.body;

    if (!workType || !location || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const job = new Job({ workType, location, phone });
    await job.save();
    res.status(201).json({ success: true, message: 'Job posted successfully!', data: job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;

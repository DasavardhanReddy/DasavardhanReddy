const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages, optional ?vehicle=<id>
router.get('/', async (req, res) => {
  try {
    const { vehicle } = req.query;
    const filter = {};
    if(vehicle) filter.vehicle = vehicle;
    const msgs = await Message.find(filter).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Post a message
router.post('/', async (req, res) => {
  try {
    const { senderName, senderRole, text, vehicle } = req.body;
    const m = await Message.create({ senderName, senderRole, text, vehicle });
    res.json(m);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

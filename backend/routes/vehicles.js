const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

// Search vehicles by number or driver name
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if(!q) return res.status(400).json({ message: 'Query q required' });
  try {
    // try search by vehicle number (partial)
    const byNumber = await Vehicle.find({ number: { $regex: q, $options: 'i' } }).populate('driver');
    // if not found by number, try driver name
    const byDriver = await Vehicle.find().populate({
      path: 'driver',
      match: { name: { $regex: q, $options: 'i' } }
    });
    const merged = [...byNumber, ...byDriver.filter(v=>v.driver)];
    res.json(merged);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get vehicle details
router.get('/:id', async (req, res) => {
  try {
    const v = await Vehicle.findById(req.params.id).populate('driver');
    if(!v) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(v);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update vehicle current location / destination / status
router.put('/:id', async (req, res) => {
  try {
    const { currentLocation, destination, status, driverId } = req.body;
    const v = await Vehicle.findById(req.params.id);
    if(!v) return res.status(404).json({ message: 'Vehicle not found' });
    if(currentLocation !== undefined) v.currentLocation = currentLocation;
    if(destination !== undefined) v.destination = destination;
    if(status !== undefined) v.status = status;
    if(driverId !== undefined) {
      const driver = await Driver.findById(driverId);
      if(driver) {
        v.driver = driver._id;
        if(!driver.assignedVehicles.includes(v._id)) {
          driver.assignedVehicles.push(v._id);
          await driver.save();
        }
      }
    }
    await v.save();
    res.json(v);
  } catch (err){ res.status(500).json({ message: err.message }); }
});

// Add history entry (end of trip)
router.post('/:id/history', async (req, res) => {
  try {
    const { from, to, cargo, profit, notes } = req.body;
    const v = await Vehicle.findById(req.params.id);
    if(!v) return res.status(404).json({ message: 'Vehicle not found' });
    v.history.push({ from, to, cargo, profit, notes, date: new Date() });
    await v.save();
    // optional: create Trip
    await Trip.create({ vehicle: v._id, from, to, cargo, profit, status: 'completed' });
    res.json(v);
  } catch (err){ res.status(500).json({ message: err.message }); }
});

// List all vehicles (owner)
router.get('/', async (_req, res) => {
  try {
    const list = await Vehicle.find().populate('driver');
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

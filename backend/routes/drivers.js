const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

// Create driver
router.post('/', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const d = await Driver.create({ name, phone });
    res.json(d);
  } catch (err){ res.status(500).json({ message: err.message }); }
});

// List all drivers
router.get('/', async (req, res) => {
  try {
    const { place, q } = req.query;
    // If place query provided, search currentPlace and travelHistory.placeName
    if(place){
      const regex = { $regex: place, $options: 'i' };
      const list = await Driver.find({ $or: [{ currentPlace: regex }, { 'travelHistory.placeName': regex }] });
      return res.json(list);
    }
    // Optional free text q for name search
    if(q){
      const regex = { $regex: q, $options: 'i' };
      const list = await Driver.find({ name: regex });
      return res.json(list);
    }
    const list = await Driver.find();
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update driver location / add travel history entry
router.post('/:id/location', async (req, res) => {
  try {
    const { placeName, lat, lng, note } = req.body;
    const driver = await Driver.findById(req.params.id);
    if(!driver) return res.status(404).json({ message: 'Driver not found' });
    const coords = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
    driver.currentLocation = coords;
    driver.currentPlace = placeName;
    driver.travelHistory = driver.travelHistory || [];
    driver.travelHistory.push({ placeName, coords, note, timestamp: new Date() });
    await driver.save();
    res.json(driver);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Assign driver to vehicle (or create)
router.post('/:id/assign', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    const { vehicleId } = req.body;
    if(!driver) return res.status(404).json({ message: 'Driver not found' });
    const vehicle = await Vehicle.findById(vehicleId);
    if(!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    vehicle.driver = driver._id;
    if(!driver.assignedVehicles.includes(vehicle._id)) driver.assignedVehicles.push(vehicle._id);
    await vehicle.save();
    await driver.save();
    res.json({ driver, vehicle });
  } catch (err){ res.status(500).json({ message: err.message }); }
});

// Get driver details
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('assignedVehicles');
    if(!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Driver searches their vehicles by number
router.get('/:id/vehicles', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('assignedVehicles');
    if(!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver.assignedVehicles);
  } catch (err){ res.status(500).json({ message: err.message }); }
});

module.exports = router;

const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  assignedVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
  // GeoJSON point for live location: { type: 'Point', coordinates: [lng, lat] }
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  // Human readable place name where the driver was present
  currentPlace: String,
  // Travel history records
  travelHistory: [{
    placeName: String,
    coords: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number] } },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);

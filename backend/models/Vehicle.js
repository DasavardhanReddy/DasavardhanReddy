const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true }, // plate number
  model: String,
  currentLocation: String,
  destination: String,
  status: { type: String, enum: ['idle','in-transit','loading','unloading'], default: 'idle' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  history: [{
    date: { type: Date, default: Date.now },
    from: String,
    to: String,
    cargo: String,
    profit: Number,
    notes: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);

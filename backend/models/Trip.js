const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  from: String,
  to: String,
  cargo: String,
  date: { type: Date, default: Date.now },
  profit: Number,
  status: { type: String, enum: ['planned','ongoing','completed'], default: 'planned' }
});

module.exports = mongoose.model('Trip', TripSchema);

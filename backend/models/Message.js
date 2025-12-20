const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['owner','driver','system'], default: 'driver' },
  text: { type: String, required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);

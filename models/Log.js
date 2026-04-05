const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    sourceIP: { type: String, required: true },
    apiCall: { type: String, required: true },
    dataVolume: { type: Number, required: true },
    isAnomaly: { type: Boolean, default: false },
    riskScore: { type: Number, default: 0 },
    reasons: { type: [String], default: [] }
});

module.exports = mongoose.model('Log', LogSchema);

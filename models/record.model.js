const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    serial: { type: String, required: true },
    domainName: { type: String, required: true },
    target: { type: String, required: true },
    port: { type: Number, required: true },
    weight: { type: Number, default: 10 },
    priority: { type: Number, default: 5 },
    ttl: { type: Number, default: 600 },
    token: { type: String, required: true }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;

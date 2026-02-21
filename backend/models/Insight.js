const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    end_year: String,
    intensity: { type: Number, default: 0 },
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: String,
    impact: String,
    added: String,
    published: String,
    country: String,
    relevance: { type: Number, default: 0 },
    pestle: String,
    source: String,
    title: String,
    likelihood: { type: Number, default: 0 },
    city: String
}, { timestamps: true, collection: 'insights' });

module.exports = mongoose.model('Insight', insightSchema);
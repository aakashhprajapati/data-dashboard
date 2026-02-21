const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    end_year: { type: String, default: null },
    intensity: { type: Number, default: 0 },
    sector: { type: String, default: null },
    topic: { type: String, default: null },
    insight: { type: String, default: null },
    url: { type: String, default: null },
    region: { type: String, default: null },
    start_year: { type: String, default: null },
    impact: { type: String, default: null },
    added: { type: String, default: null },
    published: { type: String, default: null },
    country: { type: String, default: null },
    relevance: { type: Number, default: 0 },
    pestle: { type: String, default: null },
    source: { type: String, default: null },
    title: { type: String, default: null },
    likelihood: { type: Number, default: 0 },
    city: { type: String, default: null }
}, {
    timestamps: true,
    collection: 'insights'
});

// Create indexes for better performance
insightSchema.index({ sector: 1 });
insightSchema.index({ country: 1 });
insightSchema.index({ region: 1 });
insightSchema.index({ topic: 1 });
insightSchema.index({ intensity: -1 });

module.exports = mongoose.model('Insight', insightSchema);
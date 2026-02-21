const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');

// GET /api/insights - with filters
router.get('/', async (req, res) => {
    try {
        const { sector, country, region, topic, limit = 50, page = 1 } = req.query;
        
        // Build filter
        const filter = {};
        if (sector) filter.sector = sector;
        if (country) filter.country = country;
        if (region) filter.region = region;
        if (topic) filter.topic = topic;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const insights = await Insight.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ intensity: -1 });
        
        const total = await Insight.countDocuments(filter);
        
        res.json({ insights, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/insights/filters - get distinct filter options
router.get('/filters', async (req, res) => {
    try {
        const [sectors, countries, regions, topics] = await Promise.all([
            Insight.distinct('sector').then(arr => arr.filter(Boolean)),
            Insight.distinct('country').then(arr => arr.filter(Boolean)),
            Insight.distinct('region').then(arr => arr.filter(Boolean)),
            Insight.distinct('topic').then(arr => arr.filter(Boolean))
        ]);
        
        res.json({ sectors, countries, regions, topics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/insights/stats - get statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Insight.aggregate([
            { $group: {
                _id: null,
                totalRecords: { $sum: 1 },
                avgIntensity: { $avg: '$intensity' },
                avgLikelihood: { $avg: '$likelihood' },
                avgRelevance: { $avg: '$relevance' }
            }}
        ]);
        
        const topCountries = await Insight.aggregate([
            { $match: { country: { $ne: null } } },
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        res.json({ ...stats[0] || {}, topCountries });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/insights/aggregated - group by field for charts
router.get('/aggregated', async (req, res) => {
    try {
        const { groupBy = 'sector' } = req.query;
        
        const data = await Insight.aggregate([
            { $match: { [groupBy]: { $ne: null } } },
            { $group: {
                _id: `$${groupBy}`,
                count: { $sum: 1 },
                avgIntensity: { $avg: '$intensity' },
                avgLikelihood: { $avg: '$likelihood' },
                avgRelevance: { $avg: '$relevance' }
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
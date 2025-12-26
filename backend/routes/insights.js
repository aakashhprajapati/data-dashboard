const express = require('express');
const router = express.Router();
const Insight = require('../models/Insight');

// Get all insights with filters
router.get('/', async (req, res) => {
    try {
        const {
            end_year, topics, sector, region, pest, source, swot, country, city,
            page = 1, limit = 50, sort = '-added'
        } = req.query;
        
        const filter = {};
        
        // Apply filters
        if (end_year) filter.end_year = end_year;
        if (topics) filter.topic = { $in: topics.split(',') };
        if (sector) filter.sector = sector;
        if (region) filter.region = region;
        if (pest) filter.pestle = pest;
        if (source) filter.source = source;
        if (swot) filter.title = { $regex: swot, $options: 'i' };
        if (country) filter.country = country;
        if (city) filter.city = city;
        
        // Remove empty filters
        Object.keys(filter).forEach(key => {
            if (filter[key] === undefined || filter[key] === '') {
                delete filter[key];
            }
        });
        
        const insights = await Insight.find(filter)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await Insight.countDocuments(filter);
        
        res.json({
            insights,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get aggregated data for charts
router.get('/aggregated', async (req, res) => {
    try {
        const { groupBy } = req.query;
        const validGroups = ['sector', 'region', 'country', 'topic', 'pestle', 'source', 'end_year'];
        
        if (!validGroups.includes(groupBy)) {
            return res.status(400).json({ message: 'Invalid groupBy parameter' });
        }
        
        const aggregation = await Insight.aggregate([
            {
                $group: {
                    _id: `$${groupBy}`,
                    count: { $sum: 1 },
                    avgIntensity: { $avg: '$intensity' },
                    avgLikelihood: { $avg: '$likelihood' },
                    avgRelevance: { $avg: '$relevance' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);
        
        res.json(aggregation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get available filter options
router.get('/filters', async (req, res) => {
    try {
        const [sectors, regions, countries, topics, pestles, sources, years] = await Promise.all([
            Insight.distinct('sector'),
            Insight.distinct('region'),
            Insight.distinct('country'),
            Insight.distinct('topic'),
            Insight.distinct('pestle'),
            Insight.distinct('source'),
            Insight.distinct('end_year')
        ]);
        
        res.json({
            sectors: sectors.filter(Boolean).sort(),
            regions: regions.filter(Boolean).sort(),
            countries: countries.filter(Boolean).sort(),
            topics: topics.filter(Boolean).sort(),
            pestles: pestles.filter(Boolean).sort(),
            sources: sources.filter(Boolean).sort(),
            years: years.filter(Boolean).sort()
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Insight.aggregate([
            {
                $group: {
                    _id: null,
                    totalRecords: { $sum: 1 },
                    avgIntensity: { $avg: '$intensity' },
                    avgLikelihood: { $avg: '$likelihood' },
                    avgRelevance: { $avg: '$relevance' },
                    maxIntensity: { $max: '$intensity' },
                    minIntensity: { $min: '$intensity' }
                }
            }
        ]);
        
        // Get top topics
        const topTopics = await Insight.aggregate([
            { $group: { _id: '$topic', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        // Get top countries
        const topCountries = await Insight.aggregate([
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        res.json({
            ...stats[0],
            topTopics,
            topCountries
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
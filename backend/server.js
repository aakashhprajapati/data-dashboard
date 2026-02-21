const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const insightRoutes = require('./routes/insights');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB Atlas Connection - YOUR CONNECTION STRING
const MONGODB_URI = 'mongodb+srv://aka:aka@cluster0.c6dcp21.mongodb.net/database?appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB Atlas');
        
        // Check if data exists, if not create sample
        const Insight = require('./models/Insight');
        const count = await Insight.countDocuments();
        
        if (count === 0) {
            console.log('📝 Creating sample data...');
            
            const sampleData = [
                { intensity: 85, sector: 'Technology', country: 'India', region: 'Asia', topic: 'AI', likelihood: 75, relevance: 90 },
                { intensity: 70, sector: 'Healthcare', country: 'USA', region: 'North America', topic: 'Vaccine', likelihood: 80, relevance: 85 },
                { intensity: 65, sector: 'Finance', country: 'UK', region: 'Europe', topic: 'Blockchain', likelihood: 60, relevance: 75 },
                { intensity: 80, sector: 'Energy', country: 'China', region: 'Asia', topic: 'Solar', likelihood: 85, relevance: 88 },
                { intensity: 60, sector: 'Education', country: 'Multiple', region: 'Global', topic: 'EdTech', likelihood: 70, relevance: 82 }
            ];
            
            await Insight.insertMany(sampleData);
            console.log(`✅ Created ${sampleData.length} sample records`);
        } else {
            console.log(`📊 Database has ${count} existing records`);
        }
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/insights', insightRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Dashboard API', 
        status: 'running',
        endpoints: ['/api/insights', '/api/insights/filters', '/api/insights/stats', '/api/insights/aggregated']
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test data endpoint
app.get('/api/test-data', async (req, res) => {
    try {
        const Insight = require('./models/Insight');
        const count = await Insight.countDocuments();
        const sample = await Insight.findOne();
        
        res.json({
            connected: true,
            totalRecords: count,
            sampleRecord: sample,
            database: 'MongoDB Atlas'
        });
    } catch (error) {
        res.json({ connected: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Test: http://localhost:${PORT}/api/test-data`);
});
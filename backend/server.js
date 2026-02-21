// ============================================
// BACKEND SERVER.JS - MONGODB ATLAS VERSION
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const insightRoutes = require('./routes/insights');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS CONFIGURATION - FIXED FOR ALL ORIGINS
// ============================================
app.use(cors({
    origin: '*',  // Allow ALL origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(helmet());

// ============================================
// MONGODB ATLAS CONNECTION - YOUR CREDENTIALS
// ============================================
const MONGODB_URI = 'mongodb+srv://aka:aka@cluster0.c6dcp21.mongodb.net/database?appName=Cluster0';

console.log('🔗 Connecting to YOUR MongoDB Atlas...');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(async () => {
    console.log('✅ Connected to YOUR MongoDB Atlas successfully!');
    
    // Check YOUR data
    const Insight = require('./models/Insight');
    const count = await Insight.countDocuments();
    console.log(`📊 YOUR database has ${count} documents`);
    
    if (count === 0) {
        console.log('⚠️ WARNING: Your database is EMPTY!');
        console.log('Please import your jsondata.json file using:');
        console.log('1. MongoDB Compass');
        console.log('2. Or run the import script');
    } else {
        // Show YOUR data preview
        const sample = await Insight.findOne();
        console.log('✅ YOUR data sample:', {
            sector: sample.sector,
            country: sample.country,
            intensity: sample.intensity,
            topic: sample.topic
        });
    }
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});

// ============================================
// ROUTES
// ============================================
app.use('/api/insights', insightRoutes);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// TEST ENDPOINT - SHOWS YOUR ACTUAL DATA
// ============================================
app.get('/api/test-data', async (req, res) => {
    try {
        const Insight = require('./models/Insight');
        const count = await Insight.countDocuments();
        const sample = await Insight.findOne().select('sector country intensity likelihood relevance');
        
        res.json({
            message: 'Using YOUR MongoDB Atlas data',
            totalRecords: count,
            sampleRecord: sample,
            databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 YOUR data: http://localhost:${PORT}/api/test-data`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const insightRoutes = require('./routes/insights');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    
    // Import data if collection is empty (run once)
    importData();
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Import JSON data function
async function importData() {
    try {
        const Insight = require('./models/Insight');
        const count = await Insight.countDocuments();
        
        if (count === 0) {
            const fs = require('fs');
            const path = require('path');
            const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'jsondata.json'), 'utf8'));
            
            // Clean and transform data
            const cleanData = data.map(item => {
                const cleaned = {};
                Object.keys(item).forEach(key => {
                    const cleanKey = key.trim().toLowerCase().replace(/ /g, '_');
                    let value = item[key];
                    
                    // Convert numeric strings to numbers
                    if (['intensity', 'likelihood', 'relevance'].includes(cleanKey) && !isNaN(value)) {
                        value = Number(value);
                    }
                    
                    // Handle empty strings
                    if (value === '' || value === 'N/A' || value === 'NA') {
                        value = null;
                    }
                    
                    cleaned[cleanKey] = value;
                });
                return cleaned;
            });
            
            await Insight.insertMany(cleanData);
            console.log('Data imported successfully');
        }
    } catch (err) {
        console.error('Error importing data:', err);
    }
}

// Routes
app.use('/api/insights', insightRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
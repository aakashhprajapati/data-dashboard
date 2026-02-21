// backend/import-data.js
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// YOUR MongoDB Atlas connection
const uri = 'mongodb+srv://aka:aka@cluster0.c6dcp21.mongodb.net/database?appName=Cluster0';

async function importData() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');
        
        const db = client.db('dashboard_db');
        const collection = db.collection('insights');
        
        // Read your JSON file
        const filePath = path.join(__dirname, 'data', 'jsondata.json');
        console.log('📁 Reading file:', filePath);
        
        if (!fs.existsSync(filePath)) {
            console.error('❌ jsondata.json not found!');
            console.log('Please place your jsondata.json in backend/data/ folder');
            return;
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let data = JSON.parse(fileContent);
        
        console.log(`📄 Found ${data.length} records in JSON file`);
        
        // Clear existing data
        await collection.deleteMany({});
        console.log('🗑️ Cleared existing data');
        
        // Insert new data
        const result = await collection.insertMany(data);
        console.log(`✅ Successfully imported ${result.insertedCount} records`);
        
        // Verify
        const count = await collection.countDocuments();
        console.log(`📊 Total records in database: ${count}`);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

importData();
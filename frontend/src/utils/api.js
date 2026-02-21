// ============================================
// API.JS - WORKING WITH YOUR MONGODB ATLAS DATA
// ============================================

const API_BASE_URL = 'https://data-dashboard-wi0w.onrender.com/api';

console.log('🔗 API URL:', API_BASE_URL);

export const insightsAPI = {
    // Get insights with filters
    getInsights: async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${API_BASE_URL}/insights${queryString ? '?' + queryString : ''}`;
            
            console.log('📡 Fetching:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Insights received:', data.insights?.length, 'records');
            return data;
            
        } catch (error) {
            console.error('❌ Error fetching insights:', error);
            throw error;
        }
    },

    // Get aggregated data for charts
    getAggregatedData: async (groupBy = 'sector') => {
        try {
            const url = `${API_BASE_URL}/insights/aggregated?groupBy=${groupBy}`;
            console.log('📊 Fetching aggregated data:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`✅ Aggregated data (${groupBy}) received:`, data.length, 'groups');
            return data;
            
        } catch (error) {
            console.error(`❌ Error fetching aggregated data for ${groupBy}:`, error);
            throw error;
        }
    },

    // Get filter options
    getFilterOptions: async () => {
        try {
            const url = `${API_BASE_URL}/insights/filters`;
            console.log('🔧 Fetching filter options:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Filter options received');
            return data;
            
        } catch (error) {
            console.error('❌ Error fetching filter options:', error);
            throw error;
        }
    },

    // Get statistics
    getStatistics: async () => {
        try {
            const url = `${API_BASE_URL}/insights/stats`;
            console.log('📈 Fetching statistics:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Statistics received');
            return data;
            
        } catch (error) {
            console.error('❌ Error fetching statistics:', error);
            throw error;
        }
    },

    // Test function to check API connection
    testConnection: async () => {
        try {
            // Test 1: Health endpoint
            const healthRes = await fetch(API_BASE_URL.replace('/api', '/health'));
            const health = await healthRes.json();
            
            // Test 2: Get some data
            const dataRes = await fetch(`${API_BASE_URL}/insights?limit=1`);
            const data = await dataRes.json();
            
            return {
                success: true,
                health: health.status,
                records: data.insights?.length || 0,
                message: '✅ Connected to MongoDB Atlas',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '❌ Connection failed'
            };
        }
    }
};

export default insightsAPI;
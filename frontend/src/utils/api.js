import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const insightsAPI = {
    // Get insights with filters
    getInsights: (params) => api.get('/insights', { params }),
    
    // Get aggregated data
    getAggregatedData: (groupBy) => api.get('/insights/aggregated', { params: { groupBy } }),
    
    // Get filter options
    getFilterOptions: () => api.get('/insights/filters'),
    
    // Get statistics
    getStatistics: () => api.get('/insights/stats')
};

export default api;
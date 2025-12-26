import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import Filters from './Filters';
import IntensityChart from './charts/IntensityChart';
import LikelihoodChart from './charts/LikelihoodChart';
import CountryChart from './charts/CountryChart';
import { insightsAPI } from '../utils/api';
import InsightsTable from './InsightsTable';
import DashboardStats from './DashboardStats';

const Dashboard = () => {
    const [filters, setFilters] = useState({});
    const [intensityData, setIntensityData] = useState([]);
    const [likelihoodData, setLikelihoodData] = useState([]);
    const [countryData, setCountryData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, [filters]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load aggregated data for different visualizations
            const [intensityRes, likelihoodRes, countryRes, statsRes] = await Promise.all([
                insightsAPI.getAggregatedData('sector'),
                insightsAPI.getAggregatedData('region'),
                insightsAPI.getAggregatedData('country'),
                insightsAPI.getStatistics()
            ]);

            setIntensityData(intensityRes.data);
            setLikelihoodData(likelihoodRes.data);
            setCountryData(countryRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography>Loading dashboard data...</Typography>
            </Box>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Data Visualization Dashboard
            </Typography>
            
            <Filters onFilterChange={handleFilterChange} />
            
            {stats && <DashboardStats stats={stats} />}
            
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Intensity by Sector
                        </Typography>
                        <IntensityChart data={intensityData} />
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Likelihood by Region
                        </Typography>
                        <LikelihoodChart data={likelihoodData} />
                    </Paper>
                </Grid>
                
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Top Countries
                        </Typography>
                        <CountryChart data={countryData} />
                    </Paper>
                </Grid>
                
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Insights Data
                        </Typography>
                        <InsightsTable filters={filters} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
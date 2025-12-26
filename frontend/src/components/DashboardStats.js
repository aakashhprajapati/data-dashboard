import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PublicIcon from '@mui/icons-material/Public';
import TimelineIcon from '@mui/icons-material/Timeline';

const DashboardStats = ({ stats }) => {
    if (!stats) return null;

    const statCards = [
        {
            title: 'Total Records',
            value: stats.totalRecords || 0,
            icon: <AssessmentIcon />,
            color: '#1976d2'
        },
        {
            title: 'Avg Intensity',
            value: stats.avgIntensity ? stats.avgIntensity.toFixed(2) : 0,
            icon: <TrendingUpIcon />,
            color: '#2e7d32'
        },
        {
            title: 'Avg Likelihood',
            value: stats.avgLikelihood ? stats.avgLikelihood.toFixed(2) : 0,
            icon: <TimelineIcon />,
            color: '#ed6c02'
        },
        {
            title: 'Avg Relevance',
            value: stats.avgRelevance ? stats.avgRelevance.toFixed(2) : 0,
            icon: <PublicIcon />,
            color: '#9c27b0'
        }
    ];

    return (
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            {statCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper elevation={2} style={{ padding: '20px', backgroundColor: card.color, color: 'white' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <div>
                                <Typography variant="h6" style={{ opacity: 0.9 }}>
                                    {card.title}
                                </Typography>
                                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                                    {card.value}
                                </Typography>
                            </div>
                            <Box style={{ fontSize: '40px', opacity: 0.8 }}>
                                {card.icon}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default DashboardStats;
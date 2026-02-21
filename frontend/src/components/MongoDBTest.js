import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Button, 
  CircularProgress, Alert, Grid, Card, CardContent 
} from '@mui/material';
import insightsAPI from '../utils/api';

const MongoDBTest = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await insightsAPI.testConnection();
      setConnectionStatus(result);
      
      if (result.success) {
        // Get some sample data
        const insights = await insightsAPI.getInsights({ limit: 3 });
        setData(insights);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const insights = await insightsAPI.getInsights({ limit: 5 });
      setData(insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography ml={2}>Connecting to MongoDB Atlas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📊 MongoDB Atlas Connection Test
      </Typography>

      <Paper sx={{ p: 3, mb: 3, bgcolor: connectionStatus.success ? '#e8f5e9' : '#ffebee' }}>
        <Typography variant="h6">
          Connection Status: {connectionStatus.success ? '✅ Connected' : '❌ Failed'}
        </Typography>
        {connectionStatus.success && (
          <>
            <Typography variant="body2">
              Health: {connectionStatus.health}
            </Typography>
            <Typography variant="body2">
              Records: {connectionStatus.records}
            </Typography>
          </>
        )}
        {connectionStatus.error && (
          <Typography variant="body2" color="error">
            Error: {connectionStatus.error}
          </Typography>
        )}
        <Button 
          variant="outlined" 
          onClick={testConnection}
          sx={{ mt: 2, mr: 2 }}
        >
          Test Again
        </Button>
        <Button 
          variant="contained" 
          onClick={fetchData}
          sx={{ mt: 2 }}
        >
          Fetch Data
        </Button>
      </Paper>

      {data && data.insights && (
        <Grid container spacing={3}>
          {data.insights.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.sector || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Country: {item.country || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Intensity: {item.intensity || 0}
                  </Typography>
                  <Typography variant="body2">
                    Likelihood: {item.likelihood || 0}
                  </Typography>
                  <Typography variant="body2">
                    Relevance: {item.relevance || 0}
                  </Typography>
                  {item.topic && (
                    <Typography variant="body2">
                      Topic: {item.topic}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" gutterBottom>
          Database Info:
        </Typography>
        <Typography variant="body2">
          MongoDB Atlas: cluster0.b5hv1py.mongodb.net
        </Typography>
        <Typography variant="body2">
          Database: dashboard
        </Typography>
        <Typography variant="body2">
          Collection: insights
        </Typography>
        <Typography variant="body2">
          Username: aka
        </Typography>
      </Paper>
    </Box>
  );
};

export default MongoDBTest;
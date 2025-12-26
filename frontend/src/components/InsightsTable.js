import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TablePagination,
    Chip, Box, Typography
} from '@mui/material';
import { insightsAPI } from '../utils/api';

const InsightsTable = ({ filters }) => {
    const [insights, setInsights] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadInsights = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                page: page + 1,
                limit: rowsPerPage
            };
            
            const response = await insightsAPI.getInsights(params);
            setInsights(response.data.insights);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error loading insights:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, page, rowsPerPage]);

    useEffect(() => {
        loadInsights();
    }, [loadInsights]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getIntensityColor = (intensity) => {
        if (intensity >= 7) return '#f44336';
        if (intensity >= 4) return '#ff9800';
        return '#4caf50';
    };

    return (
        <Paper elevation={2} style={{ marginTop: '20px' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Topic</strong></TableCell>
                            <TableCell><strong>Sector</strong></TableCell>
                            <TableCell><strong>Region</strong></TableCell>
                            <TableCell><strong>Intensity</strong></TableCell>
                            <TableCell><strong>Likelihood</strong></TableCell>
                            <TableCell><strong>Relevance</strong></TableCell>
                            <TableCell><strong>Country</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>Loading insights data...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : insights.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography>No data found with current filters</Typography>
                                </TableCell>
                            </TableRow>
                        ) : insights.map((insight, index) => (
                            <TableRow key={index} hover>
                                <TableCell style={{ maxWidth: '200px' }}>
                                    {insight.title || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={insight.topic || 'Unknown'} 
                                        size="small" 
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{insight.sector || 'N/A'}</TableCell>
                                <TableCell>{insight.region || 'N/A'}</TableCell>
                                <TableCell>
                                    <Box 
                                        style={{
                                            backgroundColor: getIntensityColor(insight.intensity || 0),
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                            minWidth: '60px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {insight.intensity || 0}
                                    </Box>
                                </TableCell>
                                <TableCell>{insight.likelihood || 0}</TableCell>
                                <TableCell>{insight.relevance || 0}</TableCell>
                                <TableCell>{insight.country || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    );
};

export default InsightsTable;
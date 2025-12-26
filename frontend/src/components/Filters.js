import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { insightsAPI } from '../utils/api';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const Filters = ({ onFilterChange }) => {
    const [filterOptions, setFilterOptions] = useState({
        sectors: [], regions: [], countries: [], topics: [], 
        pestles: [], sources: [], years: []
    });
    
    const [filters, setFilters] = useState({
        end_year: '',
        topics: [],
        sector: '',
        region: '',
        pest: '',
        source: '',
        swot: '',
        country: '',
        city: ''
    });

    useEffect(() => {
        loadFilterOptions();
    }, []);

    const loadFilterOptions = async () => {
        try {
            const response = await insightsAPI.getFilterOptions();
            const options = response.data;
            
            const formattedOptions = {
                sectors: options.sectors.map(s => ({ value: s, label: s })),
                regions: options.regions.map(r => ({ value: r, label: r })),
                countries: options.countries.map(c => ({ value: c, label: c })),
                topics: options.topics.map(t => ({ value: t, label: t })),
                pestles: options.pestles.map(p => ({ value: p, label: p })),
                sources: options.sources.map(s => ({ value: s, label: s })),
                years: options.years.map(y => ({ value: y, label: y }))
            };
            
            setFilterOptions(formattedOptions);
        } catch (error) {
            console.error('Error loading filter options:', error);
        }
    };

    const handleFilterChange = (filterName, value) => {
        const newFilters = {
            ...filters,
            [filterName]: value
        };
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        // Convert array selections to comma-separated strings
        const formattedFilters = {
            ...filters,
            topics: filters.topics.map(t => t.value).join(',')
        };
        onFilterChange(formattedFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            end_year: '', topics: [], sector: '', region: '', 
            pest: '', source: '', swot: '', country: '', city: ''
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <FilterListIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Filters</Typography>
            </Box>
            
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        End Year
                    </Typography>
                    <Select
                        options={filterOptions.years}
                        value={filterOptions.years.find(opt => opt.value === filters.end_year)}
                        onChange={(selected) => handleFilterChange('end_year', selected?.value || '')}
                        isClearable
                        placeholder="Select Year"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        Topics
                    </Typography>
                    <Select
                        options={filterOptions.topics}
                        value={filters.topics}
                        onChange={(selected) => handleFilterChange('topics', selected || [])}
                        isMulti
                        placeholder="Select Topics"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        Sector
                    </Typography>
                    <Select
                        options={filterOptions.sectors}
                        value={filterOptions.sectors.find(opt => opt.value === filters.sector)}
                        onChange={(selected) => handleFilterChange('sector', selected?.value || '')}
                        isClearable
                        placeholder="Select Sector"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        Region
                    </Typography>
                    <Select
                        options={filterOptions.regions}
                        value={filterOptions.regions.find(opt => opt.value === filters.region)}
                        onChange={(selected) => handleFilterChange('region', selected?.value || '')}
                        isClearable
                        placeholder="Select Region"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        PEST
                    </Typography>
                    <Select
                        options={filterOptions.pestles}
                        value={filterOptions.pestles.find(opt => opt.value === filters.pest)}
                        onChange={(selected) => handleFilterChange('pest', selected?.value || '')}
                        isClearable
                        placeholder="Select PEST"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        Source
                    </Typography>
                    <Select
                        options={filterOptions.sources}
                        value={filterOptions.sources.find(opt => opt.value === filters.source)}
                        onChange={(selected) => handleFilterChange('source', selected?.value || '')}
                        isClearable
                        placeholder="Select Source"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        Country
                    </Typography>
                    <Select
                        options={filterOptions.countries}
                        value={filterOptions.countries.find(opt => opt.value === filters.country)}
                        onChange={(selected) => handleFilterChange('country', selected?.value || '')}
                        isClearable
                        placeholder="Select Country"
                    />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                        City
                    </Typography>
                    <input
                        type="text"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        placeholder="Enter city"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <Box display="flex" gap={2}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="secondary"
                            onClick={handleClearFilters}
                        >
                            Clear All
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Filters;
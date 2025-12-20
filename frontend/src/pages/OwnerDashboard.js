import React, { useEffect, useState } from 'react';
import API from '../api';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function OwnerDashboard(){
  const [vehicles, setVehicles] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=> {
    API.get('/vehicles')
      .then(res => { setVehicles(res.data); setError(null); })
      .catch(err => { console.error(err); setError(err.response?.data?.message || err.message || 'Failed to load vehicles'); });
  },[]);

  const onSearch = q => {
    API.get('/vehicles/search?q=' + encodeURIComponent(q))
      .then(res => { setResults(res.data); setError(null); })
      .catch(err => { console.error(err); setError(err.response?.data?.message || err.message || 'Search failed'); });
  };

  const summaryData = [
    { name: 'in-transit', value: vehicles.filter(v=>v.status==='in-transit').length },
    { name: 'idle', value: vehicles.filter(v=>v.status==='idle').length },
    { name: 'loading', value: vehicles.filter(v=>v.status==='loading').length },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Owner Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <SearchBar onSearch={onSearch} />

      {results.length>0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Search results</Typography>
          <Grid container spacing={2}>
            {results.map(v => (
              <Grid item xs={12} sm={6} md={4} key={v._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography component={Link} to={`/vehicle/${v._id}`} sx={{ textDecoration: 'none' }} variant="subtitle1">{v.number}</Typography>
                    <Typography variant="body2" color="text.secondary">{v.currentLocation} — {v.driver?.name || 'No driver'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>All Vehicles</Typography>
      <Grid container spacing={2}>
        {vehicles.map(v => (
          <Grid item xs={12} sm={6} md={4} key={v._id}>
            <Card>
              <CardContent>
                <Typography component={Link} to={`/vehicle/${v._id}`} variant="h6" sx={{ textDecoration: 'none' }}>{v.number}</Typography>
                <Typography variant="body2" color="text.secondary">{v.model}</Typography>
                <Typography variant="body2">Loc: {v.currentLocation}</Typography>
                <Typography variant="body2">Dest: {v.destination}</Typography>
                <Box sx={{ mt:1, display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={v.driver?.name || 'Unassigned'} size="small" />
                  <Chip label={v.status} size="small" color="secondary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Today's vehicle status</Typography>
      <Box sx={{ width: '100%', height: 220, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
        <ResponsiveContainer>
          <BarChart data={summaryData}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Bar dataKey="value" fill="#0b5fff" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

    </Box>
  );
}

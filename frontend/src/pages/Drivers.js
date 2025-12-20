import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';

export default function Drivers(){
  const [q, setQ] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);

  const search = async () => {
    try{
      const res = await API.get('/drivers' + (q ? ('?q=' + encodeURIComponent(q)) : ''));
      setDrivers(res.data);
      setError(null);
    } catch (e){ console.error(e); setError(e.message || 'Failed to load drivers'); }
  };

  useEffect(()=>{ search(); },[]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Drivers</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name" size="small" sx={{ flex: 1 }} />
        <Button variant="contained" onClick={search}>Search</Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 1 }}>
        {drivers.map(d => (
          <Card key={d._id} variant="outlined">
            <CardContent>
              <Typography variant="h6" component={Link} to={`/drivers/${d._id}`} sx={{ textDecoration: 'none' }}>{d.name}</Typography>
              <Typography variant="body2" color="text.secondary">Phone: {d.phone}</Typography>
              <Typography variant="body2">Current place: {d.currentPlace || '—'}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

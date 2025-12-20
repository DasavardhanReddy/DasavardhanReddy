import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

export default function DriverDetails(){
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await API.get('/drivers/' + id);
        setDriver(res.data);
        setError(null);
      } catch (e){ console.error(e); setError(e.message || 'Failed to load driver'); }
    })();
  },[id]);

  if(!driver) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Driver: {driver.name}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography>Phone: {driver.phone}</Typography>
          <Typography>Current place: {driver.currentPlace}</Typography>
          <Typography>Assigned vehicles: {driver.assignedVehicles?.length || 0}</Typography>
          {driver.assignedVehicles && driver.assignedVehicles.length>0 && (
            <Box sx={{ mt:1 }}>
              {driver.assignedVehicles.map(v => (
                <Box key={v._id} sx={{ mb: 0.5 }}>
                  <Typography component={Link} to={`/vehicle/${v._id}`} sx={{ textDecoration: 'none' }}>&#x2022; {v.number} — {v.currentLocation} → {v.destination}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6">Travel history</Typography>
      {driver.travelHistory && driver.travelHistory.length>0 ? (
        driver.travelHistory.map((h,i) => (
          <Card key={i} variant="outlined" sx={{ mb: 1 }}>
            <CardContent>
              <Typography variant="body2">{new Date(h.timestamp || h.date || h._id).toLocaleString()} — {h.placeName}</Typography>
              <Typography variant="body2" color="text.secondary">{h.note || ''}</Typography>
            </CardContent>
          </Card>
        ))
      ) : <Typography color="text.secondary">No travel history</Typography>}

      <Box sx={{ mt:2 }}>
        <Button variant="contained" component={Link} to="/driver">Open Driver App</Button>
      </Box>
    </Box>
  );
}

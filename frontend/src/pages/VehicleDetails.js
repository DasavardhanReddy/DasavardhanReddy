import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';

export default function VehicleDetails(){
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [form, setForm] = useState({ currentLocation:'', destination:'', status:'' });
  const [error, setError] = useState(null);
  useEffect(()=> {
    API.get('/vehicles/' + id)
      .then(res => { setVehicle(res.data); setError(null); })
      .catch(err => { console.error(err); setError(err.response?.data?.message || err.message || 'Failed to load vehicle'); });
  },[id]);

  useEffect(()=> {
    if(vehicle){
      setForm({ currentLocation: vehicle.currentLocation || '', destination: vehicle.destination || '', status: vehicle.status || '' });
    }
  },[vehicle]);

  const onUpdate = async () => {
    try {
      const res = await API.put('/vehicles/' + id, form);
      setVehicle(res.data);
      setError(null);
      alert('Updated');
    } catch (e) { console.error(e); const msg = e.response?.data?.message || e.message || 'Error updating vehicle'; setError(msg); alert(msg); }
  };

  const addHistory = async () => {
    try {
      const profit = Number(prompt('profit (number)') || 0);
      const cargo = prompt('cargo description') || '';
      await API.post(`/vehicles/${id}/history`, { from: vehicle.currentLocation, to: vehicle.destination, cargo, profit });
      const res = await API.get('/vehicles/' + id);
      setVehicle(res.data);
      setError(null);
      alert('History added');
    } catch (e) { console.error(e); const msg = e.response?.data?.message || e.message || 'Failed to add history'; setError(msg); alert(msg); }
  };

  if(!vehicle) return <div>Loading...</div>;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Typography variant="h5" gutterBottom>Vehicle {vehicle.number}</Typography>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography>Model: {vehicle.model}</Typography>
          <Typography>Current: {vehicle.currentLocation}</Typography>
          <Typography>Destination: {vehicle.destination}</Typography>
          <Typography>Driver: {vehicle.driver?.name || 'Unassigned'}</Typography>
          <Typography>Status: {vehicle.status}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h6">Update vehicle</Typography>
      <Box sx={{ display: 'grid', gap: 2, maxWidth: 520, mt: 1, mb: 2 }}>
        <TextField label="Location" value={form.currentLocation} onChange={e=>setForm({...form, currentLocation: e.target.value})} size="small" />
        <TextField label="Destination" value={form.destination} onChange={e=>setForm({...form, destination: e.target.value})} size="small" />
        <TextField select label="Status" value={form.status} onChange={e=>setForm({...form, status: e.target.value})} size="small">
          <MenuItem value="">--status--</MenuItem>
          <MenuItem value="idle">idle</MenuItem>
          <MenuItem value="in-transit">in-transit</MenuItem>
          <MenuItem value="loading">loading</MenuItem>
          <MenuItem value="unloading">unloading</MenuItem>
        </TextField>
        <Button variant="contained" onClick={onUpdate}>Save</Button>
      </Box>

      <Typography variant="h6">History</Typography>
      <Button variant="outlined" onClick={addHistory} sx={{ mt: 1, mb: 2 }}>Add history (end trip)</Button>
      {vehicle.history && vehicle.history.length ? (
        <List>
          {vehicle.history.map((h,i)=>(
            <ListItem key={i} alignItems="flex-start" divider>
              <ListItemText primary={`${new Date(h.date).toLocaleString()} — ${h.from} → ${h.to}`} secondary={`cargo: ${h.cargo} • profit: ${h.profit} • notes: ${h.notes || ''}`} />
            </ListItem>
          ))}
        </List>
      ) : <Typography color="text.secondary">No history</Typography>}
    </Box>
  );
}

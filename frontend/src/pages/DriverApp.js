import React, { useState } from 'react';
import API from '../api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

export default function DriverApp(){
  const [q, setQ] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [driverId, setDriverId] = useState(''); // driver id (for demo you can create and paste id)
  const [placeQ, setPlaceQ] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const search = async () => {
    if(!q) { setError('Enter search term'); return; }
    try {
      const res = await API.get('/vehicles/search?q=' + encodeURIComponent(q));
      setVehicles(res.data);
      setError(null);
    } catch (err) { console.error(err); setError(err.message || 'Search failed'); }
  };

  const searchByPlace = async () => {
    if(!placeQ) { setError('Enter place to search'); return; }
    try {
      const res = await API.get('/drivers?place=' + encodeURIComponent(placeQ));
      setDrivers(res.data);
      setError(null);
    } catch (err) { console.error(err); setError(err.message || 'Search by place failed'); }
  };

  const submitLocation = async (driverId, data) => {
    if(!driverId) { setError('Missing driver id'); return; }
    const lat = parseFloat(data.lat);
    const lng = parseFloat(data.lng);
    if(Number.isNaN(lat) || Number.isNaN(lng)) { setError('Latitude and longitude must be valid numbers'); return; }
    try {
      await API.post('/drivers/' + driverId + '/location', { placeName: data.placeName, lat, lng, note: data.note });
      // refresh list
      await searchByPlace();
      setError(null);
      alert('Location submitted');
    } catch (err) { console.error(err); setError(err.message || 'Failed to submit location'); }
  };

  const updateTrip = async (vehicleId) => {
    try {
      const driverName = prompt('Driver name');
      const driverPhone = prompt('Driver phone');
      let did = driverId;
      if(!did){
        const drvRes = await API.post('/drivers', { name: driverName, phone: driverPhone });
        did = drvRes.data._id;
        setDriverId(did);
      }
      const destination = prompt('destination');
      await API.put('/vehicles/' + vehicleId, ... { destination, status: 'in-transit', driverId: did, currentLocation: 'Departed' });
      setError(null);
      alert('Updated vehicle trip for ' + vehicleId);
    } catch (err) { console.error(err); setError(err.message || 'Failed to update trip'); }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Driver App</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={()=>setError(null)}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField value={driverId} onChange={e=>setDriverId(e.target.value)} placeholder="Driver id (paste or create)" size="small" sx={{ width: 300 }} />
        <Button variant="outlined" onClick={async ()=>{ try { const name = prompt('Driver name'); const phone = prompt('Driver phone'); if(!name) return; const res = await API.post('/drivers', { name, phone }); setDriverId(res.data._id); setError(null); alert('Driver created'); } catch(e){ console.error(e); setError(e.message || 'Failed to create driver'); } }}>Create driver</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField value={q} onChange={e=>setQ(e.target.value)} placeholder="vehicle number or driver name" size="small" sx={{flex:2}} />
        <Button variant="contained" onClick={search}>Search</Button>
        <TextField value={placeQ} onChange={e=>setPlaceQ(e.target.value)} placeholder="search by place (e.g. Depot A)" size="small" sx={{ml:2}} />
        <Button variant="outlined" onClick={searchByPlace}>Search Place</Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {vehicles.map(v=> (
          <Card key={v._id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1"><strong>{v.number}</strong> — {v.currentLocation} → {v.destination}</Typography>
              <Typography variant="body2" color="text.secondary">Driver: {v.driver?.name || 'Unassigned'}</Typography>
              <Box sx={{ mt:1 }}>
                <Button size="small" variant="contained" onClick={()=>updateTrip(v._id)}>Update trip / Assign</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Place search results */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Drivers at place</Typography>
        {drivers.length===0 && <Typography variant="body2" color="text.secondary">No drivers found (search by place above).</Typography>}
        {drivers.map(d => (
          <Card key={d._id} variant="outlined" sx={{ mt:1 }}>
            <CardContent>
              <Typography variant="subtitle1"><strong>{d.name}</strong> — {d.phone}</Typography>
              <Typography variant="body2">Current place: {d.currentPlace || '—'}</Typography>
              <Typography variant="body2">Live coords: {d.currentLocation?.coordinates ? d.currentLocation.coordinates.join(', ') : '—'}</Typography>
              <Box sx={{ mt:1 }}>
                <Typography variant="subtitle2">Travel history</Typography>
                { (d.travelHistory || []).map((h,i) => (
                  <Typography key={i} variant="body2" color="text.secondary">{new Date(h.timestamp).toLocaleString()} — {h.placeName} {h.note ? `(${h.note})` : ''}</Typography>
                )) }
              </Box>

              <Box sx={{ mt:2 }}>
                <Typography variant="subtitle2">Add location (Google-form style)</Typography>
                <Box component="form" onSubmit={e=>{ e.preventDefault();
                  const fd = new FormData(e.target);
                  submitLocation(d._id, { placeName: fd.get('place'), lat: fd.get('lat'), lng: fd.get('lng'), note: fd.get('note') });
                }} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap:1, mt:1 }}>
                  <TextField name="place" label="Place name" size="small" required />
                  <TextField name="lat" label="Latitude" size="small" required />
                  <TextField name="lng" label="Longitude" size="small" required />
                  <TextField name="note" label="Note" size="small" />
                  <Button type="submit" variant="contained" sx={{ gridColumn: '1 / -1', mt:1 }}>Submit Location</Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
        Tip: Create a driver using the button above or the Add Driver page, then use it to assign trips or submit locations.
      </Typography>
    </Box>
  );
}

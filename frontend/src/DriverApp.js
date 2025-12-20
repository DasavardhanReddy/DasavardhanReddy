import React, { useState } from 'react';
import API from '../api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function DriverApp(){
  const [q, setQ] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [driverId, setDriverId] = useState(''); // driver id (for demo you can create and paste id)
  const [placeQ, setPlaceQ] = useState('');
  const [drivers, setDrivers] = useState([]);
  const search = async () => {
    if(!q) return alert('enter search');
    const res = await API.get('/vehicles/search?q=' + encodeURIComponent(q));
    setVehicles(res.data);
  };

  const searchByPlace = async () => {
    if(!placeQ) return alert('enter place to search');
    const res = await API.get('/drivers?place=' + encodeURIComponent(placeQ));
    setDrivers(res.data);
  };

  const submitLocation = async (driverId, data) => {
    try {
      await API.post('/drivers/' + driverId + '/location', data);
      // refresh list
      searchByPlace();
      alert('Location submitted');
    } catch (err) { console.error(err); alert('Failed to submit'); }
  };

  const updateTrip = async (vehicleId) => {
    const driverName = prompt('Driver name');
    const driverPhone = prompt('Driver phone');
    let did = driverId;
    if(!did){
      const drvRes = await API.post('/drivers', { name: driverName, phone: driverPhone });
      did = drvRes.data._id;
      setDriverId(did);
    }
    const destination = prompt('destination');
    try {
      await API.put('/vehicles/' + vehicleId, { destination, status: 'in-transit', driverId: did, currentLocation: 'Departed' });
      alert('Updated vehicle trip for ' + vehicleId);
    } catch (err) { console.error(err); }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Driver App</Typography>
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
        Tip: Create a driver on Add Driver page and paste that driver id into this app field (for demo).
      </Typography>
    </Box>
  );
}

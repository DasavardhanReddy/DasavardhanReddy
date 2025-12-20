import React, { useState } from 'react';
import API from '../api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

export default function AddDriver(){
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [created, setCreated] = useState(null);

  const submit = async () => {
    try {
      const res = await API.post('/drivers', { name, phone });
      setCreated(res.data);
      setName(''); setPhone('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Add Driver</Typography>
      <Box component="form" sx={{ display: 'grid', gap: 2, maxWidth: 480 }} onSubmit={(e)=>{ e.preventDefault(); submit(); }}>
        <TextField label="Name" value={name} onChange={e=>setName(e.target.value)} size="small" />
        <TextField label="Phone" value={phone} onChange={e=>setPhone(e.target.value)} size="small" />
        <Button variant="contained" onClick={submit}>Create</Button>
      </Box>

      {created && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Created driver: <strong>{created.name}</strong> — ID: {created._id}
        </Alert>
      )}
    </Box>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import API from '../api';

export default function ChatPanel({ onClose }){
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');
  const refList = useRef();

  const fetchMessages = async () => {
    try {
      setFetchLoading(true);
      const res = await API.get('/messages');
      setMessages(res.data);
      setError(null);
    } catch (e) {
      console.error('Failed to load messages', e);
      setError(e.message || 'Failed to load messages');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(()=>{
    fetchMessages();
    const t = setInterval(fetchMessages, 3000);
    return ()=> clearInterval(t);
  },[]);

  useEffect(()=>{
    // scroll to bottom when messages update
    if(refList.current) refList.current.scrollTop = refList.current.scrollHeight;
  },[messages]);

  // client-side filters and simple analytics
  const filteredMessages = messages.filter(m => (filterRole ? m.senderRole === filterRole : true) && (filterVehicle ? String(m.vehicle) === filterVehicle : true));
  const countsBySender = messages.reduce((acc,m)=> { acc[m.senderName] = (acc[m.senderName]||0) + 1; return acc; }, {});
  const countsByVehicle = messages.reduce((acc,m)=> { const v = m.vehicle || 'unassigned'; acc[v] = (acc[v]||0) + 1; return acc; }, {});
  const vehicleOptions = Array.from(new Set(messages.map(m=>m.vehicle).filter(Boolean))).map(String);

  const send = async () => {
    if(!text.trim()) return;
    setLoading(true);
    try {
      await API.post('/messages', { senderName: 'Owner', senderRole: 'owner', text });
      setText('');
      await fetchMessages();
      setError(null);
    } catch (e) { console.error(e); setError(e.message || 'Failed to send message'); }
    setLoading(false);
  };

  return (
    <Box sx={{ width: 360, bgcolor: 'background.paper', borderLeft: 1, borderColor: 'divider', height: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
        <Typography variant="subtitle1">Messages</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {fetchLoading ? <CircularProgress size={18} /> : <Typography variant="body2" color="text.secondary">{messages.length} msgs</Typography>}
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small"/></IconButton>
        </Box>
      </Box>

      <Divider />

      {error && <Alert severity="error" onClose={()=>setError(null)} sx={{ mx: 1, mt: 1 }}>{error}</Alert>}

      <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel>Role</InputLabel>
          <Select value={filterRole} label="Role" onChange={e=>setFilterRole(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="driver">Driver</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Vehicle</InputLabel>
          <Select value={filterVehicle} label="Vehicle" onChange={e=>setFilterVehicle(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {vehicleOptions.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ px: 1 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
          {Object.entries(countsBySender).slice(0,6).map(([k,v]) => (
            <Chip key={k} label={`${k} (${v})`} size="small" />
          ))}
          {Object.entries(countsByVehicle).slice(0,6).map(([k,v]) => (
            <Chip key={k} label={`${k === 'unassigned' ? 'No vehicle' : k} (${v})`} size="small" variant="outlined" />
          ))}
        </Stack>
      </Box>

      <Box sx={{ p: 1, flex: 1, overflow: 'auto' }} ref={refList}>
        <List sx={{ pr: 1 }}>
          {filteredMessages.length === 0 && <Typography variant="body2" color="text.secondary">No messages</Typography>}
          {filteredMessages.map(m => (
            <ListItem key={m._id} alignItems="flex-start">
              <ListItemText primary={`${m.senderName} • ${new Date(m.createdAt).toLocaleString()}`} secondary={<>
                <Typography component="span" variant="body2" color="text.primary">{m.text}</Typography>
                <br />
                <Typography component="span" variant="caption" color="text.secondary">Vehicle: {m.vehicle || '—'}</Typography>
              </>} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
        <TextField fullWidth placeholder="Write a message" value={text} onChange={e=>setText(e.target.value)} size="small" multiline maxRows={4} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button variant="contained" size="small" onClick={send} disabled={loading}>Send</Button>
          <Button variant="outlined" size="small" onClick={fetchMessages} disabled={fetchLoading}>Refresh</Button>
        </Box>
      </Box>
    </Box>
  );
}

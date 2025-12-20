import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function Sidebar(){
  return (
    <Box sx={{ width: 240, bgcolor: 'background.paper', height: '100vh', borderRight: 1, borderColor: 'divider', position: 'sticky', top: 0 }}>
      <Box sx={{ p: 2, pb: 0 }}>
        <img src="/logo192.png" alt="logo" style={{ width: 40, height: 40 }} />
      </Box>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton href="/">
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton href="/vehicle">
            <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
            <ListItemText primary="Vehicles" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton href="/driver">
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Drivers" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton href="/chat">
            <ListItemIcon><ChatIcon /></ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton href="/add-driver">
            <ListItemIcon><InventoryIcon /></ListItemIcon>
            <ListItemText primary="Add Driver" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

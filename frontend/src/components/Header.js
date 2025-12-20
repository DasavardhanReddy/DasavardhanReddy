import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

export default function Header(){
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1} color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DVR export
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">Owner</Button>
          <Button color="inherit" component={RouterLink} to="/driver">Driver</Button>
          <Button color="inherit" component={RouterLink} to="/drivers">Drivers</Button>
          <Button color="inherit" component={RouterLink} to="/add-driver">Add Driver</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

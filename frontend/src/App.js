import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import OwnerDashboard from './pages/OwnerDashboard';
import VehicleDetails from './pages/VehicleDetails';
import DriverApp from './pages/DriverApp';
import Drivers from './pages/Drivers';
import DriverDetails from './pages/DriverDetails';
import AddDriver from './pages/AddDriver';
import theme from './theme';
import Header from './components/Header';
import Footer from './components/Footer';

function App(){
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box className="app-bg" sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        <Sidebar />
        <Container sx={{ py: 4, flex: 1, maxWidth: 'xl' }}>
          <Routes>
            <Route path="/" element={<OwnerDashboard/>}/>
            <Route path="/vehicle/:id" element={<VehicleDetails/>}/>
            <Route path="/drivers" element={<Drivers/>}/>
            <Route path="/drivers/:id" element={<DriverDetails/>}/>
            <Route path="/driver" element={<DriverApp/>}/>
            <Route path="/add-driver" element={<AddDriver/>}/>
          </Routes>
        </Container>
        <ChatPanel />
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default App;



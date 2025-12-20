import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b5fff',
      contrastText: '#fff'
    },
    secondary: {
      main: '#ff6b6b'
    },
    info: { main: '#36a3f7' },
    success: { main: '#28a745' },
    error: { main: '#e55353' },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff'
    },
    text: {
      primary: '#1f2d3d',
      secondary: '#5f6f7a'
    }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true }
    },
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background: linear-gradient(135deg, #f0f6ff 0%, #f9fbff 100%);
          background-attachment: fixed;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.85)',
          boxShadow: '0 8px 20px rgba(23,43,77,0.06)',
          border: '1px solid rgba(15,23,42,0.04)'
        }
      }
    }
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

export default theme;

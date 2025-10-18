import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2BC4B8', // Turquoise color for accents and nav bar
      light: '#7EE8E0',
      dark: '#2BC4B8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9bbdba', // Turquoise color for secondary elements
      light: '#c3e3e0',
      dark: '#6f8c8a',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // White background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#000000',
    },
    h2: {
      fontWeight: 700,
      color: '#000000',
    },
    h3: {
      fontWeight: 700,
      color: '#000000',
    },
    h4: {
      fontWeight: 700,
      color: '#000000',
    },
    h5: {
      fontWeight: 700,
      color: '#000000',
    },
    h6: {
      fontWeight: 700,
      color: '#000000',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#40E0D0',
          '&:hover': {
            backgroundColor: '#2BC4B8',
          },
        },
        outlined: {
          borderColor: '#40E0D0',
          color: '#40E0D0',
          '&:hover': {
            borderColor: '#2BC4B8',
            backgroundColor: 'rgba(64, 224, 208, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#40E0D0',
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default theme; 
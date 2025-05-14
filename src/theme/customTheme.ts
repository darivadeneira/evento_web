import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#243447',     // Azul oscuro definido
      light: '#4c5c71',    // Versión más clara del azul
      dark: '#111e2e',     // Versión más oscura del azul
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F9A826',     // Naranja/ámbar (complementario al azul)
      light: '#FFD280',    // Naranja claro
      dark: '#C77800',     // Naranja oscuro
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa',  // Gris muy claro con tono azulado
      paper: '#ffffff',    // Blanco para tarjetas y elementos de papel
    },
    text: {
      primary: '#2D3748',  // Gris oscuro para texto principal
      secondary: '#718096', // Gris medio para texto secundario
    },
    error: {
      main: '#E53E3E',     // Rojo para errores
    },
    warning: {
      main: '#DD6B20',     // Naranja para advertencias
    },
    info: {
      main: '#3182CE',     // Azul claro para información
    },
    success: {
      main: '#38A169',     // Verde para éxito
    },
    divider: 'rgba(36, 52, 71, 0.12)', // Divisores con transparencia del color principal
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
    },
    h1: {
      color: '#243447',
    },
    h2: {
      color: '#243447',
    },
    h3: {
      color: '#243447',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          padding: '5px 16px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 4,
        },
        containedPrimary: {
          boxShadow: '0 2px 4px rgba(36, 52, 71, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(36, 52, 71, 0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: 'rgba(36, 52, 71, 0.05)',
          fontWeight: 600,
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
  
});
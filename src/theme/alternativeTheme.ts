import { createTheme } from '@mui/material/styles';

export const alternativeTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1C1C1C',     // Negro cine clásico
      light: '#3A3A3A',    // Versión más clara del negro
      dark: '#0A0A0A',     // Versión más oscura del negro
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF4C29',     // Rojo anaranjado
      light: '#FF7A5C',    // Versión más clara del rojo anaranjado
      dark: '#CC3D21',     // Versión más oscura del rojo anaranjado
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F5F5',  // Gris claro especificado
      paper: '#ffffff',    // Blanco para elementos de papel
    },
    text: {
      primary: '#1C1C1C',  // Negro cine clásico para texto principal
      secondary: '#666666', // Gris medio para texto secundario
    },
    error: {
      main: '#E53E3E',     // Rojo para errores
    },
    warning: {
      main: '#FFD93D',     // Amarillo iluminación (color de acento)
    },
    info: {
      main: '#FF4C29',     // Rojo anaranjado para información
    },
    success: {
      main: '#38A169',     // Verde para éxito
    },
    divider: 'rgba(28, 28, 28, 0.12)', // Divisores con transparencia del color principal
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
      color: '#1C1C1C',
    },
    h2: {
      color: '#1C1C1C',
    },
    h3: {
      color: '#1C1C1C',
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
          boxShadow: '0 2px 4px rgba(28, 28, 28, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(28, 28, 28, 0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: 'rgba(28, 28, 28, 0.05)',
          fontWeight: 600,
        },
      },
    },
  },
  shape: {
    borderRadius: 4,
  },
}); 
// theme.ts
import { createTheme } from '@mui/material/styles';

// Extender la interfaz del tema para incluir colores personalizados
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      greenBorder: string;
      greenGlow: string;
      greenGradient: {
        start: string;
        end: string;
      };
    };
  }
  
  interface ThemeOptions {
    custom?: {
      greenBorder?: string;
      greenGlow?: string;
      greenGradient?: {
        start?: string;
        end?: string;
      };
    };
  }
}

export const darkNeonTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4AFF75', // Verde brillante como el botón "Get Started"
      light: '#7FFF9C', // Verde más claro para hover
      dark: '#1E5631', // Verde oscuro para contraste
      contrastText: '#000000', // Texto negro sobre verde
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    background: {
      default: '#000000', // Negro puro para el fondo principal
      paper: '#0A0A0A', // Negro muy oscuro para tarjetas
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
    },
    error: {
      main: '#FF5252',
    },
    success: {
      main: '#4AFF75',
    },
    warning: {
      main: '#FFC107',
    },    info: {
      main: '#7FFF9C',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  // Extender la paleta con colores personalizados
  custom: {
    greenBorder: 'rgba(74, 255, 117, 0.6)', // Verde del borde con opacidad
    greenGlow: 'rgba(74, 255, 117, 0.3)', // Verde para efectos de glow
    greenGradient: {
      start: 'rgba(74, 255, 117, 0.3)',
      end: 'rgba(0, 230, 118, 0.3)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h1: { 
      fontWeight: 700,
      color: '#FFFFFF',
    },
    h2: { 
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h3: { 
      fontWeight: 600,
      color: '#FFFFFF',
    },
    button: { 
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          textTransform: 'none',
          padding: '8px 24px',
        },
        containedPrimary: {
          backgroundColor: '#4AFF75',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#7FFF9C',
          },
        },
        outlined: {
          borderColor: '#4AFF75',
          color: '#4AFF75',
          '&:hover': {
            borderColor: '#7FFF9C',
            color: '#7FFF9C',
            backgroundColor: 'rgba(74, 255, 117, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A0A',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          color: '#FFFFFF',
        },
      },
    },
  },
});

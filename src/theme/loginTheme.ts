import { createTheme } from '@mui/material/styles';

export const createLoginTheme = (backgroundUrl: string) =>
  createTheme({
    palette: {
      primary: { main: '#243447' }, // Color principal (botones, enlaces activos)
      secondary: { main: '#7FA8FF' }, // Color secundario (bordes, enlaces)
      warning: { main: '#FFD43B' }, // Color de advertencia
      background: { default: '#f5f5f5' }, // Fondo predeterminado
      text: {
        primary: '#243447', // Texto principal
        secondary: '#7FA8FF', // Texto secundario
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
        color: '#243447',
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 600,
        color: '#243447',
      },
      body1: {
        fontSize: '1rem',
        color: '#243447',
      },
      body2: {
        fontSize: '0.875rem',
        color: '#7FA8FF',
      },
      button: {
        textTransform: 'none',
        fontWeight: 'bold',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '100vh',
            margin: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Roboto, sans-serif',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: 'white',
            fontWeight: 'bold',
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-input': {
              color: '#243447', // Color del texto del input
            },
            '& .MuiInputLabel-root': {
              color: '#7FA8FF', // Color del label
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#7FA8FF', // Color del borde
              },
              '&:hover fieldset': {
                borderColor: '#243447', // Color del borde al pasar el mouse
              },
              '&.Mui-focused fieldset': {
                borderColor: '#243447', // Color del borde cuando está enfocado
              },
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: '#7FA8FF', // Color de los enlaces
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
    },
  });
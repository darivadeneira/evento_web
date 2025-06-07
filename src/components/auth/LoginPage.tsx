import { useState } from 'react';
import { useLogin, useNotify, Form, TextInput, PasswordInput, Button, Title } from 'react-admin';
import { Box, Card, CircularProgress, CssBaseline, Typography, InputAdornment, IconButton } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import HelpIcon from '@mui/icons-material/Help';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import type { FieldValues } from 'react-hook-form';
import { darkNeonTheme } from '../../theme/darkNeonTheme';

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useLogin();
  const notify = useNotify();

  // Validaciones personalizadas en español
  const validateRequired = (message: string) => (value: any) => {
    return !value || (typeof value === 'string' && value.trim() === '') ? message : undefined;
  };

  const handleSubmit = (formValues: FieldValues) => {
    setLoading(true);
    login({
      username: formValues.username as string,
      password: formValues.password as string,
    })
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        // Captura el mensaje real del backend si existe
        let message = 'Credenciales inválidas';
        if (error && (error.message || error.body?.message)) {
          message = error.body?.message || error.message;
        }
        notify(message, { type: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ThemeProvider theme={darkNeonTheme}>
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: '100vh',
          background: '#000000',
          py: 4,
        }}
      >
        <Title title="Iniciar Sesión" />
        <Card
          sx={{
            minWidth: 350,
            maxWidth: 450,
            width: { xs: '90vw', sm: 400 },
            p: 4,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(74, 255, 117, 0.2)',
            background: '#0A0A0A',
            border: '1px solid rgba(74, 255, 117, 0.3)',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <img
              src="/Images/Logo.png"
              alt="Ticket Logo"
              style={{
                width: 180,
                height: 120,
                filter: 'drop-shadow(0 0 10px #4AFF75)',
                marginBottom: '16px',
              }}
            />

            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{ color: '#FFFFFF', textAlign: 'center' }}
            >
              Iniciar Sesión
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#E0E0E0', mt: 1, textAlign: 'center' }}
            >
              Accede a tu cuenta para gestionar tus eventos
            </Typography>
          </Box>

          <Form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextInput
                source="username"
                label="Usuario"
                fullWidth
                disabled={loading}
                autoFocus
                validate={validateRequired('El usuario es requerido')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#4AFF75' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(74, 255, 117, 0.05)',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#FF5252',
                    fontWeight: 500,
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#FF5252',
                  },
                  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FF5252',
                  },
                }}
              />

              <PasswordInput
                source="password"
                label="Contraseña"
                fullWidth
                disabled={loading}
                validate={validateRequired('La contraseña es requerida')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#4AFF75' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#E0E0E0' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                type={showPassword ? 'text' : 'password'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(74, 255, 117, 0.05)',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#FF5252',
                    fontWeight: 500,
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#FF5252',
                  },
                  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FF5252',
                  },
                }}
              />

              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.5,
                  mt: 2,
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: '#4AFF75',
                  color: '#000000',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#7FFF9C',
                  },
                  '&:disabled': {
                    backgroundColor: '#333333',
                    color: '#666666',
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={18}
                      thickness={2}
                      sx={{ mr: 1, color: '#000000' }}
                    />
                    Iniciando...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </Box>
          </Form>

          {/* Links */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <RouterLink
              to="/auth/signup"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#4AFF75',
                fontWeight: 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
                e.currentTarget.style.color = '#7FFF9C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
                e.currentTarget.style.color = '#4AFF75';
              }}
            >
              <AddCircleOutlineIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
              Crear cuenta
            </RouterLink>

            <RouterLink
              to="/auth/help"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#4AFF75',
                fontWeight: 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
                e.currentTarget.style.color = '#7FFF9C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
                e.currentTarget.style.color = '#4AFF75';
              }}
            >
              <HelpIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
              Ayuda
            </RouterLink>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: '#666666' }}
            >
              ¿Problemas para acceder?{' '}
              <RouterLink
                to="/auth/forgot-password"
                style={{
                  color: '#4AFF75',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Recuperar contraseña
              </RouterLink>
            </Typography>
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

import { useState } from 'react';
import {
  useNotify,
  Form,
  TextInput,
  PasswordInput,
  required,
  Button,
  Title,
  NumberInput,
  ResourceContextProvider,
  BooleanInput,
  useAuthProvider,
} from 'react-admin';
import { Box, Card, CircularProgress, CssBaseline, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { createLoginTheme } from '../theme/loginTheme';
import { authProvider } from '../providers/auth.provider';

export const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const loginTheme = createLoginTheme('/mapa1.jpg');
  const handleSubmit = async (formValues: any) => {
    setLoading(true);
    const values = {
      ...formValues,
      rol: formValues.rol ? 'organizador' : 'user',
    };
    const response = await authProvider.signup(values);
    if (response && response.status === 201) {
      notify(response.message || 'Cuenta creada con éxito', { type: 'info' });
      window.location.href = '/login';
    } else {
      notify(response.message || 'No se pudo crear la cuenta. Intenta de nuevo.', { type: 'error' });
    }
    setLoading(false);
  };
  return (
    <ResourceContextProvider value="signup">
      <ThemeProvider theme={loginTheme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          minHeight="100vh"
          alignItems="center"
          justifyContent="center"
          width={'100%'}
        >
          {' '}
          <Title title="Crear cuenta" />
          <Card
            sx={{
              minWidth: 300,
              maxWidth: 600,
              width: '100%',
              padding: '2em',
              backgroundColor: 'white',
              boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
              borderRadius: '8px',
              alignItems: 'center',
              mx: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1em',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1em',
                }}
              ></Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
              >
                Crear Cuenta
              </Typography>
            </Box>
            <Form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <Box sx={{ flex: 1 }}>
                    <TextInput
                      source="name"
                      label="Nombre"
                      fullWidth
                      disabled={loading}
                      autoFocus
                      validate={required()}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextInput
                      source="lastname"
                      label="Apellido"
                      fullWidth
                      disabled={loading}
                      validate={required()}
                    />
                  </Box>
                </Box>

                <TextInput
                  source="username"
                  label="Usuario"
                  fullWidth
                  disabled={loading}
                  validate={required()}
                />

                <PasswordInput
                  source="password"
                  label="Contraseña"
                  fullWidth
                  disabled={loading}
                  validate={required()}
                />

                <TextInput
                  source="email"
                  label="Email"
                  fullWidth
                  disabled={loading}
                  validate={required()}
                />

                <TextInput
                  source="phone"
                  label="Celular"
                  fullWidth
                  disabled={loading}
                  validate={required()}
                />

                <BooleanInput
                  source="rol"
                  label="¿Eres organizador de eventos?"
                  disabled={loading}
                />
              </Box>
              <Box sx={{ padding: '1em 0 0 0' }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  fullWidth
                  color="primary"
                >
                  {' '}
                  {loading ? (
                    <CircularProgress
                      size={18}
                      thickness={2}
                    />
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </Box>
            </Form>
          </Card>
        </Box>
      </ThemeProvider>
    </ResourceContextProvider>
  );
};

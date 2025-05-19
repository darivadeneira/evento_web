import { useState, useEffect } from 'react';
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
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { createLoginTheme } from '../../theme/loginTheme';
import { authProvider } from '../../providers/auth.provider';

export const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<any>({});
  const notify = useNotify();

  const loginTheme = createLoginTheme('/mapa1.jpg');

  const validateForm = (values: any) => {
    const errors: string[] = [];
    if (!values.name || values.name.length < 2 || values.name.length > 30 || !/^[a-zA-Z]+$/.test(values.name)) {
      errors.push('El nombre debe tener entre 2 y 30 caracteres');
    }
    if (
      !values.lastname ||
      values.lastname.length < 2 ||
      values.lastname.length > 30 ||
      !/^[a-zA-Z]+$/.test(values.lastname)
    ) {
      errors.push('El apellido debe tener entre 2 y 30 caracteres');
    }
    if (!values.username || values.username.length < 2 || values.username.length > 30) {
      errors.push('El nombre de usuario debe tener entre 2 y 30 caracteres');
    }
    if (
      !values.email ||
      !/^[^@\s]+@[^@\s]+\.(com|net)$/i.test(values.email)
    ) {
      errors.push('Formato de correo electrónico inválido (solo .com o .net)');
    }
    if (!values.password || values.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    if (!values.phone || values.phone.length !== 10 || !/^\d+$/.test(values.phone)) {
      errors.push('El número telefónico debe tener 10 caracteres');
    }
    return errors;
  };

  // Función para mapear errores generales a campos
  const mapGeneralErrorsToFields = (errors: string[]): Record<string, string> => {
    const fieldMap: Record<string, string> = {};
    errors.forEach((err) => {
      if (err.toLowerCase().includes('nombre de usuario')) fieldMap.username = err;
      else if (err.toLowerCase().includes('nombre')) fieldMap.name = err;
      else if (err.toLowerCase().includes('apellido')) fieldMap.lastname = err;
      else if (err.toLowerCase().includes('correo') || err.toLowerCase().includes('email')) fieldMap.email = err;
      else if (err.toLowerCase().includes('contraseña')) fieldMap.password = err;
      else if (err.toLowerCase().includes('tel')) fieldMap.phone = err;
    });
    return fieldMap;
  };

  // Limpiar errores de campo cuando el usuario corrige los datos
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      const errors = validateForm(formValues);
      setFieldErrors(mapGeneralErrorsToFields(errors));
    }
    // eslint-disable-next-line
  }, [formValues]);

  const handleSubmit = async (formValues: any) => {
    setLoading(true);
    setFieldErrors({});
    setGeneralErrors([]);
    setFormValues(formValues); // Actualiza el estado para el efecto
    const values = {
      ...formValues,
      rol: formValues.rol ? 'organizer' : 'user',
    };
    // Validación frontend
    const frontendErrors = validateForm(values);
    if (frontendErrors.length > 0) {
      const mapped = mapGeneralErrorsToFields(frontendErrors);
      setFieldErrors(mapped);
      notify('Corrige los errores del formulario.', { type: 'warning' });
      setLoading(false);
      return;
    }

    const response = await authProvider.signup(values);
    if (response && response.status === 201) {
      notify(response.message || 'Cuenta creada con éxito', { type: 'info' });
      window.location.href = '/login';
    } else if (response && response.status !== 201) {
      console.log('Error al crear la cuenta:', response.message);
      notify(response.message || 'Error al crear la cuenta', { type: 'error' });
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
          alignItems="center"
          justifyContent="center"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            minHeight: '100vh',
            minWidth: '100vw',
            zIndex: 0,
            overflow: 'auto', // Permite scroll solo si es necesario
            m: 0,
            p: 0,
            background: 'url("/Images/Background.jpg") center/cover no-repeat',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(34,40,49,0.55)',
              backdropFilter: 'blur(8px)',
              zIndex: 1,
            },
          }}
        >
          <Title title="Crear cuenta" />
          <Card
            sx={{
              minWidth: 300,
              maxWidth: 450,
              width: { xs: '95vw', sm: 400, md: 450 },
              p: 2,
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              background: 'rgba(255,255,255,0.85)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid',
              borderColor: '#7FA8FF',
              mx: 'auto',
              my: 4,
              maxHeight: '95vh',
              overflowY: 'none',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2, width: '100%' }}>
              <Button
                sx={{ minWidth: 0, p: 0, mr: 1, background: 'none', boxShadow: 'none' }}
                onClick={() => (window.location.href = '/login')}
              >
                <ArrowBackSharpIcon sx={{ color: '#7FA8FF', fontSize: 32 }} />
              </Button>
              <Typography variant="h5" component="h1" fontWeight="bold" color="primary" sx={{ flex: 1, textAlign: 'center' }}>
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
                      helperText={fieldErrors.name}
                      error={!!fieldErrors.name}
                      sx={
                        fieldErrors.name
                          ? {
                              '& .RaLabeled-label': { color: 'error.main' },
                              '& .MuiFormHelperText-root': { color: 'error.main' },
                            }
                          : {}
                      }
                      onChange={(e) => setFormValues((prev: any) => ({ ...prev, name: e.target.value }))}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextInput
                      source="lastname"
                      label="Apellido"
                      fullWidth
                      disabled={loading}
                      validate={required()}
                      helperText={fieldErrors.lastname}
                      error={!!fieldErrors.lastname}
                      sx={
                        fieldErrors.lastname
                          ? {
                              '& .RaLabeled-label': { color: 'error.main' },
                              '& .MuiFormHelperText-root': { color: 'error.main' },
                            }
                          : {}
                      }
                      onChange={(e) => setFormValues((prev: any) => ({ ...prev, lastname: e.target.value }))}
                    />
                  </Box>
                </Box>

                <TextInput
                  source="username"
                  label="Usuario"
                  fullWidth
                  disabled={loading}
                  validate={required()}
                  helperText={fieldErrors.username}
                  error={!!fieldErrors.username}
                  sx={
                    fieldErrors.username
                      ? {
                          '& .RaLabeled-label': { color: 'error.main' },
                          '& .MuiFormHelperText-root': { color: 'error.main' },
                        }
                      : {}
                  }
                  onChange={(e) => setFormValues((prev: any) => ({ ...prev, username: e.target.value }))}
                />

                <PasswordInput
                  source="password"
                  label="Contraseña"
                  fullWidth
                  disabled={loading}
                  validate={required()}
                  helperText={fieldErrors.password}
                  error={!!fieldErrors.password}
                  sx={
                    fieldErrors.password
                      ? {
                          '& .RaLabeled-label': { color: 'error.main' },
                          '& .MuiFormHelperText-root': { color: 'error.main' },
                        }
                      : {}
                  }
                  onChange={(e) => setFormValues((prev: any) => ({ ...prev, password: e.target.value }))}
                />

                <TextInput
                  source="email"
                  label="Email"
                  fullWidth
                  disabled={loading}
                  validate={required()}
                  helperText={fieldErrors.email}
                  error={!!fieldErrors.email}
                  sx={
                    fieldErrors.email
                      ? {
                          '& .RaLabeled-label': { color: 'error.main' },
                          '& .MuiFormHelperText-root': { color: 'error.main' },
                        }
                      : {}
                  }
                  onChange={(e) => setFormValues((prev: any) => ({ ...prev, email: e.target.value }))}
                />

                <TextInput
                  source="phone"
                  label="Celular"
                  fullWidth
                  disabled={loading}
                  validate={required()}
                  helperText={fieldErrors.phone}
                  error={!!fieldErrors.phone}
                  sx={
                    fieldErrors.phone
                      ? {
                          '& .RaLabeled-label': { color: 'error.main' },
                          '& .MuiFormHelperText-root': { color: 'error.main' },
                        }
                      : {}
                  }
                  onChange={(e) => setFormValues((prev: any) => ({ ...prev, phone: e.target.value }))}
                />

                <BooleanInput
                  source="rol"
                  label="¿Eres organizador de eventos?"
                  disabled={loading}
                  helperText={fieldErrors.rol}
                  sx={
                    fieldErrors.rol
                      ? {
                          '& .RaLabeled-label': { color: 'error.main' },
                          '& .MuiFormHelperText-root': { color: 'error.main' },
                        }
                      : {}
                  }
                  onChange={(e) => setFormValues((prev: any) => ({ ...prev, rol: e.target.checked }))}
                />
              </Box>
              <Box sx={{ padding: '1em 0 0 0' }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  fullWidth
                  color="primary"
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    borderRadius: 3,
                    minHeight: 48,
                    boxShadow: '0 2px 8px rgba(31, 38, 135, 0.15)',
                    transition: 'background 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#7FA8FF', // color igual en mobile y pc
                    '&:hover': {
                      backgroundColor: '#5A7FFF',
                    },
                    mx: { xs: 'auto', sm: 0 }, // centrado en mobile
                    width: { xs: '80%', sm: '100%' },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={18} thickness={2} sx={{ mr: 1 }} />
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

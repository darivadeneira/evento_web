import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useNotify,
  Form,
  TextInput,
  PasswordInput,
  Button,
  Title,
  ResourceContextProvider,
  BooleanInput,
} from 'react-admin';
import {
  Box,
  Card,
  CircularProgress,
  CssBaseline,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Link,
  InputAdornment,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  Alert,
  IconButton,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { darkNeonTheme } from '../../theme/darkNeonTheme';
import { authProvider } from '../../providers/auth.provider';
import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  validateRequired,
  validateEmail,
  validateRegistrationForm,
  mapErrorsToFields,
} from '../../utils/registerUtils';

export const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fieldValidation, setFieldValidation] = useState<Record<string, boolean>>({});
  const [signupSuccess, setSignupSuccess] = useState(false);
  const notify = useNotify();
  const navigate = useNavigate();

  const steps = ['Cuenta', 'Perfil'];

  const handleNext = (stepData: any) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);
    setFieldErrors({});

    const validationResult = validateRegistrationForm(stepData, activeStep, termsAccepted);

    if (!validationResult.isValid) {
      setFieldErrors(mapErrorsToFields(validationResult.errors));
      notify('Corrige los errores del formulario.', { type: 'warning' });
      return;
    }

    setFieldValidation((prev: Record<string, boolean>) => ({ ...prev, ...validationResult.fieldValidation }));

    if (activeStep === 0) {
      setActiveStep(1);
    } else {
      handleSubmit(newFormData);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setFieldErrors({});
  };

  const handleSubmit = async (finalData: any) => {
    setLoading(true);
    setFieldErrors({});

    // Filtrar confirmPassword antes de enviar
    const { confirmPassword, ...dataToSend } = finalData;

    const values = {
      ...dataToSend, // Ya no incluye confirmPassword
      rol: finalData.rol ? 'organizer' : 'user',
    };

    const response = await authProvider.signup(values);
    if (response?.status === 201) {
      setSignupSuccess(true);
    } else {
      notify(response?.message || 'Error al crear la cuenta', { type: 'error' });
    }

    setLoading(false);
  };

  const handlePasswordChange = (password: string) => {
    setPasswordStrength(calculatePasswordStrength(password));
    setFormData((prev: any) => ({ ...prev, password }));
  };

  const PasswordStrengthIndicator = () => {
    if (!formData.password) return null;

    return (
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress
            variant="determinate"
            value={passwordStrength}
            sx={{
              height: 6,
              borderRadius: 3,
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getPasswordStrengthColor(passwordStrength),
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: getPasswordStrengthColor(passwordStrength), fontWeight: 600 }}
          >
            {getPasswordStrengthText(passwordStrength)}
          </Typography>
        </Box>
        {passwordStrength < 70 && (
          <Typography
            variant="caption"
            sx={{ mt: 0.5, display: 'block', color: '#E0E0E0' }}
          >
            Usa al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos
          </Typography>
        )}
      </Box>
    );
  };

  const ValidationIcon = ({ fieldName }: { fieldName: string }) => {
    return fieldValidation[fieldName] ? (
      <InputAdornment position="end">
        <CheckCircleIcon sx={{ color: '#4AFF75' }} />
      </InputAdornment>
    ) : null;
  };

  // Estilos comunes para inputs
  const inputStyles = {
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
  };

  const AccountCreatedView = () => (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: '#4AFF75', mb: 3 }} />
      <Typography
        variant="h4"
        component="h2"
        fontWeight="bold"
        sx={{ mb: 2, color: '#FFFFFF' }}
      >
        ¡Cuenta Creada!
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: '#E0E0E0', mb: 4 }}
      >
        Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión y empezar a explorar.
      </Typography>
      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate('/login')}
        sx={{
          py: 1.5,
          fontWeight: 600,
          borderRadius: 2,
          backgroundColor: '#4AFF75',
          color: '#000000',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#7FFF9C',
          },
        }}
      >
        Ir a Iniciar Sesión
      </Button>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Form onSubmit={handleNext}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextInput
                source="email"
                label="Correo electrónico"
                fullWidth
                disabled={loading}
                autoFocus
                validate={validateEmail}
                helperText={fieldErrors.email}
                error={!!fieldErrors.email}
                defaultValue={formData.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#4AFF75' }} />
                      </InputAdornment>
                    ),
                    endAdornment: <ValidationIcon fieldName="email" />,
                  },
                }}
                sx={inputStyles}
              />

              <Box>
                <PasswordInput
                  source="password"
                  label="Contraseña"
                  fullWidth
                  disabled={loading}
                  validate={validateRequired('La contraseña es requerida')}
                  helperText={fieldErrors.password}
                  error={!!fieldErrors.password}
                  defaultValue={formData.password}
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
                          <ValidationIcon fieldName="password" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  sx={inputStyles}
                />
                <PasswordStrengthIndicator />
              </Box>

              <PasswordInput
                source="confirmPassword"
                label="Confirmar Contraseña"
                fullWidth
                disabled={loading}
                validate={validateRequired('La confirmación de contraseña es requerida')}
                helperText={fieldErrors.confirmPassword}
                error={!!fieldErrors.confirmPassword}
                defaultValue={formData.confirmPassword}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#E0E0E0' }}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <ValidationIcon fieldName="confirmPassword" />
                      </InputAdornment>
                    ),
                  },
                }}
                type={showConfirmPassword ? 'text' : 'password'}
                sx={inputStyles}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    sx={{
                      color: '#4AFF75',
                      '&.Mui-checked': {
                        color: '#4AFF75',
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: '#E0E0E0' }}
                  >
                    Acepto los{' '}
                    <Link
                      href="#"
                      sx={{ color: '#4AFF75', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      términos y condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link
                      href="#"
                      sx={{ color: '#4AFF75', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      política de privacidad
                    </Link>
                  </Typography>
                }
              />

              <Button
                variant="contained"
                type="submit"
                disabled={loading || !termsAccepted}
                fullWidth
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  mt: 2,
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: '#4AFF75',
                  color: '#000000',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#7FFF9C',
                  },
                  '&:disabled': {
                    backgroundColor: '#333333',
                    color: '#666666',
                  },
                }}
              >
                Continuar
              </Button>
            </Box>
          </Form>
        );

      case 1:
        return (
          <Form onSubmit={handleNext}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert
                severity="info"
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(74, 255, 117, 0.1)',
                  border: '1px solid #4AFF75',
                  '& .MuiAlert-icon': {
                    color: '#4AFF75',
                  },
                  '& .MuiAlert-message': {
                    color: '#FFFFFF',
                  },
                }}
              >
                <Typography variant="body2">Completa tu perfil para personalizar tu experiencia</Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextInput
                  source="name"
                  label="Nombre"
                  fullWidth
                  disabled={loading}
                  autoFocus
                  validate={validateRequired('El nombre es requerido')}
                  helperText={fieldErrors.name}
                  error={!!fieldErrors.name}
                  defaultValue={formData.name}
                  slotProps={{
                    input: {
                      endAdornment: <ValidationIcon fieldName="name" />,
                    },
                  }}
                  sx={{ ...inputStyles, flex: 1 }}
                />
                <TextInput
                  source="lastname"
                  label="Apellido"
                  fullWidth
                  disabled={loading}
                  validate={validateRequired('El apellido es requerido')}
                  helperText={fieldErrors.lastname}
                  error={!!fieldErrors.lastname}
                  defaultValue={formData.lastname}
                  slotProps={{
                    input: {
                      endAdornment: <ValidationIcon fieldName="lastname" />,
                    },
                  }}
                  sx={{ ...inputStyles, flex: 1 }}
                />
              </Box>

              <TextInput
                source="username"
                label="Nombre de usuario"
                fullWidth
                disabled={loading}
                validate={validateRequired('El nombre de usuario es requerido')}
                helperText={fieldErrors.username}
                error={!!fieldErrors.username}
                defaultValue={formData.username}
                slotProps={{
                  input: {
                    endAdornment: <ValidationIcon fieldName="username" />,
                  },
                }}
                sx={inputStyles}
              />

              <TextInput
                source="phone"
                label="Teléfono"
                fullWidth
                disabled={loading}
                validate={validateRequired('El teléfono es requerido')}
                helperText={fieldErrors.phone}
                error={!!fieldErrors.phone}
                defaultValue={formData.phone}
                placeholder="099 123 4564"
                slotProps={{
                  input: {
                    endAdornment: <ValidationIcon fieldName="phone" />,
                  },
                }}
                sx={inputStyles}
              />

              <Box sx={{ pl: 1 }}>
                <BooleanInput
                  source="rol"
                  label="¿Eres organizador de eventos?"
                  disabled={loading}
                  defaultValue={formData.rol}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                  startIcon={<ArrowBackSharpIcon />}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: '#4AFF75',
                    color: '#4AFF75',
                    '&:hover': {
                      borderColor: '#7FFF9C',
                      backgroundColor: 'rgba(74, 255, 117, 0.08)',
                    },
                  }}
                >
                  Atrás
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    backgroundColor: '#4AFF75',
                    color: '#000000',
                    textTransform: 'none',
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
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </Box>
            </Box>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <ResourceContextProvider value="signup">
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
          <Title title="Crear una Cuenta" />
          <Card
            sx={{
              minWidth: 350,
              maxWidth: 500,
              width: { xs: '90vw', sm: 450 },
              p: 4,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(74, 255, 117, 0.2)',
              background: '#0A0A0A',
              border: '1px solid rgba(74, 255, 117, 0.3)',
            }}
          >
            {signupSuccess ? (
              <AccountCreatedView />
            ) : (
              <>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    sx={{ mb: 1, color: '#FFFFFF' }}
                  >
                    Crear una Cuenta
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#E0E0E0' }}
                  >
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => navigate('/login')}
                      sx={{
                        color: '#4AFF75',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Iniciar sesión
                    </Link>
                  </Typography>
                </Box>

                {/* Stepper */}
                <Stepper
                  activeStep={activeStep}
                  sx={{ mb: 4 }}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        slotProps={{
                          stepIcon: {
                            sx: {
                              '&.Mui-active': {
                                color: '#4AFF75',
                              },
                              '&.Mui-completed': {
                                color: '#4AFF75',
                              },
                              color: '#666666',
                            },
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: activeStep >= index ? '#4AFF75' : '#666666',
                            fontWeight: activeStep >= index ? 600 : 400,
                          }}
                        >
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Step Content */}
                {renderStepContent(activeStep)}
              </>
            )}
          </Card>
        </Box>
      </ThemeProvider>
    </ResourceContextProvider>
  );
};

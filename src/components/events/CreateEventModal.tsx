import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useGetIdentity } from 'react-admin';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import { apiAuth } from '../../api/api';
import LocationPicker from './LocationPicker';

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onEventCreated: () => void;
}

interface EventFormData {
  name: string;
  date: string;
  hour: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  city: string;
  description: string;
  capacity: number;
  state: 'active' | 'inactive' | 'cancelled';
}

const steps = ['Información Básica', 'Ubicación', 'Detalles'];

const CreateEventModal: React.FC<CreateEventModalProps> = ({ open, onClose, onEventCreated }) => {
  const theme = useTheme();
  const { data: identity } = useGetIdentity();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    date: '',
    hour: '',
    location: null,
    city: '',
    description: '',
    capacity: 0,
    state: 'active',
  });

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      name: '',
      date: '',
      hour: '',
      location: null,
      city: '',
      description: '',
      capacity: 0,
      state: 'active',
    });
    setError('');
  };

  const handleLocationSelect = (coordinates: [number, number]) => {
    // Solo actualizar si las coordenadas son válidas (no [0, 0])
    if (coordinates[0] !== 0 || coordinates[1] !== 0) {
      setFormData((prev) => ({
        ...prev,
        location: {
          type: 'Point',
          coordinates,
        },
      }));
    } else {
      // Limpiar la ubicación
      setFormData((prev) => ({
        ...prev,
        location: null,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    setError('');

    switch (step) {
      case 0:
        if (!formData.name.trim()) {
          setError('El nombre del evento es requerido');
          return false;
        }
        if (!formData.date) {
          setError('La fecha del evento es requerida');
          return false;
        }
        if (!formData.hour.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
          setError('La hora debe tener un formato válido (HH:MM)');
          return false;
        }
        break;
      case 1:
        if (!formData.location || (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0)) {
          setError('Debe seleccionar una ubicación válida en el mapa');
          return false;
        }
        if (!formData.city.trim()) {
          setError('La ciudad del evento es requerida');
          return false;
        }
        break;
      case 2:
        if (formData.capacity <= 0) {
          setError('La capacidad debe ser mayor a 0');
          return false;
        }
        break;
    }
    return true;
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(2) || !identity?.id) return;

    setLoading(true);
    setError('');

    try {
      const eventData = {
        name: formData.name,
        date: formData.date,
        hour: formData.hour,
        location: formData.location,
        city: formData.city,
        description: formData.description || '',
        capacity: formData.capacity,
        state: formData.state,
        idUser: identity.id,
      };

      console.log('Sending event data:', eventData);

      const response = await apiAuth.post('/event-entity', eventData);
      console.log('Event created successfully:', response.data);

      onEventCreated();
      onClose();
      handleReset();
    } catch (error: any) {
      console.error('Error creating event:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data?.message || 'Error del servidor al crear el evento');
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        console.error('Error config:', error.message);
        setError('Error inesperado al crear el evento');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Nombre del Evento"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Fecha del Evento"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Hora del Evento"
                  type="time"
                  value={formData.hour}
                  onChange={(e) => handleInputChange('hour', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={formData.location?.coordinates}
                />
                {formData.location &&
                  formData.location.coordinates[0] !== 0 &&
                  formData.location.coordinates[1] !== 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Ubicación seleccionada: Lat {formData.location.coordinates[1].toFixed(6)}, Lng{' '}
                      {formData.location.coordinates[0].toFixed(6)}
                    </Typography>
                  )}
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Capacidad"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
              >
                <FormControl
                  fullWidth
                  variant="outlined"
                >
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    label="Estado"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="active">Activo</MenuItem>
                    <MenuItem value="inactive">Inactivo</MenuItem>
                    <MenuItem value="cancelled">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return 'Paso desconocido';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: `linear-gradient(135deg, rgba(74, 255, 117, 0.02) 0%, ${theme.palette.background.paper} 100%)`,
          border: `1px solid rgba(74, 255, 117, 0.2)`,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, rgba(74, 255, 117, 0.1) 0%, rgba(74, 255, 117, 0.05) 100%)`,
          borderBottom: `1px solid rgba(74, 255, 117, 0.2)`,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <EventIcon sx={{ color: theme.palette.primary.main }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 700 }}
        >
          Crear Nuevo Evento
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, position: 'relative' }}>
        <Box sx={{ width: '100%', mb: 4, position: 'relative', zIndex: 2 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: 600,
                    },
                    '& .MuiStepIcon-root': {
                      color: 'rgba(74, 255, 117, 0.3)',
                      '&.Mui-active': {
                        color: theme.palette.primary.main,
                      },
                      '&.Mui-completed': {
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {error}
          </Alert>
        )}

        <Card
          sx={{
            background: `linear-gradient(135deg, rgba(74, 255, 117, 0.02) 0%, transparent 100%)`,
            border: `1px solid rgba(74, 255, 117, 0.1)`,
            borderRadius: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <CardContent sx={{ p: 3 }}>{getStepContent(activeStep)}</CardContent>
        </Card>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid rgba(74, 255, 117, 0.2)`,
          background: `linear-gradient(135deg, rgba(74, 255, 117, 0.02) 0%, transparent 100%)`,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>

        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Atrás
          </Button>
        )}

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 6px 20px rgba(74, 255, 117, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(74, 255, 117, 0.4)',
              },
            }}
          >
            {loading ? 'Creando...' : 'Crear Evento'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              borderRadius: 2,
              px: 4,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 6px 20px rgba(74, 255, 117, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(74, 255, 117, 0.4)',
              },
            }}
          >
            Siguiente
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateEventModal;

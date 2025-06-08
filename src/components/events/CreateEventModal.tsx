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
  Grid2,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useGetIdentity } from 'react-admin';
import EventIcon from '@mui/icons-material/Event';
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

const steps = ['Información Básica', 'Detalles del Evento', 'Ubicación del Evento'];

const initialFormData: EventFormData = {
  name: '',
  date: '',
  hour: '',
  location: null,
  city: '',
  description: '',
  capacity: 0,
  state: 'active',
};

const CreateEventModal: React.FC<CreateEventModalProps> = ({ open, onClose, onEventCreated }) => {
  const theme = useTheme();
  const { data: identity } = useGetIdentity();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData(initialFormData);
    setError('');
  };

  const handleLocationSelect = (coordinates: [number, number]) => {
    const isValidLocation = coordinates[0] !== 0 || coordinates[1] !== 0;

    setFormData((prev) => ({
      ...prev,
      location: isValidLocation ? { type: 'Point', coordinates } : null,
    }));
  };

  const validateStep = (step: number): boolean => {
    setError('');

    const validations = [
      // Step 0: Basic Information
      () => {
        if (!formData.name.trim()) return 'El nombre del evento es requerido';
        if (!formData.date) return 'La fecha del evento es requerida';
        if (!formData.hour.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
          return 'La hora debe tener un formato válido (HH:MM)';
        }
        return null;
      },
      // Step 1: Event Details
      () => {
        if (!formData.city.trim()) return 'La ciudad del evento es requerida';
        if (formData.capacity <= 0) return 'La capacidad debe ser mayor a 0';
        return null;
      },
      // Step 2: Location
      () => {
        const hasValidLocation =
          formData.location && !(formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0);
        if (!hasValidLocation) return 'Debe seleccionar una ubicación válida en el mapa';
        return null;
      },
    ];

    const errorMessage = validations[step]?.();
    if (errorMessage) {
      setError(errorMessage);
      return false;
    }
    return true;
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateStep(2) || !identity?.id) return;

    setLoading(true);
    setError('');

    try {
      const eventData = {
        ...formData,
        description: formData.description || '',
        idUser: identity.id,
      };

      await apiAuth.post('/event-entity', eventData);

      // Mostrar notificación de éxito
      setSuccessSnackbarOpen(true);

      // Esperar un momento para que el usuario vea la notificación
      setTimeout(() => {
        onEventCreated();
        onClose();
        handleReset();
      }, 1500);
    } catch (error: any) {
      console.error('Error creating event:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        setError('Error inesperado al crear el evento');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    handleReset();
    setSuccessSnackbarOpen(false);
    onClose();
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };

  const renderStepContent = (step: number) => {
    const stepComponents = [
      // Step 0: Basic Information
      <Grid2
        container
        spacing={3}
      >
        <Grid2 size={12}>
          <TextField
            fullWidth
            label="Nombre del Evento"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            variant="outlined"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Fecha del Evento"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Hora del Evento"
            type="time"
            value={formData.hour}
            onChange={(e) => handleInputChange('hour', e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid2>
      </Grid2>,
      // Step 1: Event Details
      <Grid2
        container
        spacing={3}
      >
        <Grid2 size={12}>
          <TextField
            fullWidth
            label="Ciudad"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            variant="outlined"
            helperText="Especifica la ciudad donde se realizará el evento"
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            fullWidth
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            multiline
            rows={4}
            variant="outlined"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Capacidad"
            type="number"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
            variant="outlined"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <FormControl
            fullWidth
            variant="outlined"
          >
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              label="Estado"
            >
              <MenuItem value="active">Activo</MenuItem>
              <MenuItem value="inactive">Inactivo</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
      </Grid2>,
      // Step 2: Location
      !formData.city.trim() ? (
        <Alert
          severity="info"
          sx={{ borderRadius: 2 }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Por favor, especifica primero la ciudad del evento en el paso anterior.
          </Typography>
        </Alert>
      ) : (
        <Box>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: 'text.primary' }}
          >
            📍 Ubicación en {formData.city}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, fontStyle: 'italic' }}
          >
            Selecciona la ubicación exacta donde se realizará tu evento en {formData.city}
          </Typography>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            selectedLocation={formData.location?.coordinates}
          />
        </Box>
      ),
    ];

    return stepComponents[step] || 'Paso desconocido';
  };

  const isNextDisabled = activeStep === 1 && !formData.city.trim();

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid rgba(74, 255, 117, 0.2)`,
            },
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
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

        <DialogContent sx={{ p: 5, backgroundColor: theme.palette.background.paper }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ mb: 4 }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          <Card sx={{ borderRadius: 2, border: `1px solid rgba(74, 255, 117, 0.1)` }}>
            <CardContent sx={{ p: 3 }}>{renderStepContent(activeStep)}</CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: `1px solid rgba(74, 255, 117, 0.2)` }}>
          <Button
            onClick={handleClose}
            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Cancelar
          </Button>

          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
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
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600 }}
            >
              {loading ? 'Creando...' : 'Crear Evento'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isNextDisabled}
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600 }}
            >
              Siguiente
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSuccessSnackbarClose}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              fontSize: 24,
            },
          }}
        >
          🎉 ¡Evento creado exitosamente! Se está actualizando tu lista de eventos...
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateEventModal;

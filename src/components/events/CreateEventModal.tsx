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
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useGetIdentity } from 'react-admin';
import EventIcon from '@mui/icons-material/Event';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiAuth } from '../../api/api';
import LocationPicker from './LocationPicker';
import type { ITicketCategory } from '../../types/ticketCategory.type';

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

interface TicketCategoryFormState {
  id: number; // Temporary client-side ID for list management
  name: string;
  price: string;
  description: string;
  availableTickets: string;
  startDay: string;
  endDate: string;
}

const steps = ['Información Básica', 'Detalles del Evento', 'Ubicación', 'Categorías de Boletos'];

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
  const [createdEventId, setCreatedEventId] = useState<number | null>(null);
  const [ticketCategories, setTicketCategories] = useState<TicketCategoryFormState[]>([]);
  const [categoryErrors, setCategoryErrors] = useState<
    Record<number, Partial<Record<keyof Omit<TicketCategoryFormState, 'id'>, string>>>
  >({});

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
    setCreatedEventId(null);
    setTicketCategories([]);
    setCategoryErrors({});
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
        if (formData.name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
        if (formData.name.trim().length > 100) return 'El nombre no puede exceder los 100 caracteres.';
        if (!formData.date) return 'La fecha del evento es requerida';
        if (!formData.hour.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
          return 'La hora debe tener un formato válido (HH:MM)';
        }
        const eventDateTime = new Date(`${formData.date}T${formData.hour}`);
        if (eventDateTime < new Date()) {
          return 'La fecha y hora del evento no pueden estar en el pasado.';
        }
        return null;
      },
      // Step 1: Event Details
      () => {
        if (!formData.city.trim()) return 'La ciudad del evento es requerida';
        if (formData.city.trim().length < 3) return 'La ciudad debe tener al menos 3 caracteres.';
        if (formData.city.trim().length > 50) return 'La ciudad no puede exceder los 50 caracteres.';
        if (formData.capacity <= 0) return 'La capacidad debe ser mayor a 0';
        if (formData.capacity > 100000) return 'La capacidad máxima es de 100,000.';
        if (formData.description.length > 500) return 'La descripción no puede exceder los 500 caracteres.';
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

      const response = await apiAuth.post('/event-entity', eventData);
      setCreatedEventId(response.data.id);
      setActiveStep((prev) => prev + 1);
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

  const handleTicketCategorySubmit = async () => {
    if (!validateTicketCategories() || createdEventId === null) {
      if (createdEventId === null) {
        setError('No se pudo obtener el ID del evento. Por favor, inténtelo de nuevo.');
      }
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload: ITicketCategory[] = ticketCategories.map((cat) => ({
        name: cat.name,
        price: parseFloat(cat.price),
        description: cat.description,
        availableTickets: parseInt(cat.availableTickets, 10),
        startDay: new Date(cat.startDay),
        endDate: new Date(cat.endDate),
        eventId: createdEventId,
      }));

      await apiAuth.post('/ticket-category', payload);

      setSuccessSnackbarOpen(true);
      setTimeout(() => {
        onEventCreated();
        onClose();
        handleReset();
      }, 1500);
    } catch (error: any) {
      console.error('Error creating ticket categories:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error inesperado al crear las categorías de boletos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateTicketCategories = (): boolean => {
    setError('');
    const newErrors: Record<number, Partial<Record<keyof Omit<TicketCategoryFormState, 'id'>, string>>> = {};
    let isValid = true;

    if (ticketCategories.length === 0) {
      setError('Debe añadir al menos una categoría de boleto.');
      return false;
    }

    const totalTickets = ticketCategories.reduce((sum, cat) => sum + (parseInt(cat.availableTickets, 10) || 0), 0);
    if (totalTickets > formData.capacity) {
      setError(
        `La suma de boletos disponibles (${totalTickets}) no puede exceder la capacidad del evento (${formData.capacity}).`,
      );
      isValid = false;
    }

    const eventDateTime = new Date(`${formData.date}T${formData.hour}`);
    const eventDeadline = new Date(eventDateTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before

    for (const cat of ticketCategories) {
      const categoryIdErrors: Partial<Record<keyof Omit<TicketCategoryFormState, 'id'>, string>> = {};

      if (!cat.name.trim()) {
        categoryIdErrors.name = 'Requerido.';
        isValid = false;
      } else if (cat.name.trim().length < 3) {
        categoryIdErrors.name = 'Mín. 3 caracteres.';
        isValid = false;
      } else if (cat.name.trim().length > 50) {
        categoryIdErrors.name = 'Máx. 50 caracteres.';
        isValid = false;
      }

      if (!cat.price) {
        categoryIdErrors.price = 'Requerido.';
        isValid = false;
      } else if (isNaN(parseFloat(cat.price)) || parseFloat(cat.price) <= 0) {
        categoryIdErrors.price = 'Debe ser positivo.';
        isValid = false;
      } else if (!/^\d+(\.\d{1,2})?$/.test(cat.price)) {
        categoryIdErrors.price = 'Máx. 2 decimales.';
        isValid = false;
      } else if (parseFloat(cat.price) > 200) {
        categoryIdErrors.price = 'Máx. $200.';
        isValid = false;
      }

      if (!cat.availableTickets) {
        categoryIdErrors.availableTickets = 'Requerido.';
        isValid = false;
      } else if (isNaN(parseInt(cat.availableTickets, 10)) || parseInt(cat.availableTickets, 10) <= 0) {
        categoryIdErrors.availableTickets = 'Debe ser positivo.';
        isValid = false;
      } else if (parseInt(cat.availableTickets, 10) > formData.capacity) {
        categoryIdErrors.availableTickets = `No puede exceder la capacidad (${formData.capacity}).`;
        isValid = false;
      }

      if (!cat.startDay) {
        categoryIdErrors.startDay = 'Fecha de inicio requerida.';
        isValid = false;
      } else if (new Date(cat.startDay) < new Date()) {
        categoryIdErrors.startDay = 'No puede ser en el pasado.';
        isValid = false;
      }

      if (!cat.endDate) {
        categoryIdErrors.endDate = 'Fecha de fin requerida.';
        isValid = false;
      } else if (new Date(cat.endDate) > eventDeadline) {
        categoryIdErrors.endDate = 'Debe ser al menos 2 horas antes del evento.';
        isValid = false;
      }

      if (cat.startDay && cat.endDate && new Date(cat.startDay) >= new Date(cat.endDate)) {
        categoryIdErrors.endDate = 'Debe ser posterior al inicio.';
        isValid = false;
      }

      if (Object.keys(categoryIdErrors).length > 0) {
        newErrors[cat.id] = categoryIdErrors;
      }
    }

    setCategoryErrors(newErrors);
    return isValid;
  };

  const handleAddCategory = () => {
    setTicketCategories((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        price: '',
        description: '',
        availableTickets: '',
        startDay: '',
        endDate: '',
      },
    ]);
  };

  const handleRemoveCategory = (id: number) => {
    setTicketCategories((prev) => prev.filter((cat) => cat.id !== id));
    setCategoryErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleCategoryChange = (id: number, field: keyof Omit<TicketCategoryFormState, 'id'>, value: string) => {
    setTicketCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat)));
    if (categoryErrors[id]?.[field]) {
      setCategoryErrors((prevErrors) => {
        const newErrorsForCat = { ...prevErrors[id] };
        delete newErrorsForCat[field];
        if (Object.keys(newErrorsForCat).length === 0) {
          const newErrors = { ...prevErrors };
          delete newErrors[id];
          return newErrors;
        }
        return { ...prevErrors, [id]: newErrorsForCat };
      });
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
      // Step 3: Ticket Categories
      <Box>
        <Card sx={{ mb: 3, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            color="text.secondary"
          >
            Resumen del Evento
          </Typography>
          <Grid2
            container
            spacing={1}
          >
            <Grid2 size={12}>
              <Typography>
                <strong>Evento:</strong> {formData.name}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography>
                <strong>Fecha:</strong> {new Date(formData.date + 'T00:00:00').toLocaleDateString()}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography>
                <strong>Hora:</strong> {formData.hour}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography>
                <strong>Capacidad:</strong> {formData.capacity.toLocaleString()} personas
              </Typography>
            </Grid2>
          </Grid2>
        </Card>
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 2 }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: 600 }}
          >
            ¡Evento creado! Ahora, define las categorías de boletos.
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1 }}
          >
            Nota: El evento ya ha sido guardado. No puedes volver a los pasos anteriores.
          </Typography>
        </Alert>

        {ticketCategories.map((category, index) => (
          <Card
            key={category.id}
            sx={{ mb: 2, position: 'relative', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="h6"
                  color="primary"
                >
                  Categoría #{index + 1}
                </Typography>
                <IconButton
                  onClick={() => handleRemoveCategory(category.id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid2
                container
                spacing={2}
              >
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Nombre de Categoría (ej. VIP)"
                    value={category.name}
                    onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                    variant="outlined"
                    error={!!categoryErrors[category.id]?.name}
                    helperText={categoryErrors[category.id]?.name}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Precio ($)"
                    type="number"
                    value={category.price}
                    onChange={(e) => handleCategoryChange(category.id, 'price', e.target.value)}
                    variant="outlined"
                    error={!!categoryErrors[category.id]?.price}
                    helperText={categoryErrors[category.id]?.price}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Boletos Disponibles"
                    type="number"
                    value={category.availableTickets}
                    onChange={(e) => handleCategoryChange(category.id, 'availableTickets', e.target.value)}
                    variant="outlined"
                    error={!!categoryErrors[category.id]?.availableTickets}
                    helperText={categoryErrors[category.id]?.availableTickets}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <TextField
                    fullWidth
                    label="Descripción (opcional)"
                    value={category.description}
                    onChange={(e) => handleCategoryChange(category.id, 'description', e.target.value)}
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Inicio de Venta"
                    type="datetime-local"
                    value={category.startDay}
                    onChange={(e) => handleCategoryChange(category.id, 'startDay', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    error={!!categoryErrors[category.id]?.startDay}
                    helperText={categoryErrors[category.id]?.startDay}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Fin de Venta"
                    type="datetime-local"
                    value={category.endDate}
                    onChange={(e) => handleCategoryChange(category.id, 'endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    error={!!categoryErrors[category.id]?.endDate}
                    helperText={categoryErrors[category.id]?.endDate}
                  />
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        ))}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddCategory}
          sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
        >
          Añadir Otra Categoría
        </Button>
      </Box>,
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

          {activeStep > 0 && !createdEventId && (
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
              onClick={handleTicketCategorySubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {loading ? 'Finalizando...' : 'Finalizar Creación'}
            </Button>
          ) : activeStep === steps.length - 2 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                borderRadius: 2,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {loading ? 'Creando Evento...' : 'Crear Evento y Continuar'}
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

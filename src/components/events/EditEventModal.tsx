import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid2,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { eventEntityProvider } from '../../providers/eventEntity.provider';
import LocationPicker from './LocationPicker';
import EditTicketCategoriesModal from './EditTicketCategoriesModal';

interface EditEventModalProps {
  open: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
  eventId: number;
}

interface EditEventFormData {
  name: string;
  date: string;
  hour: string;
  latitude: number | null;
  longitude: number | null;
  city: string;
  description: string;
  capacity: number;
  state: 'active' | 'inactive' | 'cancelled';
}

// Ciudades principales de Ecuador (organizadas por importancia)
const ecuadorianCities = [
  'Quito',
  'Guayaquil', 
  'Cuenca',
  'Santo Domingo',
  'Ambato',
  'Machala',
  'Manta',
  'Portoviejo',
  'Riobamba',
  'Loja',
  'Esmeraldas',
  'Ibarra',
  'Milagro',
  'Babahoyo',
  'La Libertad',
  'Latacunga',
  'Tulcán',
  'Sangolquí',
  'Azogues',
  'Guaranda',
  'Puyo',
  'Tena',
  'Macas',
  'Nueva Loja',
  'Zamora'
];

const EditEventModal: React.FC<EditEventModalProps> = ({ 
  open, 
  onClose, 
  onEventUpdated, 
  eventId 
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<EditEventFormData>({
    name: '',
    date: '',
    hour: '',
    latitude: null,
    longitude: null,
    city: '',
    description: '',
    capacity: 0,
    state: 'active',
  });
  const [originalData, setOriginalData] = useState<EditEventFormData>({
    name: '',
    date: '',
    hour: '',
    latitude: null,
    longitude: null,
    city: '',
    description: '',
    capacity: 0,
    state: 'active',
  });
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  
  // Estado para el modal de categorías de tickets
  const [ticketCategoriesModalOpen, setTicketCategoriesModalOpen] = useState(false);

  // Cargar los datos del evento cuando se abre el modal
  useEffect(() => {
    if (open && eventId) {
      loadEventData();
    }
  }, [open, eventId]);

  const loadEventData = async () => {
    setLoadingEvent(true);
    setError('');
    
    try {
      const response = await eventEntityProvider.getOne('event-entity', { id: eventId });
      const event = response.data;
      
      // Parseamos la ubicación desde los campos latitude y longitude
      let latitude = null;
      let longitude = null;
      
      // Primero intentar usar los campos latitude y longitude directos
      if (event.latitude && event.longitude) {
        const lat = typeof event.latitude === 'string' ? parseFloat(event.latitude) : event.latitude;
        const lng = typeof event.longitude === 'string' ? parseFloat(event.longitude) : event.longitude;
        
        if (!isNaN(lat) && !isNaN(lng)) {
          latitude = lat;
          longitude = lng;
        }
      }
      
      // Si no hay datos directos, intentar parsear desde el campo location (backup)
      if (latitude === null && longitude === null && event.location) {
        try {
          const locationData = JSON.parse(event.location);
          if (locationData.coordinates && Array.isArray(locationData.coordinates)) {
            longitude = locationData.coordinates[0];
            latitude = locationData.coordinates[1];
          }
        } catch (e) {
          console.warn('Error parsing location data:', e);
        }
      }

      // Formatear la hora para asegurar el formato correcto HH:MM
      let formattedHour = event.hour || '';
      if (formattedHour) {
        // Si la hora viene como un objeto Date o timestamp, extraer solo HH:MM
        if (formattedHour.includes('T')) {
          formattedHour = formattedHour.split('T')[1].substring(0, 5);
        } else if (formattedHour.length > 5) {
          // Si viene con segundos (HH:MM:SS), tomar solo HH:MM
          formattedHour = formattedHour.substring(0, 5);
        }
        // Asegurar formato de dos dígitos para horas menores a 10
        const [hours, minutes] = formattedHour.split(':');
        if (hours && minutes) {
          formattedHour = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        }
      }

      const eventFormData = {
        name: event.name || '',
        date: event.date ? event.date.split('T')[0] : '',
        hour: formattedHour,
        latitude,
        longitude,
        city: event.city || '',
        description: event.description || '',
        capacity: event.capacity || 0,
        state: event.state || 'active',
      };

      setFormData(eventFormData);
      setOriginalData(eventFormData); // Store original data for comparison
      setChangedFields(new Set()); // Reset changed fields
    } catch (error: any) {
      console.error('Error loading event:', error);
      setError('Error al cargar los datos del evento.');
    } finally {
      setLoadingEvent(false);
    }
  };

  const handleInputChange = (field: keyof EditEventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Track which field was changed
    setChangedFields((prev) => {
      const newSet = new Set(prev);
      
      // Check if the new value is different from the original
      if (originalData[field] !== value) {
        newSet.add(field);
      } else {
        newSet.delete(field);
      }
      
      return newSet;
    });
  };

  const handleLocationSelect = (coordinates: [number, number]) => {
    const isValidLocation = coordinates[0] !== 0 || coordinates[1] !== 0;
    const newLongitude = isValidLocation ? coordinates[0] : null;
    const newLatitude = isValidLocation ? coordinates[1] : null;

    setFormData((prev) => ({
      ...prev,
      longitude: newLongitude,
      latitude: newLatitude,
    }));

    // Track location changes
    setChangedFields((prev) => {
      const newSet = new Set(prev);
      
      if (originalData.longitude !== newLongitude) {
        newSet.add('longitude');
      } else {
        newSet.delete('longitude');
      }
      
      if (originalData.latitude !== newLatitude) {
        newSet.add('latitude');
      } else {
        newSet.delete('latitude');
      }
      
      return newSet;
    });
  };

  const validateForm = (): boolean => {
    setError('');

    // Si no hay campos cambiados, no hay nada que validar
    if (changedFields.size === 0) {
      setError('No has realizado ningún cambio en el evento.');
      return false;
    }

    // Solo validar los campos que han cambiado
    if (changedFields.has('name')) {
      if (!formData.name.trim()) {
        setError('El nombre del evento es requerido.');
        return false;
      }

      if (formData.name.trim().length < 3) {
        setError('El nombre debe tener al menos 3 caracteres.');
        return false;
      }

      if (formData.name.trim().length > 100) {
        setError('El nombre no puede exceder los 100 caracteres.');
        return false;
      }
    }

    if (changedFields.has('date')) {
      if (!formData.date) {
        setError('La fecha del evento es requerida.');
        return false;
      }
    }

    if (changedFields.has('hour')) {
      // Validar formato de hora más flexible
      const hourValue = formData.hour.trim();
      if (!hourValue) {
        setError('La hora del evento es requerida.');
        return false;
      }

      // Regex que acepta formatos HH:MM y H:MM
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      
      if (!timeRegex.test(hourValue)) {
        setError('La hora debe tener un formato válido (HH:MM). Ejemplo: 14:30');
        console.log('Hora inválida:', hourValue); // Para debug
        return false;
      }
    }

    // Validar fecha y hora juntas solo si alguna de ellas cambió
    if (changedFields.has('date') || changedFields.has('hour')) {
      const eventDateTime = new Date(`${formData.date}T${formData.hour}`);
      if (eventDateTime < new Date()) {
        setError('La fecha y hora del evento no pueden estar en el pasado.');
        return false;
      }

      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);
      if (eventDateTime > maxDate) {
        setError('La fecha del evento no puede ser mayor a 2 años desde hoy.');
        return false;
      }
    }

    if (changedFields.has('city')) {
      if (!formData.city || formData.city.trim() === '') {
        setError('Debe seleccionar una ciudad.');
        return false;
      }

      if (!ecuadorianCities.includes(formData.city)) {
        setError('La ciudad seleccionada no es válida.');
        return false;
      }
    }

    if (changedFields.has('capacity')) {
      if (formData.capacity <= 0) {
        setError('La capacidad debe ser mayor a 0.');
        return false;
      }

      if (formData.capacity > 100000) {
        setError('La capacidad máxima es de 100,000.');
        return false;
      }
    }

    if (changedFields.has('description')) {
      if (formData.description.length > 500) {
        setError('La descripción no puede exceder los 500 caracteres.');
        return false;
      }
    }

    if (changedFields.has('latitude') || changedFields.has('longitude')) {
      const hasValidLocation = formData.latitude !== null && formData.longitude !== null &&
        !(formData.latitude === 0 && formData.longitude === 0);
      if (!hasValidLocation) {
        setError('Debe seleccionar una ubicación válida en el mapa.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Check if any fields were actually changed
    if (changedFields.size === 0) {
      setError('No se han realizado cambios en el evento.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Build update data with only changed fields
      const updateData: any = {};

      changedFields.forEach((field) => {
        switch (field) {
          case 'name':
            updateData.name = formData.name.trim();
            break;
          case 'date':
            updateData.date = formData.date;
            break;
          case 'hour':
            updateData.hour = formData.hour;
            break;
          case 'city':
            updateData.city = formData.city;
            break;
          case 'description':
            updateData.description = formData.description.trim();
            break;
          case 'capacity':
            updateData.capacity = formData.capacity;
            break;
          case 'state':
            updateData.state = formData.state;
            break;
          case 'longitude':
            updateData.longitude = formData.longitude;
            break;
          case 'latitude':
            updateData.latitude = formData.latitude;
            break;
        }
      });

      await eventEntityProvider.update('event-entity', {
        id: eventId,
        data: updateData,
        previousData: {}, // Required by react-admin interface
      });

      onEventUpdated();
      onClose();
      handleReset();
    } catch (error: any) {
      console.error('Error updating event:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        setError('Error inesperado al actualizar el evento.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      date: '',
      hour: '',
      latitude: null,
      longitude: null,
      city: '',
      description: '',
      capacity: 0,
      state: 'active',
    });
    setOriginalData({
      name: '',
      date: '',
      hour: '',
      latitude: null,
      longitude: null,
      city: '',
      description: '',
      capacity: 0,
      state: 'active',
    });
    setChangedFields(new Set());
    setError('');
  };

  const handleEditTicketCategories = () => {
    setTicketCategoriesModalOpen(true);
  };

  const handleTicketCategoriesUpdated = () => {
    // Mostrar notificación o actualizar datos si es necesario
    console.log('Categorías de tickets actualizadas');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
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
        <EditIcon sx={{ color: theme.palette.primary.main }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 700 }}
        >
          Editar Evento
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
        {loadingEvent ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {error}
              </Alert>
            )}

            <Card sx={{ p: 3, borderRadius: 2, border: `1px solid rgba(74, 255, 117, 0.1)` }}>
              <Grid2 container spacing={3}>
                {/* Información Básica */}
                <Grid2 size={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                    Información Básica
                  </Typography>
                </Grid2>

                <Grid2 size={12}>
                  <TextField
                    fullWidth
                    label="Nombre del Evento"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderColor: changedFields.has('name') ? 'primary.main' : 'divider',
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                    helperText={changedFields.has('name') ? '✨ Campo modificado' : ''}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderColor: changedFields.has('date') ? 'primary.main' : 'divider',
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                    helperText={changedFields.has('date') ? '✨ Campo modificado' : ''}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderColor: changedFields.has('hour') ? 'primary.main' : 'divider',
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                    helperText={changedFields.has('hour') ? '✨ Campo modificado' : 'Formato: HH:MM (ej: 14:30)'}
                  />
                </Grid2>

                {/* Detalles del Evento */}
                <Grid2 size={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'text.primary' }}>
                    Detalles del Evento
                  </Typography>
                </Grid2>

                <Grid2 size={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      label="Ciudad"
                    >
                      {ecuadorianCities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                  <FormControl fullWidth variant="outlined">
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

                {/* Ubicación */}
                <Grid2 size={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'text.primary' }}>
                    📍 Ubicación en {formData.city || 'Ciudad'}
                  </Typography>
                  {formData.city ? (
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      selectedLocation={formData.latitude !== null && formData.longitude !== null ? 
                        [formData.longitude, formData.latitude] : undefined}
                    />
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Por favor, selecciona primero la ciudad del evento.
                      </Typography>
                    </Alert>
                  )}
                </Grid2>

                {/* Categorías de Boletos */}
                <Grid2 size={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'text.primary' }}>
                    🎫 Categorías de Boletos
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<LocalActivityIcon />}
                      onClick={handleEditTicketCategories}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: 'rgba(74, 255, 117, 0.1)',
                          borderColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Editar Categorías
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      Gestiona precios, disponibilidad y fechas de las categorías de boletos
                    </Typography>
                  </Box>
                </Grid2>
              </Grid2>
            </Card>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid rgba(74, 255, 117, 0.2)` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box>
            {changedFields.size > 0 && (
              <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                {changedFields.size} campo{changedFields.size > 1 ? 's' : ''} modificado{changedFields.size > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading || loadingEvent}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading || loadingEvent || changedFields.size === 0}
              sx={{
                background: 'linear-gradient(135deg, #4AFF75 0%, #39E65C 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #39E65C 0%, #2ECC4F 100%)',
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground,
                },
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </DialogActions>

      {/* Modal para editar categorías de tickets */}
      <EditTicketCategoriesModal
        open={ticketCategoriesModalOpen}
        onClose={() => setTicketCategoriesModalOpen(false)}
        onCategoriesUpdated={handleTicketCategoriesUpdated}
        eventId={eventId}
      />
    </Dialog>
  );
};

export default EditEventModal;

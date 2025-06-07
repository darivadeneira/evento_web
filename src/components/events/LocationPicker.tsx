import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ClearIcon from '@mui/icons-material/Clear';
import LocationPickerMap from './LocationPickerMap';

interface LocationPickerProps {
  onLocationSelect: (coordinates: [number, number]) => void;
  selectedLocation?: [number, number];
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, selectedLocation }) => {
  const theme = useTheme();
  const [error, setError] = useState('');

  const getCurrentLocation = () => {
    setError('');

    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en este navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        onLocationSelect(coords);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('No se pudo obtener la ubicación actual');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const clearSelection = () => {
    onLocationSelect([0, 0]);
    setError('');
  };

  return (
    <Box>
      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      <Typography
        variant="h6"
        sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <LocationOnIcon color="primary" />
        Seleccionar Ubicación del Evento
      </Typography>

      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
          border: `2px solid rgba(74, 255, 117, 0.3)`,
        }}
      >
        <LocationPickerMap
          selectedLocation={selectedLocation}
          onLocationSelect={onLocationSelect}
          height={300}
        />
      </Paper>

      {selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0 && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(74, 255, 117, 0.1)',
            border: '1px solid rgba(74, 255, 117, 0.3)',
            '& .MuiAlert-icon': {
              color: theme.palette.primary.main,
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 500 }}
          >
            Ubicación seleccionada: Latitud {selectedLocation[1].toFixed(6)}, Longitud {selectedLocation[0].toFixed(6)}
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<MyLocationIcon />}
          onClick={getCurrentLocation}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.light,
              backgroundColor: 'rgba(74, 255, 117, 0.08)',
            },
          }}
        >
          Usar mi ubicación actual
        </Button>

        {selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0 && (
          <Button
            variant="text"
            startIcon={<ClearIcon />}
            onClick={clearSelection}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.08)',
                color: theme.palette.error.main,
              },
            }}
          >
            Limpiar selección
          </Button>
        )}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          mt: 2,
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        Haz clic en cualquier punto del mapa para seleccionar la ubicación del evento
      </Typography>
    </Box>
  );
};

export default LocationPicker;

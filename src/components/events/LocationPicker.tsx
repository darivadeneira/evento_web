import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import LocationPickerMap from './LocationPickerMap';

interface LocationPickerProps {
  onLocationSelect: (coordinates: [number, number]) => void;
  selectedLocation?: [number, number];
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, selectedLocation }) => {
  const theme = useTheme();
  const [address, setAddress] = useState<string | null>(null);

  const clearSelection = () => {
    onLocationSelect([0, 0]);
    setAddress(null);
  };

  return (
    <Box>
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
          onAddressChange={setAddress}
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
            {address
              ? <>
                  <b>Dirección:</b> {address}
                  <br />
                </>
              : 'Buscando dirección...'}
            Ubicación seleccionada: Latitud {selectedLocation[1].toFixed(6)}, Longitud {selectedLocation[0].toFixed(6)}
          </Typography>
        </Alert>
      )}

      {selectedLocation && selectedLocation[0] !== 0 && selectedLocation[1] !== 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
        </Box>
      )}

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

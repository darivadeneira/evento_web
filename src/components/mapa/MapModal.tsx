// Migrated from MapModal.jsx to MapModal.tsx
import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MapView from './Map';

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  eventTitle: string;
  eventLocation: string;
}

const MapModal: React.FC<MapModalProps> = ({ open, onClose, eventTitle, eventLocation }) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const eventLocations: Record<string, [number, number]> = {
    'Centro de Convenciones': [-0.181233, -78.484175],
    'Teatro Principal': [-0.209788, -78.498711],
    'Centro Exposiciones': [-0.176109, -78.480344],
    'Biblioteca Nacional': [-0.202407, -78.497286],
    'Ubicación por defecto': [-0.180551, -78.467932]
  };
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsMapReady(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsMapReady(false);
    }
  }, [open]);
  const getEventCoordinates = () => {
    return eventLocations[eventLocation] || eventLocations['Ubicación por defecto'];
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '80%' },
          height: { xs: '80%', sm: '85%' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}
        >
          <Typography id="map-modal-title" variant="h6" component="h2">
            Cómo llegar a: {eventTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mx: 2, flexGrow: 1 }}>
            {eventLocation}
          </Typography>
          <IconButton onClick={onClose} aria-label="cerrar">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
          {isMapReady ? (
            <MapView presetDestination={getEventCoordinates()} />
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Typography>Cargando mapa...</Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Utiliza el mapa para encontrar la mejor ruta hacia el evento
          </Typography>
          <Button onClick={onClose} color="primary">
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MapModal;

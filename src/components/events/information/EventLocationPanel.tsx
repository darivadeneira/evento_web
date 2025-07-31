import { Paper, Typography, Divider, Box } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import MapView from '../../mapa/Map';

interface EventLocationPanelProps {
  city: string;
  latitude?: string | number;
  longitude?: string | number;
}

const EventLocationPanel = ({ city, latitude, longitude }: EventLocationPanelProps) => {
  // Convertir strings a números y validar
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  
  // Verificar que las coordenadas sean válidas
  const hasValidCoordinates = lat !== undefined && lng !== undefined && 
    !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  
  // Las coordenadas correctas para Ecuador: [latitude, longitude]
  const coordinates: [number, number] | undefined = hasValidCoordinates ? [lat, lng] : undefined;

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 3,
        p: 3,
        bgcolor: 'background.paper',
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
        flex: 2,
        width: { xs: '100%', md: 600 },
        maxWidth: { xs: '100%', md: 700 },
        height: '100%',
        justifyContent: 'flex-start',
      }}
    >
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        color="text.primary"
        sx={{ mb: 1, textAlign: 'center', width: '100%' }}
      >
        Ubicación del Evento
      </Typography>
      <Divider sx={{ mb: 1, width: '100%' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, justifyContent: 'center', width: '100%' }}>
        <RoomIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">{city}</Typography>
      </Box>
      <Paper
        elevation={8}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          width: '100%',
          height: { xs: 350, md: 500, lg: 'calc(100vh - 220px)' },
          minHeight: 300,
          maxHealth: '100%',
          flex: 1,
          alignSelf: 'stretch',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 2,
          position: 'relative',
        }}
      >
        {coordinates ? (
          <div style={{ width: '100%', height: '100%' }} key={`map-${coordinates[0]}-${coordinates[1]}`}>
            <MapView presetDestination={coordinates} />
          </div>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
            <Typography variant="h6">Ubicación no disponible</Typography>
          </Box>
        )}
      </Paper>
    </Paper>
  );
};

export default EventLocationPanel;

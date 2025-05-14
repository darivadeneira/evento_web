import { useGetIdentity, Title } from 'react-admin';
import { 
  Box, 
  Card, 
  Typography,  
  Grid, 
  Container, 
  Button, 
  Avatar, 
  Chip,
  IconButton,
  Badge,
  Tooltip
} from '@mui/material';
import { useState } from 'react';
// Import the TypeScript version directly
import MapModal from './mapa/MapModal';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import DevicesIcon from '@mui/icons-material/Devices';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export const Dashboard = () => {
  // Estado para controlar el modal del mapa
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{title: string, location: string} | null>(null);

  // Función para abrir el modal del mapa con el evento seleccionado
  const handleOpenMapModal = (event: {title: string, location: string}) => {
    setSelectedEvent(event);
    setMapModalOpen(true);
  };

  // Usamos try-catch para manejar el caso cuando el componente se renderiza fuera del contexto de react-admin
  let userName = 'Usuario';
  let isLoadingUser = false;
  
  try {
    // Este código se ejecutará correctamente dentro del contexto de react-admin
    const { data: identity, isLoading } = useGetIdentity();
    isLoadingUser = isLoading;
    if (identity) {
      userName = identity.firstName || identity.username || identity.fullName || 'Usuario';
    }
  } catch (error) {
    // Si hay un error (componente renderizado fuera del contexto de react-admin)
    console.log('Renderizando Dashboard fuera del contexto de react-admin');
  }
  
  if (isLoadingUser) {
    return (
      <Box display="flex" justifyContent="center">
        <Typography variant="h6">Cargando...</Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      <Title title="GEB - Gestión de Eventos y Boletería" />
      
      {/* Barra superior con perfil de usuario y notificaciones */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 3,
          gap: 2
        }}
      >
        <Tooltip title="Notificaciones">
          <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Configuración">
          <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Mi perfil">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'white', borderRadius: 20, p: '4px 12px 4px 4px', boxShadow: 1 }}>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'secondary.main',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight="medium">
              {userName}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
      
      {/* Banner de bienvenida con perfil de usuario */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4,
          background: 'linear-gradient(135deg, #084299 0%, #294fb8 40%, #2e6bd6 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          py: { xs: 4, md: 5 },
          px: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="h2"
                  color="white"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3.2rem' },
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    lineHeight: 1.2
                  }}
                >
                  ¡Bienvenido a EPAA, {userName}!
                </Typography>
                <Typography
                  variant="h6"
                  color="white"
                  sx={{
                    opacity: 0.9,
                    maxWidth: '600px',
                    mt: 1,
                    textShadow: '0 1px 5px rgba(0,0,0,0.2)',
                    fontWeight: 400
                  }}
                >
                  Tu plataforma integral para la gestión de eventos y boletería
                </Typography>
                <Box mt={2}>
                  <Chip 
                    label="Organizador" 
                    color="secondary" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      mr: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                    }} 
                  />
                  <Chip 
                    label="3 eventos activos" 
                    icon={<EventIcon sx={{ color: 'white' }} />} 
                    sx={{ 
                      color: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                    }} 
                  />
                </Box>
              </Box>
            </Grid>

            {/* Estadísticas rápidas */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.15)', 
                      p: 2, 
                      borderRadius: 2,
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Typography variant="h4" color="white" fontWeight="bold">12</Typography>
                    <Typography variant="body2" color="white">Eventos Totales</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.15)', 
                      p: 2, 
                      borderRadius: 2,
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Typography variant="h4" color="white" fontWeight="bold">189</Typography>
                    <Typography variant="body2" color="white">Boletos Vendidos</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      mt: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.15)', 
                      p: 2, 
                      borderRadius: 2,
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Typography variant="h4" color="white" fontWeight="bold">$4,850</Typography>
                    <Typography variant="body2" color="white">Ingresos Totales</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        
        {/* Elementos decorativos mejorados */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: -50, md: 40 },
            top: 30,
            width: 160,
            height: 160,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: { xs: -20, md: 120 },
            bottom: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: { xs: -30, md: 50 },
            bottom: -60,
            width: 180,
            height: 180,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.03)',
          }}
        />
      </Box>     

      
      {/* Cartelera de eventos */}
      <Box mt={6} mb={4}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={600}>
            Cartelera de Eventos
          </Typography>
          <Button 
            variant="contained" 
            endIcon={<EventIcon />}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
            }}
          >
            Ver todos los eventos
          </Button>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              title: 'Festival de Música Electrónica',
              image: 'https://source.unsplash.com/random/300×200/?concert',
              date: '22 Jun 2023',
              location: 'Centro de Convenciones',
              price: '$60 USD'
            },
            {
              title: 'Concierto de Rock Alternativo',
              image: 'https://source.unsplash.com/random/300×200/?rock',
              date: '25 Jun 2023',
              location: 'Teatro Principal',
              price: '$45 USD'
            },
            {
              title: 'Expo Tecnología 2023',
              image: 'https://source.unsplash.com/random/300×200/?technology',
              date: '29 Jun 2023',
              location: 'Centro Exposiciones',
              price: '$65 USD'
            },
            {
              title: 'Feria del Libro',
              image: 'https://source.unsplash.com/random/300×200/?books',
              date: '5 Jul 2023',
              location: 'Biblioteca Nacional',
              price: '$15 USD'
            }
          ].map((event, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.2)'
                  }
                }}
              >                <Box 
                  sx={{ 
                    height: 160, 
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: index === 0 ? '#3f51b5' : 
                                    index === 1 ? '#f44336' :
                                    index === 2 ? '#009688' : '#ff9800',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '30%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 100,
                      height: 100,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1)',
                      transition: 'transform 0.4s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)'
                      }
                    }}
                  >
                    {index === 0 ? <MusicNoteIcon sx={{ fontSize: 60, color: 'white' }} /> :
                     index === 1 ? <LibraryMusicIcon sx={{ fontSize: 60, color: 'white' }} /> :
                     index === 2 ? <DevicesIcon sx={{ fontSize: 60, color: 'white' }} /> :
                     <MenuBookIcon sx={{ fontSize: 60, color: 'white' }} />}
                  </Box>                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      bgcolor: 'rgba(255,255,255,0.85)',
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 5,
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      {event.price}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1, lineHeight: 1.3 }}>
                    {event.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.date}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.location}
                    </Typography>
                  </Box>
                    <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        fullWidth
                        sx={{ borderRadius: 2 }}
                      >
                        Detalles
                      </Button>
                      <Button 
                        variant="contained" 
                        size="small" 
                        fullWidth
                        sx={{ borderRadius: 2 }}
                      >
                        Comprar
                      </Button>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      size="small" 
                      fullWidth
                      startIcon={<LocationOnIcon />}
                      onClick={() => handleOpenMapModal({
                        title: event.title,
                        location: event.location
                      })}
                      sx={{ borderRadius: 2 }}
                    >
                      Cómo llegar
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>      </Box>
      
      {/* Modal del Mapa */}
      {selectedEvent && (
        <MapModal
          open={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          eventTitle={selectedEvent.title}
          eventLocation={selectedEvent.location}
        />
      )}
    </Box>
  );
};

export default Dashboard;

import { 
  Box, 
  Card, 
  Typography,  
  Container, 
  Button, 
  Chip,
  Stack
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authProvider } from '../providers/auth.provider';
import { jwtDecode } from 'jwt-decode';
import MapModal from './mapa/MapModal';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import DevicesIcon from '@mui/icons-material/Devices';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { EventList } from './events/EventList';

export const Dashboard = () => {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{title: string, location: string} | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const navigate = useNavigate();
  const storedAuth = localStorage.getItem('auth');
  const authData = storedAuth ? JSON.parse(storedAuth) : null;

  useEffect(() => {
    try {
      if (storedAuth) {
        console.log(authData);
        if (authData.token) {
          const decoded: any = jwtDecode(authData.token);
          const now = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < now) {
            handleLogout();
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener datos de autenticación:', error);
      handleLogout();
    }
  }, []);

  const handleLogout = async () => {
    await authProvider.logout({});
    localStorage.removeItem('auth');
    navigate('/login', { replace: true });
  };

  const handleOpenMapModal = (event: {title: string, location: string}) => {
    setSelectedEvent(event);
    setMapModalOpen(true);
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Box sx={{ flex: 2 }}>
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
                  ¡Bienvenido a EPAA, {authData.username}!
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
                  Plataforma para la gestión de eventos y boletería
                </Typography>
                <Box mt={2}>
                  <Chip 
                    label={authData.role}
                    color="secondary" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 'bold',
                      mr: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                    }} 
                  /> {}
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
            </Box>

            {/* Estadísticas rápidas */}
            <Box sx={{ flex: 1 }}>
              <Stack spacing={1}>
                <Box>
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
                </Box>
                <Box>
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
                </Box>
                <Box>
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
                </Box>
              </Stack>
            </Box>
          </Box>
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

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          useFlexGap
          flexWrap="wrap"
        >
          <EventList />
        </Stack>
      </Box>
      
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

import { Box, Card, Typography, Container, Button, Chip, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from 'react-admin';
import { authProvider } from '../providers/auth.provider';
import { jwtDecode } from 'jwt-decode';
import EventIcon from '@mui/icons-material/Event';
import { EventList } from './events/EventList';
import { useTheme } from '@mui/material/styles';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { permissions } = usePermissions();
  const storedAuth = localStorage.getItem('auth');
  const authData = storedAuth ? JSON.parse(storedAuth) : null;

  const theme = useTheme();

  // Verificar si el usuario tiene rol de organizador
  const isOrganizer = permissions === 'organizer';

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

  return (
    <Box sx={{ width: '100%', p: 0 }}>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          mb: 4,
          background: theme.palette.background.paper,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          py: { xs: 4, md: 5 },
          px: { xs: 3, md: 4 },
          filter: 'drop-shadow(0 0 10px #4AFF75)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 2,
            width: '100%',
          }}
        >
          <Box sx={{ flex: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                variant="h2"
                color="text.primary"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3.2rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  lineHeight: 1.2,
                }}
              >
                ¡Bienvenido a EPAA, {authData.username}!
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  opacity: 0.9,
                  maxWidth: '600px',
                  mt: 1,
                  textShadow: '0 1px 5px rgba(0,0,0,0.2)',
                  fontWeight: 400,
                }}
              >
                Plataforma para la gestión de eventos y boletería              </Typography>
              {isOrganizer && (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<EventIcon />}
                    href="/organizer-events"
                    size="medium"
                    sx={{
                      color: theme.palette.primary.contrastText,
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 4,
                      px: 2,
                      py: 0.75,
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: '#777777',
                        color: theme.palette.primary.contrastText, 
                      },
                    }}
                  >
                    Administrar
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Estadísticas rápidas */}
          <Box sx={{ flex: 1 }}>
            <img
              src="/Images/Logo.png"
              alt="Ticket Logo"
              style={{
                width: 180,
                height: 180,
                filter: 'drop-shadow(0 0 10px #4AFF75)',
                marginBottom: '16px',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Cartelera de eventos */}
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            width: '100%',
          }}
        >
          <Typography
            variant="h4"
            color="text.primary"
            fontWeight={600}
          >
            Cartelera de Eventos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            endIcon={<EventIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(74, 255, 117, 0.2)',
            }}
          >
            Ver todos los eventos
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            width: '100%',
          }}
        >
          <EventList />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

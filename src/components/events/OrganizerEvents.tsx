import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Tab,
  Tabs,
  Grid,
  Button,
  Chip,
  Container,
  Paper,
  IconButton,
  Fab,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useGetIdentity } from 'react-admin';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { apiAuth } from '../../api/api';
import EventCard from './EventCard';
import type { IEvent } from '../../types/event.type';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`organizer-tabpanel-${index}`}
      aria-labelledby={`organizer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `organizer-tab-${index}`,
    'aria-controls': `organizer-tabpanel-${index}`,
  };
}

const OrganizerEvents: React.FC = () => {
  const theme = useTheme();
  const { data: identity, isLoading } = useGetIdentity();
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const initials = identity ? `${identity?.name?.charAt(0).toUpperCase()}${identity?.lastname?.charAt(0).toUpperCase()}` : 'UN';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchOrganizerEvents = async () => {
    if (!identity?.id) return;
    
    setLoading(true);
    try {
      // Llamada especial al dataprovider para obtener eventos del organizador
      const response = await apiAuth.post('/event-entity/organizer-events', {
        organizerId: identity.id,
        page: 1,
        rowsPage: 50,
      });
      
      if (response.data && response.data.data) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching organizer events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabValue === 1 && identity?.id) {
      fetchOrganizerEvents();
    }
  }, [tabValue, identity?.id]);

  const handleCreateEvent = () => {
    // Aquí puedes navegar a la página de creación de eventos
    // o abrir un modal para crear eventos
    console.log('Crear nuevo evento');
    // navigate('/events/create') o similar
  };

  if (isLoading) {
    return <Box sx={{ p: 3 }}>Cargando...</Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Card de información del administrador/organizador */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.background.paper})`,
          border: `1px solid ${theme.palette.primary.main}40`,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: theme.palette.primary.main,
                fontSize: '2rem',
                fontWeight: 'bold',
                border: `3px solid ${theme.palette.background.paper}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {initials}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                {identity?.name} {identity?.lastname}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  icon={<PersonIcon />}
                  label={identity?.role || 'Organizador'}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<EventAvailableIcon />}
                  label={`${events.length} Eventos`}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    fontWeight: 600,
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {identity?.email || 'email@ejemplo.com'}
                  </Typography>
                </Box>
                
                {identity?.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {identity.phone}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs Container */}
      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="organizer tabs"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                fontWeight: 600,
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem',
              },
            }}
          >
            <Tab
              icon={<DashboardIcon sx={{ mb: 0.5 }} />}
              label="Dashboard"
              {...a11yProps(0)}
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              icon={<EventIcon sx={{ mb: 0.5 }} />}
              label="Mis Eventos"
              {...a11yProps(1)}
              sx={{
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Tab Panel 1 - Dashboard */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <DashboardIcon 
              sx={{ 
                fontSize: 80, 
                color: theme.palette.primary.main, 
                mb: 2,
                opacity: 0.7,
              }} 
            />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              Dashboard del Organizador
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Aquí podrás ver estadísticas y métricas importantes de tus eventos
            </Typography>
          </Box>
        </TabPanel>

        {/* Tab Panel 2 - Mis Eventos */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ position: 'relative' }}>
            {/* Header con botón de crear evento */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3 
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Mis Eventos Creados
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateEvent}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Crear Evento
              </Button>
            </Box>

            {/* Grid de eventos */}
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>Cargando eventos...</Typography>
              </Box>
            ) : events.length > 0 ? (
              <Grid container spacing={3}>
                {events.map((event) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                    <EventCard event={event} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: theme.palette.background.default,
                  borderRadius: 2,
                  border: `2px dashed ${theme.palette.divider}`,
                }}
              >
                <EventIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: theme.palette.text.secondary, 
                    mb: 2,
                    opacity: 0.5,
                  }} 
                />
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ mb: 2 }}
                >
                  No tienes eventos creados aún
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleCreateEvent}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                  }}
                >
                  Crear tu primer evento
                </Button>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="crear evento"
        onClick={handleCreateEvent}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default OrganizerEvents;
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
  Fab,
  Stack,
  Divider,
  LinearProgress,
  IconButton,
  Badge,
  Snackbar,
  Alert,
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { apiAuth } from '../../api/api';
import EventCard from './EventCard';
import CreateEventModal from './CreateEventModal';
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [eventCreatedSnackbar, setEventCreatedSnackbar] = useState(false);

  const initials = identity
    ? `${identity?.name?.charAt(0).toUpperCase()}${identity?.lastname?.charAt(0).toUpperCase()}`
    : 'UN';

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
    setCreateModalOpen(true);
  };

  const handleEventCreated = () => {
    // Mostrar notificación
    setEventCreatedSnackbar(true);

    // Cambiar a la pestaña de eventos si no está ya ahí
    if (tabValue !== 1) {
      setTabValue(1);
    }

    // Recargar la lista de eventos después de crear uno nuevo
    setTimeout(() => {
      fetchOrganizerEvents();
    }, 500);
  };

  const handleEventCreatedSnackbarClose = () => {
    setEventCreatedSnackbar(false);
  };

  // Métricas simuladas - en el futuro vienen de la API
  const metrics = {
    totalEvents: events.length,
    activeEvents: events.filter((e) => e.state === 'active').length,
    totalTicketsSold: 189,
    totalRevenue: 4850,
    averageAttendance: 85,
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress
            sx={{
              width: 200,
              mb: 2,
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
          <Typography color="text.secondary">Cargando dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(74, 255, 117, 0.02) 100%)`,
        pb: 4,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ py: 3 }}
      >
        {/* Header Hero Section */}
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, rgba(74, 255, 117, 0.1) 0%, rgba(74, 255, 117, 0.05) 100%)`,
            border: `1px solid rgba(74, 255, 117, 0.3)`,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(74, 255, 117, 0.1)',
          }}
        >
          {/* Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(74, 255, 117, 0.1) 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(74, 255, 117, 0.08) 0%, transparent 70%)`,
              filter: 'blur(15px)',
            }}
          />

          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    border: `3px solid ${theme.palette.background.paper}`,
                    boxShadow: `0 0 20px rgba(74, 255, 117, 0.4)`,
                    position: 'relative',
                  }}
                >
                  {initials}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -5,
                    right: -5,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    bgcolor: theme.palette.success.main,
                    border: `3px solid ${theme.palette.background.paper}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: theme.palette.background.paper,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    mb: 1,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {identity?.name} {identity?.lastname}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Chip
                    icon={<PersonIcon />}
                    label={identity?.role || 'Organizador'}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 700,
                      px: 1,
                      '& .MuiChip-icon': {
                        color: theme.palette.primary.contrastText,
                      },
                      boxShadow: '0 4px 12px rgba(74, 255, 117, 0.3)',
                    }}
                  />
                  <Chip
                    icon={<EventAvailableIcon />}
                    label={`${metrics.activeEvents} Eventos Activos`}
                    sx={{
                      bgcolor: 'rgba(74, 255, 117, 0.1)',
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      border: `1px solid rgba(74, 255, 117, 0.3)`,
                      '& .MuiChip-icon': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>

                <Stack
                  direction="row"
                  spacing={4}
                  alignItems="center"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      {identity?.email || 'email@ejemplo.com'}
                    </Typography>
                  </Box>

                  {identity?.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        {identity.phone}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(74, 255, 117, 0.1)',
                    border: `1px solid rgba(74, 255, 117, 0.3)`,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: 'rgba(74, 255, 117, 0.2)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: 'rgba(74, 255, 117, 0.1)',
                    border: `1px solid rgba(74, 255, 117, 0.3)`,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: 'rgba(74, 255, 117, 0.2)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Métricas Dashboard */}
        <Grid
          container
          spacing={3}
          sx={{ mb: 4 }}
        >
          {[
            {
              title: 'Eventos Totales',
              value: metrics.totalEvents,
              icon: <EventIcon />,
              change: '+12%',
              color: theme.palette.primary.main,
            },
            {
              title: 'Boletos Vendidos',
              value: metrics.totalTicketsSold,
              icon: <PeopleIcon />,
              change: '+8%',
              color: theme.palette.info.main,
            },
            {
              title: 'Ingresos Totales',
              value: `$${metrics.totalRevenue.toLocaleString()}`,
              icon: <AttachMoneyIcon />,
              change: '+15%',
              color: theme.palette.success.main,
            },
            {
              title: 'Asistencia Promedio',
              value: `${metrics.averageAttendance}%`,
              icon: <TrendingUpIcon />,
              change: '+5%',
              color: theme.palette.warning.main,
            },
          ].map((metric, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
            >
              <Card
                sx={{
                  background: `linear-gradient(135deg, rgba(74, 255, 117, 0.05) 0%, ${theme.palette.background.paper} 100%)`,
                  border: `1px solid rgba(74, 255, 117, 0.2)`,
                  borderRadius: 2,
                  p: 2.5,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(74, 255, 117, 0.15)',
                    border: `1px solid rgba(74, 255, 117, 0.4)`,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${metric.color}20 0%, transparent 70%)`,
                    filter: 'blur(10px)',
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${metric.color}15`,
                      color: metric.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {metric.icon}
                  </Box>
                  <Chip
                    label={metric.change}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(74, 255, 117, 0.1)',
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {metric.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {metric.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs Container */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid rgba(74, 255, 117, 0.2)`,
            background: `linear-gradient(135deg, rgba(74, 255, 117, 0.02) 0%, ${theme.palette.background.paper} 100%)`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              borderBottom: `1px solid rgba(74, 255, 117, 0.2)`,
              background: `linear-gradient(90deg, rgba(74, 255, 117, 0.05) 0%, transparent 100%)`,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="organizer tabs"
              sx={{
                px: 3,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  minHeight: 72,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  boxShadow: `0 0 10px ${theme.palette.primary.main}50`,
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
                    '& .MuiSvgIcon-root': {
                      filter: 'drop-shadow(0 0 4px currentColor)',
                    },
                  },
                }}
              />
              <Tab
                icon={
                  <Badge
                    badgeContent={metrics.totalEvents}
                    color="primary"
                  >
                    <EventIcon sx={{ mb: 0.5 }} />
                  </Badge>
                }
                label="Mis Eventos"
                {...a11yProps(1)}
                sx={{
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                    '& .MuiSvgIcon-root': {
                      filter: 'drop-shadow(0 0 4px currentColor)',
                    },
                  },
                }}
              />
            </Tabs>
          </Box>

          {/* Tab Panel 1 - Dashboard */}
          <TabPanel
            value={tabValue}
            index={0}
          >
            <Box sx={{ textAlign: 'center', py: 12 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  mb: 4,
                }}
              >
                <DashboardIcon
                  sx={{
                    fontSize: 120,
                    color: theme.palette.primary.main,
                    filter: 'drop-shadow(0 0 20px currentColor)',
                    opacity: 0.8,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(74, 255, 117, 0.1) 0%, transparent 70%)`,
                    filter: 'blur(30px)',
                    zIndex: -1,
                  }}
                />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Dashboard del Organizador
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Gestiona tus eventos, visualiza métricas importantes y controla tu negocio desde un solo lugar
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<TrendingUpIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 6px 20px rgba(74, 255, 117, 0.3)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(74, 255, 117, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Ver Analíticas
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleCreateEvent}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      backgroundColor: 'rgba(74, 255, 117, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Crear Evento
                </Button>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab Panel 2 - Mis Eventos */}
          <TabPanel
            value={tabValue}
            index={1}
          >
            <Box sx={{ position: 'relative' }}>
              {/* Header con botón de crear evento */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 4,
                  p: 3,
                  background: `linear-gradient(135deg, rgba(74, 255, 117, 0.05) 0%, transparent 100%)`,
                  borderRadius: 2,
                  border: `1px solid rgba(74, 255, 117, 0.1)`,
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    Mis Eventos Creados
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Gestiona y monitorea todos tus eventos desde aquí
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleCreateEvent}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 6px 20px rgba(74, 255, 117, 0.3)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(74, 255, 117, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Crear Evento
                </Button>
              </Box>

              {/* Grid de eventos */}
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <LinearProgress
                    sx={{
                      width: 300,
                      mx: 'auto',
                      mb: 2,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.primary.main,
                      },
                    }}
                  />
                  <Typography
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Cargando eventos...
                  </Typography>
                </Box>
              ) : events.length > 0 ? (
                <Grid
                  container
                  spacing={3}
                >
                  {events.map((event) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={event.id}
                    >
                      <EventCard event={event} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 12,
                    background: `linear-gradient(135deg, rgba(74, 255, 117, 0.02) 0%, transparent 100%)`,
                    borderRadius: 3,
                    border: `2px dashed rgba(74, 255, 117, 0.3)`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 300,
                      height: 300,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, rgba(74, 255, 117, 0.05) 0%, transparent 70%)`,
                      filter: 'blur(40px)',
                      zIndex: 0,
                    }}
                  />

                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <EventIcon
                      sx={{
                        fontSize: 80,
                        color: theme.palette.primary.main,
                        mb: 3,
                        opacity: 0.7,
                        filter: 'drop-shadow(0 0 10px currentColor)',
                      }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      No tienes eventos creados aún
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
                    >
                      Comienza creando tu primer evento y llega a más personas con nuestra plataforma
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={handleCreateEvent}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 6px 20px rgba(74, 255, 117, 0.3)',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(74, 255, 117, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Crear tu primer evento
                    </Button>
                  </Box>
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
            bottom: 32,
            right: 32,
            width: 64,
            height: 64,
            boxShadow: '0 8px 32px rgba(74, 255, 117, 0.3)',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(74, 255, 117, 0.4)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              zIndex: -1,
              filter: 'blur(4px)',
              opacity: 0.7,
            },
          }}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </Fab>

        {/* Modal de crear evento */}
        <CreateEventModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onEventCreated={handleEventCreated}
        />

        {/* Snackbar de confirmación adicional */}
        <Snackbar
          open={eventCreatedSnackbar}
          autoHideDuration={4000}
          onClose={handleEventCreatedSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleEventCreatedSnackbarClose}
            severity="success"
            variant="filled"
            sx={{
              width: '100%',
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(74, 255, 117, 0.3)',
            }}
          >
            ✅ Tu evento ya está disponible en la plataforma
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default OrganizerEvents;

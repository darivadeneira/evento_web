import { useShowController, ResourceContextProvider } from 'react-admin';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import EventHeader from './information/EventHeader';
import EventDetailsPanel from './information/EventDetailsPanel';
import EventLocationPanel from './information/EventLocationPanel';
import TicketCategoriesPanel from './information/TicketCategoriesPanel';

// Estructura de las categorías de tickets
interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  availableTickets: number;
  start_date?: string;
  end_date?: string;
  event_id: string;
}

const EventDetails = (props: any) => {
  // Obtener id de la URL si viene de ruta personalizada
  const params = useParams();
  const id = props.id || params.id;
  // Forzar resource a 'event-entity' si viene de ruta personalizada
  const resource = props.resource || 'event-entity';
  const controllerProps = useShowController({ id, resource });
  const { record, isLoading } = controllerProps;
  const theme = useTheme();

  // Gestionar cantidades de tickets por categoría usando un objeto
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});

  // Calcular totales
  const calculateTotal = () => {
    if (!record?.ticketCategories) return 0;

    return record.ticketCategories.reduce((total: number, category: TicketCategory) => {
      const quantity = ticketQuantities[category.id] || 0;
      return total + quantity * category.price;
    }, 0);
  };

  // Inicializar las cantidades de tickets cuando se cargan las categorías
  useEffect(() => {
    if (record?.ticketCategories) {
      const initialQuantities: Record<string, number> = {};
      record.ticketCategories.forEach((category: TicketCategory) => {
        initialQuantities[category.id] = 0;
      });
      setTicketQuantities(initialQuantities);
    }
  }, [record?.ticketCategories]);

  // Funciones para incrementar y decrementar tickets
  const incrementTicket = (categoryId: string, maxAvailable: number) => {
    setTicketQuantities((prev) => {
      const current = prev[categoryId] || 0;
      if (current < maxAvailable) {
        return { ...prev, [categoryId]: current + 1 };
      }
      return prev;
    });
  };

  const decrementTicket = (categoryId: string) => {
    setTicketQuantities((prev) => {
      const current = prev[categoryId] || 0;
      if (current > 0) {
        return { ...prev, [categoryId]: current - 1 };
      }
      return prev;
    });
  };

  const APPBAR_HEIGHT = 30; // Ajusta si tu AppBar es más alto

  if (isLoading || !record) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          color="text.secondary"
        >
          Cargando detalles del evento...
        </Typography>
      </Box>
    );
  }

  const { name, date, hour, location, city, description, capacity, state, ticketCategories = [] } = record;
  const coordinates = location?.coordinates;
  const totalAmount = calculateTotal();

  const getEventStatus = (state: string) => {
    if (state === 'active') {
      return { label: 'Activo', color: theme.palette.success.main };
    }
    if (state === 'over') {
      return { label: 'Finalizado', color: theme.palette.error.main };
    }
    if (state === 'in_progress') {
      return { label: 'En Progreso', color: theme.palette.warning.main };
    }
    return { label: state, color: theme.palette.text.secondary };
  };

  const status = getEventStatus(state);
  const content = (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        zIndex: 1200,
        overflow: 'auto',
        pt: { xs: `${APPBAR_HEIGHT + 16}px`, md: `${APPBAR_HEIGHT + 24}px` },
      }}
    >
      <EventHeader name={name} status={status} />
      <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 2 },
            flex: 1,
            minHeight: 0,
            width: '100%',
            overflowX: 'auto',
          }}
        >
          <Paper
            elevation={8}
            sx={{
              flex: { xs: 'none', md: 3 },
              width: { xs: '100%', md: 'auto' },
              maxWidth: { xs: '100%', md: '1200px' },
              minWidth: 0,
              p: 3,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              mb: { xs: 2, md: 0 },
              height: { xs: 'auto', md: '100%' },
            }}
          >
            <Typography variant="h4" fontWeight={600} gutterBottom color="text.primary">
              Detalles del Evento
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <EventDetailsPanel date={date} hour={hour} capacity={capacity} description={description} />
          </Paper>
          <EventLocationPanel city={city} coordinates={coordinates} />
          <TicketCategoriesPanel
            ticketCategories={ticketCategories}
            ticketQuantities={ticketQuantities}
            incrementTicket={incrementTicket}
            decrementTicket={decrementTicket}
            totalAmount={totalAmount}
          />
        </Box>
      </Box>
    </Box>
  );

  // Si viene de ruta personalizada, envolver en ResourceContextProvider
  if (!props.resource) {
    return <ResourceContextProvider value={resource}>{content}</ResourceContextProvider>;
  }
  return content;
};

export default EventDetails;

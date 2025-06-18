import { Card, CardContent, Typography, Chip, Button, Box } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import { DateField } from 'react-admin';
import React from 'react';
import type { IEvent } from '../../types/event.type';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: IEvent;
  admin: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, admin = false }) => {
  const navigate = useNavigate();    
  const getEventStatus = (event: IEvent) => {
    // Considerar evento en progreso si la fecha es hoy y la hora ya pasó pero no ha terminado (simple: 4h de duración)
    if (event.state === 'active') {
      return { label: 'Activo', color: 'default', bg: '#fff', textColor: '#333' };
    }
    if (event.state === 'over') {
      return { label: 'Acabado', color: 'error', bg: '#ff5252', textColor: '#fff' };
    }
    if (event.state === 'in_progress') {
      return { label: 'En progreso', color: 'warning', bg: '#ffe082', textColor: '#333' };
    }
    return { label: event.state, color: 'default', bg: 'rgba(255,255,255,0.9)', textColor: '#333' };
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
      }}
    >
      <Card
        sx={{
          width: '100%',
          minWidth: 340,
          maxWidth: 420,
          minHeight: 340,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box
          sx={{
            height: 200,
            position: 'relative',
            backgroundColor: (theme) => theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h5"
            sx={{ textAlign: 'center', p: 2 }}
          >
            {event.name}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
            }}
          >
            {(() => {
              const status = getEventStatus(event);
              return (
                <Chip
                  label={status.label}
                  size="small"
                  sx={{
                    backgroundColor: status.bg,
                    color: status.textColor,
                    fontWeight: 600,
                  }}
                />
              );
            })()}
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
            >
              {event.description}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarMonthIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              <DateField
                source="date"
                record={event}
              />{' '}
              - {event.hour}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{event.city}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">Capacidad: {event.capacity}</Typography>
          </Box>          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => navigate(`/evento/${event.id}`)}
            >
              Detalles
            </Button>
            {/* {!admin && (
              <Button
                variant="contained"
                size="small"
                fullWidth
                color={event.state === 'active' ? 'primary' : 'inherit'}
                disabled={event.state !== 'active'}
              >
                Comprar
              </Button>
            )} */}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventCard;

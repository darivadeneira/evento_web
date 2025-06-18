import { Box, Typography, Divider } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import { useTheme } from '@mui/material/styles';

interface EventDetailsPanelProps {
  date: string;
  hour: string;
  capacity: number;
  description?: string;
}

const EventDetailsPanel = ({ date, hour, capacity, description }: EventDetailsPanelProps) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CalendarTodayIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>Fecha</Typography>
          <Typography variant="h6" fontWeight={500}>{date}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AccessTimeIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>Hora</Typography>
          <Typography variant="h6" fontWeight={500}>{hour}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PeopleIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>Capacidad</Typography>
          <Typography variant="h6" fontWeight={500}>{capacity} personas</Typography>
        </Box>
      </Box>
      {description && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <InfoIcon sx={{ color: theme.palette.primary.main, fontSize: 28, mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 1 }}>Descripción</Typography>
              <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: '1rem' }}>{description}</Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EventDetailsPanel;

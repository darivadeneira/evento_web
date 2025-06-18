import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface EventHeaderProps {
  name: string;
  status: { label: string; color: string };
}

const EventHeader = ({ name, status }: EventHeaderProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: 4,
        px: 4,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: 2,
        minHeight: { xs: 120, md: 160 },
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <Chip label="Regresar" color="secondary" clickable sx={{ fontWeight: 'bold', px: 2, py: 1 }} />
        </a>
      </Box>
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h2"
          fontWeight={800}
          gutterBottom
          sx={{
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 0,
          }}
        >
          {name}
        </Typography>
        <Chip
          label={status.label}
          sx={{
            bgcolor: status.color,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
            py: 1,
            px: 2,
          }}
        />
      </Box>
    </Box>
  );
};

export default EventHeader;

import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface EventHeaderProps {
  name: string;
  status: { label: string; color: string };
}

const EventHeader = ({ name, status }: EventHeaderProps) => {
  const theme = useTheme();
  return (    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        mb: 0,
        background: theme.palette.background.paper,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        py: { xs: 4, md: 5 },
        px: { xs: 3, md: 4 },        // Bordes verdes con luminosidad reducida usando colores del tema
        border: `1px solid ${theme.custom.greenBorder}`,
        filter: `drop-shadow(0 0 8px ${theme.custom.greenGlow})`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -1,
          left: -1,
          right: -1,
          bottom: -1,
          background: `linear-gradient(45deg, ${theme.custom.greenGradient.start}, ${theme.custom.greenGradient.end})`,
          borderRadius: 'inherit',
          zIndex: -1,
          filter: 'blur(2px)',
        },
      }}
    ><Box
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
              {name}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={status.label}
                sx={{
                  bgcolor: status.color,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <a href="/" style={{ textDecoration: 'none' }}>
              <Chip 
                label="← Regresar" 
                color="secondary" 
                clickable 
                sx={{ 
                  fontWeight: 'bold', 
                  px: 2, 
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                  }
                }} 
              />
            </a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EventHeader;

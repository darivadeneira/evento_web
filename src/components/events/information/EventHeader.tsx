import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getEventCategoryImage } from '../../../utils/categoryImages';

interface EventHeaderProps {
  name: string;
  status: { label: string; color: string };
  event?: any; // Agregamos el evento completo para obtener las categorías
}

const EventHeader = ({ name, status, event }: EventHeaderProps) => {
  const theme = useTheme();
  
  // Obtener la imagen de fondo según la categoría del evento
  const backgroundImage = event ? getEventCategoryImage(event) : null;
  
  return (    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden', // Cambiar a hidden para que funcione el background
        mb: 0,
        background: backgroundImage 
          ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${backgroundImage})`
          : theme.palette.background.paper,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        py: { xs: 3, md: 5 }, // Reducir padding vertical en móvil
        px: { xs: 2, md: 4 }, // Reducir padding horizontal en móvil
        mx: { xs: 1, md: 0 }, // Agregar margen horizontal en móvil
        // Bordes verdes con luminosidad reducida usando colores del tema
        border: `1px solid ${theme.custom.greenBorder}`,
        filter: `drop-shadow(0 0 8px ${theme.custom.greenGlow})`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -1,
          left: -1,
          right: -1,
          bottom: -1,
          background: backgroundImage 
            ? 'transparent' 
            : `linear-gradient(45deg, ${theme.custom.greenGradient.start}, ${theme.custom.greenGradient.end})`,
          borderRadius: 'inherit',
          zIndex: -1,
          filter: 'blur(2px)',
        },
      }}
    >      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 1.5, md: 2 }, // Reducir gap en móvil
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          minHeight: { xs: 'auto', md: 'auto' }, // Asegurar altura mínima
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3.2rem' }, // Mejor escalado responsive
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            lineHeight: 1.2,
            mb: { xs: 0.5, md: 0 }, // Pequeño margen bottom en móvil
            color: backgroundImage ? 'white' : 'text.primary', // Texto blanco sobre imagen
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
            fontSize: { xs: '0.8rem', md: '0.9rem' }, // Responsive font size
            py: { xs: 0.75, md: 1 }, // Menos padding en móvil
            px: { xs: 1.5, md: 2 }, // Menos padding horizontal en móvil
            borderRadius: 2,
            minWidth: 'fit-content', // Se ajusta al contenido
            whiteSpace: 'nowrap', // Evita que el texto se corte
          }}
        />
        
        {/* Botón regresar posicionado absolutamente */}
        <Box sx={{ 
          position: 'absolute', 
          top: { xs: -12, md: -16 }, // Ajustar posición en móvil
          right: { xs: -8, md: -16 }, // Ajustar posición en móvil
          zIndex: 10, // Asegurar que esté por encima
        }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <Chip 
              label="← Regresar" 
              color="secondary" 
              clickable 
              sx={{ 
                fontWeight: 'bold', 
                px: { xs: 1.5, md: 2 }, // Menos padding en móvil
                py: { xs: 0.5, md: 1 }, // Menos padding en móvil
                fontSize: { xs: '0.75rem', md: '0.875rem' }, // Más pequeño en móvil
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                }
              }} 
            />
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default EventHeader;

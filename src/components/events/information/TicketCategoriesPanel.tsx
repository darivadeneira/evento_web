import { Paper, Typography, Divider, Box, Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import PurchaseModal from '../payment/PurchaseModal';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description?: string;
  availableTickets: number;
  start_date?: string;
  end_date?: string;
  event_id: string;
}

interface TicketCategoriesPanelProps {
  ticketCategories: TicketCategory[];
  ticketQuantities: Record<string, number>;
  incrementTicket: (categoryId: string, maxAvailable: number) => void;
  decrementTicket: (categoryId: string) => void;
  totalAmount: number;
  eventId: string;
  eventName: string;
}

const TicketCategoriesPanel = ({ ticketCategories, ticketQuantities, incrementTicket, decrementTicket, totalAmount, eventId, eventName }: TicketCategoriesPanelProps) => {
  const theme = useTheme();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const handlePurchaseClick = () => {
    setPurchaseModalOpen(true);
  };

  const handlePurchaseComplete = () => {
    // Mostrar notificación de éxito
    setSuccessSnackbarOpen(true);
    // Aquí puedes agregar lógica adicional después de una compra exitosa
    // como recargar los datos del evento
    console.log('Compra completada exitosamente');
  };

  const handleSuccessSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
  };
  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 3,
        p: 3,
        bgcolor: 'background.paper',
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: { xs: '100%', md: 420 },
        minWidth: 320,
        maxWidth: 440,
        flexShrink: 1,
        height: 'fit-content',
        justifyContent: 'flex-start',
        alignSelf: { xs: 'auto', md: 'flex-start' },
      }}
    >
      <Typography variant="h4" fontWeight={600} gutterBottom color="text.primary" sx={{ mb: 1, textAlign: 'center', width: '100%' }}>
        Categorías de Entradas
      </Typography>
      <Divider sx={{ mb: 2, width: '100%' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {ticketCategories && ticketCategories.length > 0 ? (
          ticketCategories.map((category: TicketCategory) => (
            <Box key={category.id} sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 1.5, borderRadius: 2, bgcolor: 'background.default', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Chip label={category.name} sx={{ minWidth: 90, fontSize: '1rem', height: 32, bgcolor: theme.palette.primary.main, color: 'white' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${category.price}</Typography>
              </Box>
              {category.description && (
                <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: 'text.secondary' }}>{category.description}</Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EventSeatIcon fontSize="small" color="primary" />
                  <Typography variant="body2">{category.availableTickets} disponibles</Typography>
                </Box>
                {category.start_date && category.end_date && (
                  <Tooltip title={`Válido: ${category.start_date} - ${category.end_date}`}>
                    <DateRangeIcon fontSize="small" color="action" />
                  </Tooltip>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                <IconButton onClick={() => decrementTicket(category.id)} color="primary" size="small" sx={{ bgcolor: 'action.hover' }}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>{ticketQuantities[category.id] || 0}</Typography>
                <IconButton onClick={() => incrementTicket(category.id, category.availableTickets)} color="primary" size="small" sx={{ bgcolor: 'action.hover' }} disabled={ticketQuantities[category.id] >= category.availableTickets}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            No hay categorías de entradas disponibles
          </Typography>
        )}
      </Box>
      <Box sx={{ width: '100%', mt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h5" fontWeight="bold" color="primary">${totalAmount.toFixed(2)}</Typography>
        </Box>
        <Chip
          icon={<ShoppingCartIcon />}
          label={totalAmount > 0 ? "Comprar boletos" : "Selecciona entradas"}
          color="primary"
          sx={{ fontWeight: 'bold', fontSize: '1.1rem', px: 3, py: 2, borderRadius: 2, boxShadow: 2, width: '100%' }}
          clickable={totalAmount > 0}
          disabled={totalAmount <= 0}
          onClick={handlePurchaseClick}
        />
      </Box>

      {/* Modal de compra */}
      <PurchaseModal
        open={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        onPurchaseComplete={handlePurchaseComplete}
        eventId={eventId}
        eventName={eventName}
        ticketCategories={ticketCategories}
        ticketQuantities={ticketQuantities}
        totalAmount={totalAmount}
      />

      {/* Snackbar de éxito */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSuccessSnackbarClose}
          severity="success"
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              fontSize: 24,
            },
          }}
          icon={<CheckCircleIcon />}
        >
          🎉 ¡Compra exitosa! Recibirás un email con los detalles de tu compra.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TicketCategoriesPanel;

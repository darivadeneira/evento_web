import { Paper, Typography, Divider, Box, Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useRefresh } from 'react-admin';
import PurchaseModal from '../payment/PurchaseModal';
import socket from '../../../websocket/socket';

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

interface IStockChangeItem {
  ticketCategoryId: string;
  available: number;
}

interface IStockChange {
  eventId: number;
  stockChange: IStockChangeItem[];
}

interface TicketCategoriesPanelProps {
  ticketCategories: TicketCategory[];
  ticketQuantities: Record<string, number>;
  incrementTicket: (categoryId: string, maxAvailable: number) => void;
  decrementTicket: (categoryId: string) => void;
  resetTicketQuantities: () => void;
  totalAmount: number;
  eventId: string;
  eventName: string;
}

const TicketCategoriesPanel = ({ ticketCategories, ticketQuantities, incrementTicket, decrementTicket, resetTicketQuantities, totalAmount, eventId, eventName }: TicketCategoriesPanelProps) => {
  const theme = useTheme();
  const refresh = useRefresh();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  // Estado para los tickets disponibles por categoría
  const [availableTicketsState, setAvailableTicketsState] = useState<Record<string, number>>({});

  // Inicializar el estado de tickets disponibles al montar/cambiar ticketCategories
  useEffect(() => {
    const initialAvailable: Record<string, number> = {};
    ticketCategories.forEach((cat) => {
      initialAvailable[cat.id] = cat.availableTickets;
    });
    setAvailableTicketsState(initialAvailable);

    // Escuchar evento stockChange por websocket
    const handleStockChange = (data: { eventId: number; stockChange: { ticketCategoryId: string | number; available: number }[] }) => {
      if (parseInt(eventId) === data.eventId) {
        setAvailableTicketsState((prev) => {
          const updated = { ...prev };
          data.stockChange.forEach((item) => {
            updated[item.ticketCategoryId.toString()] = item.available;
          });
          return updated;
        });
      }
    };
    socket.on('stockChange', handleStockChange);
    return () => {
      socket.off('stockChange', handleStockChange);
    };
  }, [ticketCategories, eventId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (purchaseModalOpen) {
        handleCancelPurchase();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [purchaseModalOpen]);

  const handleIncrementTicket = (categoryId: string, maxAvailable: number) => {
    const selected = ticketQuantities[categoryId] || 0;
    const available = availableTicketsState[categoryId] ?? maxAvailable;

    if ((available - selected) > 0) {
      incrementTicket(categoryId, maxAvailable);
    }
  };

  const handleDecrementTicket = (categoryId: string) => {
    if ((ticketQuantities[categoryId] || 0) > 0) {
      decrementTicket(categoryId);
    }
  };


  const handlePurchaseClick = () => {
    setPurchaseModalOpen(true);

    let notifyStockChange: IStockChange = {
      eventId: parseInt(eventId),
      stockChange: []
    };

    ticketCategories.forEach((category: TicketCategory) => {
      const available = availableTicketsState[category.id];
      const ticketSelected = ticketQuantities[category.id] || 0;
      if (ticketSelected > 0) {
        notifyStockChange.stockChange.push({
          ticketCategoryId: category.id,
          available: available - ticketSelected,
        });
      }
    });

    console.log("Stock change to notify:", notifyStockChange);
    socket.emit('notifyStockChange', notifyStockChange);
  };

  const handleCancelPurchase = () => {
    let notifyStockChange: IStockChange = {
      eventId: parseInt(eventId),
      stockChange: []
    };

    setAvailableTicketsState((prev) => {
      const updated: Record<string, number> = { ...prev };

      ticketCategories.forEach((category) => {
        const selected = ticketQuantities[category.id] || 0;
        const newAvailable = (updated[category.id] ?? category.availableTickets) + selected;

        updated[category.id] = newAvailable;

        if (selected > 0) {
          notifyStockChange.stockChange.push({
            ticketCategoryId: category.id,
            available: newAvailable,
          });
        }
      });

      return updated;
    });

    socket.emit('notifyStockChange', notifyStockChange);
    resetTicketQuantities();
    setPurchaseModalOpen(false);
  };


  const handlePurchaseComplete = () => {
    // Resetear las cantidades seleccionadas
    resetTicketQuantities();
    
    // Cerrar el modal de compra
    setPurchaseModalOpen(false);
    
    // Mostrar notificación de éxito
    setSuccessSnackbarOpen(true);
    
    // Aplicar refresh de React Admin para recargar todos los datos
    refresh();
    
    console.log('Compra completada exitosamente - refresh aplicado');
    
    // Nota: No necesitamos actualizar availableTicketsState aquí porque:
    // 1. Ya lo actualizamos cuando abrimos el modal (handlePurchaseClick)
    // 2. El websocket se encarga de mantener sincronizados otros clientes
    // 3. El refresh() recargará todos los datos de la página
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
                  <Typography variant="body2">
                    {(availableTicketsState[category.id] ?? category.availableTickets) - (ticketQuantities[category.id] || 0)} disponibles
                  </Typography>
                </Box>
                {category.start_date && category.end_date && (
                  <Tooltip title={`Válido: ${category.start_date} - ${category.end_date}`}>
                    <DateRangeIcon fontSize="small" color="action" />
                  </Tooltip>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                <IconButton onClick={() => handleDecrementTicket(category.id)} color="primary" size="small" sx={{ bgcolor: 'action.hover' }} disabled={(ticketQuantities[category.id] || 0) === 0}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>{ticketQuantities[category.id] || 0}</Typography>
                <IconButton onClick={() => handleIncrementTicket(category.id, category.availableTickets)} color="primary" size="small" sx={{ bgcolor: 'action.hover' }}
                  disabled={
                    ((availableTicketsState[category.id] ?? category.availableTickets) - (ticketQuantities[category.id] || 0)) <= 0
                  }
                >
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
        onClose={handleCancelPurchase}
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

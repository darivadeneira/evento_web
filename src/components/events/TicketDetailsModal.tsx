import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid2,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { DateField } from 'react-admin';
import type { IUserTransaction } from '../../types/transaction.type';

interface TicketDetailsModalProps {
  open: boolean;
  onClose: () => void;
  transaction: IUserTransaction;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  open,
  onClose,
  transaction,
}) => {
  const getTicketStatus = (state: string) => {
    switch (state) {
      case 'ACTIVE':
        return { label: 'Activo', color: 'success', bg: '#4caf50', textColor: '#fff' };
      case 'USED':
        return { label: 'Usado', color: 'info', bg: '#2196f3', textColor: '#fff' };
      case 'PENDING':
        return { label: 'Pendiente', color: 'warning', bg: '#ff9800', textColor: '#fff' };
      case 'CANCELLED':
        return { label: 'Cancelado', color: 'error', bg: '#f44336', textColor: '#fff' };
      default:
        return { label: state, color: 'default', bg: '#9e9e9e', textColor: '#fff' };
    }
  };

  const handleDownloadQR = (ticket: any, index: number) => {
    // Crear un enlace para descargar la imagen QR
    const link = document.createElement('a');
    link.href = ticket.qrCode;
    const categoryName = ticket.ticketCategory?.name || `ticket-${index + 1}`;
    const eventName = transaction.eventInfo.name.replace(/[^a-zA-Z0-9]/g, '-');
    link.download = `${eventName}-${categoryName}-${ticket.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            🎫 Tickets - {transaction.eventInfo.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {transaction.tickets.length} ticket{transaction.tickets.length > 1 ? 's' : ''} comprado{transaction.tickets.length > 1 ? 's' : ''}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Información del evento */}
        <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              📅 Información del Evento
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonthIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    <DateField
                      source="date"
                      record={transaction.eventInfo}
                    />{' '}
                    - {transaction.eventInfo.hour}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{transaction.eventInfo.city}</Typography>
                </Box>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Total Pagado:</strong> ${transaction.totalAmount}
                </Typography>
                <Typography variant="body2">
                  <strong>Método de Pago:</strong> {transaction.paymentMethod}
                </Typography>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        {/* Lista de tickets */}
        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ConfirmationNumberIcon sx={{ mr: 1 }} />
          Tus Tickets
        </Typography>

        <Grid2 container spacing={2}>
          {transaction.tickets.map((ticket, index) => {
            const status = getTicketStatus(ticket.state);
            return (
              <Grid2 size={{ xs: 12, sm: 6 }} key={ticket.id}>
                <Card 
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                          Ticket #{index + 1}
                        </Typography>
                        {ticket.ticketCategory && (
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                            {ticket.ticketCategory.name} - ${ticket.ticketCategory.price}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          backgroundColor: status.bg,
                          color: status.textColor,
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* QR Code */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      {ticket.qrCode ? (
                        <Box>
                          <img
                            src={ticket.qrCode}
                            alt={`QR Code ${ticket.ticketCategory ? ticket.ticketCategory.name : `Ticket ${index + 1}`}`}
                            style={{
                              width: '150px',
                              height: '150px',
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                            }}
                          />
                          <Box sx={{ mt: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<QrCodeIcon />}
                              onClick={() => handleDownloadQR(ticket, index)}
                            >
                              Descargar QR
                            </Button>
                            
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            QR no disponible
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    
                  </CardContent>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1, color: 'info.contrastText' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            📱 Instrucciones:
          </Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 0 }}>
            <li>Presenta tu código QR en el evento (digital o impreso)</li>
            <li>Llega con 30 minutos de anticipación</li>
            <li>Cada ticket es único e intransferible</li>
            <li>Mantén tus tickets seguros hasta el día del evento</li>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketDetailsModal;

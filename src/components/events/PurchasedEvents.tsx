import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid2,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { DateField } from 'react-admin';
import { transactionProvider } from '../../providers/transaction.provider';
import type { IUserTransaction } from '../../types/transaction.type';
import TicketDetailsModal from './TicketDetailsModal';
import { getEventCategoryImage } from '../../utils/categoryImages';

const PurchasedEvents: React.FC = () => {
  const [transactions, setTransactions] = useState<IUserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<IUserTransaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPurchasedEvents();
  }, []);

  const fetchPurchasedEvents = async () => {
    try {
      setLoading(true);
      const response = await transactionProvider.getList('transactions', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'DESC' },
        filter: {},
      });
      setTransactions(response.data as IUserTransaction[]);
    } catch (error) {
      console.error('Error fetching purchased events:', error);
      setError('No se pudieron cargar tus eventos comprados');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTickets = (transaction: IUserTransaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const getTransactionStatus = (state: string) => {
    switch (state) {
      case 'CONFIRMED':
        return { label: 'Confirmado', color: 'success', bg: '#4caf50', textColor: '#fff' };
      case 'PENDING':
        return { label: 'Pendiente', color: 'warning', bg: '#ff9800', textColor: '#fff' };
      case 'CANCELLED':
        return { label: 'Cancelado', color: 'error', bg: '#f44336', textColor: '#fff' };
      default:
        return { label: state, color: 'default', bg: '#9e9e9e', textColor: '#fff' };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        🎫 Mis Eventos Comprados
      </Typography>

      {transactions.length === 0 ? (
        <Alert severity="info" sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">No has comprado ningún evento aún</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            ¡Explora nuestros eventos disponibles y compra tus entradas!
          </Typography>
        </Alert>
      ) : (
        <Grid2 container spacing={3}>
          {transactions.map((transaction) => {
        
            let backgroundImage = '';
            if (transaction.eventInfo?.categoryManages && transaction.eventInfo.categoryManages.length > 0) {
              backgroundImage = getEventCategoryImage(transaction.eventInfo);
            } 
        
            else if (transaction.tickets && transaction.tickets.length > 0) {
              const ticketWithCategory = transaction.tickets.find(ticket => ticket.ticketCategory);
              
              if (ticketWithCategory && ticketWithCategory.ticketCategory) {
                const eventForImage = {
                  categoryManages: [{
                    eventCategory: {
                      name: ticketWithCategory.ticketCategory.name
                    }
                  }]
                };
                backgroundImage = getEventCategoryImage(eventForImage);
              } else {
                backgroundImage = getEventCategoryImage({});
              }
            } else {
              backgroundImage = getEventCategoryImage({});
            }

            return (
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={transaction.id}>
              <Card
                sx={{
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
                    height: 180,
                    position: 'relative',
                    background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    overflow: 'hidden',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      textAlign: 'center', 
                      p: 2,
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                      fontWeight: 600
                    }}
                  >
                    {transaction.eventInfo.name}
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'flex',
                      gap: 1,
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}
                  >
                    {(() => {
                      const status = getTransactionStatus(transaction.transactionState);
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
                    <Chip
                      icon={<ConfirmationNumberIcon />}
                      label={`${transaction.tickets.length} ticket${transaction.tickets.length > 1 ? 's' : ''}`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {transaction.eventInfo.description}
                    </Typography>
                  </Box>

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

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">Total pagado: ${transaction.totalAmount}</Typography>
                  </Box>

                  {transaction.tickets && transaction.tickets.length > 0 && transaction.tickets[0].ticketCategory && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ConfirmationNumberIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2">
                          <strong>Categorías:</strong>
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {/* Mostrar categorías únicas */}
                          {Array.from(new Set(transaction.tickets
                            .filter(t => t.ticketCategory)
                            .map(t => `${t.ticketCategory!.name} ($${t.ticketCategory!.price})`)))
                            .map((categoryInfo, idx) => (
                              <Chip
                                key={idx}
                                label={categoryInfo}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))
                          }
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* Mantener la información original si no hay categorías */}
                  {(!transaction.tickets || transaction.tickets.length === 0 || !transaction.tickets[0].ticketCategory) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ConfirmationNumberIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        Categoría: {transaction.tickets?.[0]?.ticketCategoryId || 'No disponible'}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<ConfirmationNumberIcon />}
                      onClick={() => handleViewTickets(transaction)}
                      disabled={transaction.transactionState !== 'CONFIRMED'}
                    >
                      Ver Tickets
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
            );
          })}
        </Grid2>
      )}

      {/* Modal para mostrar detalles de tickets */}
      {selectedTransaction && (
        <TicketDetailsModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
        />
      )}
    </Container>
  );
};

export default PurchasedEvents;

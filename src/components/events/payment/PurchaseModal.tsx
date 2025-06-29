import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Grid2,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { apiAuth } from '../../../api/api';

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

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
  eventId: string;
  eventName: string;
  ticketCategories: TicketCategory[];
  ticketQuantities: Record<string, number>;
  totalAmount: number;
}

interface PurchaseFormData {
  ownerEmail: string;
  ownerName: string;
  ownerLastname: string;
  ownerCi: string;
  paymentMethod: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'PAYPAL';
}

interface PurchaseTicketData {
  ticketCategoryId: string;
  quantity: number;
}

const initialFormData: PurchaseFormData = {
  ownerEmail: '',
  ownerName: '',
  ownerLastname: '',
  ownerCi: '',
  paymentMethod: 'transaccion_bancaria',
};

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  onClose,
  onPurchaseComplete,
  eventId,
  eventName,
  ticketCategories,
  ticketQuantities,
  totalAmount,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<PurchaseFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<PurchaseFormData>>({});

  // Obtener solo las categorías con cantidad > 0
  const selectedTickets = ticketCategories.filter(
    (category) => ticketQuantities[category.id] > 0
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<PurchaseFormData> = {};
    let isValid = true;

    // Email validation
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'El email es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Email inválido';
      isValid = false;
    }

    // First name validation
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'El nombre es requerido';
      isValid = false;
    } else if (formData.ownerName.trim().length < 2) {
      newErrors.ownerName = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Last name validation
    if (!formData.ownerLastname.trim()) {
      newErrors.ownerLastname = 'El apellido es requerido';
      isValid = false;
    } else if (formData.ownerLastname.trim().length < 2) {
      newErrors.ownerLastname = 'El apellido debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Cedula validation
    if (!formData.ownerCi.trim()) {
      newErrors.ownerCi = 'La cédula es requerida';
      isValid = false;
    } else if (!/^\d{8,12}$/.test(formData.ownerCi.trim())) {
      newErrors.ownerCi = 'La cédula debe tener entre 8 y 12 dígitos';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof PurchaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Por favor, corrija los errores en el formulario');
      return;
    }

    if (selectedTickets.length === 0) {
      setError('Debe seleccionar al menos una entrada');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar datos de los tickets
      const purchaseTickets: PurchaseTicketData[] = selectedTickets.map((category) => ({
        ticketCategoryId: category.id,
        quantity: ticketQuantities[category.id],
      }));

      // Datos de la compra
      const purchaseData = {
        eventId: parseInt(eventId),
        ownerEmail: formData.ownerEmail.trim(),
        ownerName: formData.ownerName.trim(),
        ownerLastname: formData.ownerLastname.trim(),
        ownerCi: formData.ownerCi.trim(),
        paymentMethod: formData.paymentMethod,
        ticketCategoryRequests: purchaseTickets,
        totalAmount: totalAmount,
      };

      // Hacer la petición al API
      await apiAuth.post('/transaction', purchaseData);

      // Cerrar modal inmediatamente después de compra exitosa
      onPurchaseComplete();
      onClose();
      handleReset();

    } catch (error: any) {
      console.error('Error processing purchase:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        setError('Error inesperado al procesar la compra');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError('');
    setFormErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid rgba(74, 255, 117, 0.2)`,
            },
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, rgba(74, 255, 117, 0.1) 0%, rgba(74, 255, 117, 0.05) 100%)`,
            borderBottom: `1px solid rgba(74, 255, 117, 0.2)`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ShoppingCartIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Comprar Entradas
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4, backgroundColor: theme.palette.background.paper }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid2 container spacing={3}>
            {/* Resumen del evento */}
            <Grid2 size={12}>
              <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon />
                    Resumen de la Compra
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Evento:</strong> {eventName}
                  </Typography>
                  
                  {/* Lista de entradas seleccionadas */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Entradas seleccionadas:
                    </Typography>
                    {selectedTickets.map((category) => (
                      <Paper key={category.id} sx={{ p: 2, mb: 1, bgcolor: 'background.default' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Chip label={category.name} size="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" display="inline">
                              ${category.price} x {ticketQuantities[category.id]}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="bold">
                            ${(category.price * ticketQuantities[category.id]).toFixed(2)}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Total a Pagar:</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      ${totalAmount.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>

            {/* Información personal */}
            <Grid2 size={12}>
              <Card sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <PersonIcon />
                    Información Personal
                  </Typography>
                  
                  <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                        variant="outlined"
                        error={!!formErrors.ownerEmail}
                        helperText={formErrors.ownerEmail}
                        required
                      />
                    </Grid2>
                    
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange('ownerName', e.target.value)}
                        variant="outlined"
                        error={!!formErrors.ownerName}
                        helperText={formErrors.ownerName}
                        required
                      />
                    </Grid2>
                    
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Apellido"
                        value={formData.ownerLastname}
                        onChange={(e) => handleInputChange('ownerLastname', e.target.value)}
                        variant="outlined"
                        error={!!formErrors.ownerLastname}
                        helperText={formErrors.ownerLastname}
                        required
                      />
                    </Grid2>
                    
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Cédula"
                        value={formData.ownerCi}
                        onChange={(e) => handleInputChange('ownerCi', e.target.value)}
                        variant="outlined"
                        error={!!formErrors.ownerCi}
                        helperText={formErrors.ownerCi}
                        required
                        inputProps={{ maxLength: 12 }}
                      />
                    </Grid2>
                    
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Método de Pago</InputLabel>
                        <Select
                          value={formData.paymentMethod}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          label="Método de Pago"
                          startAdornment={<PaymentIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                        >
                          <MenuItem value="transaccion_bancaria">Transacción Bancaria</MenuItem>
                          <MenuItem value="tarjeta_credito">Tarjeta de Crédito</MenuItem>
                          <MenuItem value="paypal">PayPal</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid2>
                  </Grid2>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: `1px solid rgba(74, 255, 117, 0.2)` }}>
          <Button
            onClick={handleClose}
            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Cancelar
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || selectedTickets.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <ShoppingCartIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              textTransform: 'none',
              fontWeight: 600,
              '&.Mui-disabled': {
                backgroundColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
          >
            {loading ? 'Procesando compra...' : `Comprar por $${totalAmount.toFixed(2)}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PurchaseModal;

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
  Input,
  FormHelperText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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
  voucher: File | null;
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
  paymentMethod: 'BANK_TRANSFER',
  voucher: null,
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
  const selectedTickets = ticketCategories.filter((category) => ticketQuantities[category.id] > 0);

  // Helpers para validaciones avanzadas
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,50}$/;

  const validateEcuadorianCedula = (value: string): boolean => {
    const cedula = value.trim();
    if (!/^\d{10}$/.test(cedula)) return false;
    const province = parseInt(cedula.slice(0, 2), 10);
    if (province < 1 || province > 24) return false;
    const third = parseInt(cedula.charAt(2), 10);
    if (third >= 6) return false;
    const coefficients = [2,1,2,1,2,1,2,1,2];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let prod = parseInt(cedula.charAt(i), 10) * coefficients[i];
      if (prod >= 10) prod -= 9;
      sum += prod;
    }
    const nearestTen = Math.ceil(sum / 10) * 10;
    const checkDigit = (nearestTen - sum) % 10;
    return checkDigit === parseInt(cedula.charAt(9), 10);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PurchaseFormData> = {};

    // Email solo Gmail
    const email = formData.ownerEmail.trim();
    if (!email) newErrors.ownerEmail = 'El email es requerido';
    else if (!gmailRegex.test(email)) newErrors.ownerEmail = 'Solo se acepta correo @gmail.com';

    // Nombres y apellidos
    const name = formData.ownerName.trim();
    if (!name) newErrors.ownerName = 'El nombre es requerido';
    else if (!nameRegex.test(name)) newErrors.ownerName = 'Solo letras (2-50)';

    const lastname = formData.ownerLastname.trim();
    if (!lastname) newErrors.ownerLastname = 'El apellido es requerido';
    else if (!nameRegex.test(lastname)) newErrors.ownerLastname = 'Solo letras (2-50)';

    // Cédula ecuatoriana
    const ci = formData.ownerCi.trim();
    if (!ci) newErrors.ownerCi = 'La cédula es requerida';
    else if (!/^\d{10}$/.test(ci)) newErrors.ownerCi = 'Debe tener 10 dígitos';
    else if (!validateEcuadorianCedula(ci)) newErrors.ownerCi = 'Cédula ecuatoriana no válida';

    if (!formData.voucher) {
      setError('El comprobante de pago es obligatorio');
    }

    const hasErrors = Object.keys(newErrors).length > 0 || !formData.voucher;
    setFormErrors(newErrors);
    return !hasErrors;
  };

  const handleInputChange = (field: keyof PurchaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Solo se permiten archivos de imagen (JPG, PNG, GIF) o PDF');
        return;
      }

      // Validar tamaño de archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no puede ser mayor a 5MB');
        return;
      }

      setFormData((prev) => ({ ...prev, voucher: file }));
      setError(''); // Limpiar error si el archivo es válido
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

    // Obtener ownerId desde localStorage (usuario autenticado)
    let ownerId: number | null = null;
    try {
      const rawAuth = localStorage.getItem('auth');
      if (rawAuth) {
        const parsed = JSON.parse(rawAuth);
        if (parsed && typeof parsed.id === 'number') {
          ownerId = parsed.id;
        }
      }
    } catch (e) {
      // Ignorar error de parseo, se manejará como ausencia de sesión
    }

    if (ownerId === null) {
      setError('No se encontró la sesión del usuario. Inicie sesión nuevamente.');
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
        ownerId, // Nuevo: ID del usuario autenticado
        ownerEmail: formData.ownerEmail.trim(),
        ownerName: formData.ownerName.trim(),
        ownerLastname: formData.ownerLastname.trim(),
        ownerCi: formData.ownerCi.trim(),
        paymentMethod: formData.paymentMethod,
        ticketCategoryRequests: purchaseTickets,
        totalAmount: totalAmount,
      };

      // Hacer la petición al API (siempre con FormData ya que el comprobante es obligatorio)
      const formDataToSend = new FormData();
      formDataToSend.append('voucher', formData.voucher as File);

      const response = await apiAuth.post('/transaction', purchaseData, {});

      const responseData = response.data;

      await apiAuth.patch(`/transaction/${responseData.id}`, formDataToSend, {});

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
          <Typography
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            Comprar Entradas
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4, backgroundColor: theme.palette.background.paper }}>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          <Grid2
            container
            spacing={3}
          >
            {/* Resumen del evento */}
            <Grid2 size={12}>
              <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <ReceiptIcon />
                    Resumen de la Compra
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2 }}
                  >
                    <strong>Evento:</strong> {eventName}
                  </Typography>

                  {/* Lista de entradas seleccionadas */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1 }}
                    >
                      Entradas seleccionadas:
                    </Typography>
                    {selectedTickets.map((category) => (
                      <Paper
                        key={category.id}
                        sx={{ p: 2, mb: 1, bgcolor: 'background.default' }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Chip
                              label={category.name}
                              size="small"
                              color="primary"
                              sx={{ mr: 1 }}
                            />
                            <Typography
                              variant="body2"
                              display="inline"
                            >
                              ${category.price} x {ticketQuantities[category.id]}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                          >
                            ${(category.price * ticketQuantities[category.id]).toFixed(2)}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Total a Pagar:</Typography>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary"
                    >
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
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
                  >
                    <PersonIcon />
                    Información Personal
                  </Typography>

                  <Grid2
                    container
                    spacing={2}
                  >
                    <Grid2 size={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                        variant="outlined"
                        error={!!formErrors.ownerEmail}
                        helperText={formErrors.ownerEmail || 'Dominios permitidos: gmail, hotmail, outlook'}
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
                        helperText={formErrors.ownerName || 'Solo letras y espacios (2-50)'}
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
                        helperText={formErrors.ownerLastname || 'Solo letras y espacios (2-50)'}
                        required
                      />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Cédula"
                        value={formData.ownerCi}
                        onChange={(e) => handleInputChange('ownerCi', e.target.value.replace(/[^0-9]/g, ''))}
                        variant="outlined"
                        error={!!formErrors.ownerCi}
                        helperText={formErrors.ownerCi || '10 dígitos válidos'}
                        required
                        inputProps={{ maxLength: 10 }}
                      />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <FormControl
                        fullWidth
                        variant="outlined"
                        disabled
                      >
                        <InputLabel>Método de Pago</InputLabel>
                        <Select
                          value={formData.paymentMethod}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          label="Método de Pago"
                          startAdornment={<PaymentIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                        >
                          <MenuItem value="BANK_TRANSFER">Transacción Bancaria</MenuItem>
                          <MenuItem value="CREDIT_CARD">Tarjeta de Crédito</MenuItem>
                          <MenuItem value="PAYPAL">PayPal</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid2>

                    <Grid2 size={12}>
                      <Box sx={{ mt: 2 }}>
                        {/* Información de transferencia bancaria con QR */}
                        <Card
                          sx={{
                            mb: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            bgcolor: 'background.default',
                          }}
                        >
                          <CardContent>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}
                            >
                              <AccountBalanceIcon />
                              Datos para Transferencia Bancaria
                            </Typography>

                            <Grid2
                              container
                              spacing={2}
                              alignItems="center"
                            >
                              <Grid2 size={{ xs: 12, md: 8 }}>
                                <Box sx={{ color: 'text.primary' }}>
                                  <Typography
                                    variant="body1"
                                    sx={{ mb: 1 }}
                                  >
                                    <strong>Banco:</strong> Banco Pichincha
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{ mb: 1 }}
                                  >
                                    <strong>Número de Cuenta:</strong> 7701143439
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{ mb: 1 }}
                                  >
                                    <strong>Tipo:</strong> Cuenta de Ahorros
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{ mb: 1 }}
                                  >
                                    <strong>Titular:</strong> EventosBoleteria S.A.
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    sx={{ mt: 2, color: 'primary.main' }}
                                  >
                                    <strong>Monto a transferir: ${totalAmount.toFixed(2)}</strong>
                                  </Typography>
                                </Box>
                              </Grid2>

                              <Grid2
                                size={{ xs: 12, md: 4 }}
                                sx={{ textAlign: 'center' }}
                              >
                                <Box
                                  sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, display: 'inline-block' }}
                                >
                                  <img
                                    src="/Images/QR_pagos.jpg"
                                    alt="QR Code para transferencia"
                                    style={{
                                      width: '120px',
                                      height: '120px',
                                      border: '2px solid #ccc',
                                      borderRadius: '8px',
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
                                  >
                                    <QrCodeIcon
                                      fontSize="small"
                                      sx={{ mr: 0.5 }}
                                    />
                                    Código QR para pago
                                  </Typography>
                                </Box>
                              </Grid2>
                            </Grid2>

                            <Alert
                              severity="info"
                              sx={{ mt: 2 }}
                            >
                              <Typography variant="body2">
                                📱 <strong>Instrucciones:</strong> Realiza la transferencia con los datos mostrados y
                                sube el comprobante a continuación.
                              </Typography>
                            </Alert>
                          </CardContent>
                        </Card>

                        <Typography
                          variant="subtitle2"
                          sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <CloudUploadIcon fontSize="small" />
                          Comprobante de Pago (Obligatorio) *
                        </Typography>
                        {formData.voucher ? (
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 2,
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'success.light',
                                color: 'success.contrastText',
                                borderRadius: 2,
                              }}
                            >
                              <AttachFileIcon fontSize="small" />
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {formData.voucher.name}
                              </Typography>
                            </Paper>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setFormData((prev) => ({ ...prev, voucher: null }))}
                              sx={{ minWidth: 'auto', px: 2 }}
                            >
                              Eliminar
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            component="label"
                            variant="outlined"
                            startIcon={<AttachFileIcon />}
                            sx={{
                              width: '100%',
                              height: 56,
                              borderStyle: 'dashed',
                              borderRadius: 2,
                              textTransform: 'none',
                              bgcolor: 'background.default',
                              border: formData.voucher ? 'default' : `2px dashed ${theme.palette.error.main}`,
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                          >
                            Seleccionar comprobante (JPG, PNG, PDF - Max 5MB) *
                            <Input
                              type="file"
                              onChange={handleFileChange}
                              inputProps={{ accept: 'image/*,application/pdf' }}
                              sx={{ display: 'none' }}
                            />
                          </Button>
                        )}
                        <FormHelperText sx={{ mt: 1, color: 'error.main' }}>
                          * Campo obligatorio: Debes subir el comprobante de la transferencia bancaria para completar tu
                          compra
                        </FormHelperText>
                      </Box>
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
            disabled={loading || selectedTickets.length === 0 || !formData.voucher}
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
            {loading
              ? 'Procesando compra...'
              : !formData.voucher
                ? 'Subir comprobante para continuar'
                : `Comprar por $${totalAmount.toFixed(2)}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PurchaseModal;

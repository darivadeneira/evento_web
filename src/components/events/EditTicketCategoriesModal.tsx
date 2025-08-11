import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Grid2,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { ticketCategoryProvider } from '../../providers/ticketCategory.provider';
import { apiAuth } from '../../api/api';

interface EditTicketCategoriesModalProps {
  open: boolean;
  onClose: () => void;
  onCategoriesUpdated: () => void;
  eventId: number;
}

interface TicketCategory {
  id: number;
  name: string;
  price: string;
  description: string;
  availableTickets: number;
  startDay: string;
  endDate: string;
  eventId: number;
}

interface TicketCategoryFormState {
  id: number;
  name: string;
  price: string;
  description: string;
  availableTickets: string;
  startDay: string;
  endDate: string;
}

interface CategoryErrors {
  name?: string;
  price?: string;
  description?: string;
  availableTickets?: string;
  startDay?: string;
  endDate?: string;
}

const EditTicketCategoriesModal: React.FC<EditTicketCategoriesModalProps> = ({
  open,
  onClose,
  onCategoriesUpdated,
  eventId,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<TicketCategoryFormState[]>([]);
  const [originalCategories, setOriginalCategories] = useState<TicketCategoryFormState[]>([]);
  const [categoryErrors, setCategoryErrors] = useState<Record<number, CategoryErrors>>({});
  const [changedCategories, setChangedCategories] = useState<Set<number>>(new Set());

  // Cargar categorías cuando se abre el modal
  useEffect(() => {
    if (open && eventId) {
      loadTicketCategories();
    }
  }, [open, eventId]);

  const loadTicketCategories = async () => {
    setLoadingCategories(true);
    setError('');

    try {
      const response = await apiAuth.get(`/ticket-category/event/${eventId}`);
      const ticketCategories: TicketCategory[] = response.data || [];

      const formattedCategories = ticketCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        price: cat.price.toString(),
        description: cat.description,
        availableTickets: cat.availableTickets.toString(),
        startDay: cat.startDay,
        endDate: cat.endDate,
      }));

      setCategories(formattedCategories);
      setOriginalCategories(JSON.parse(JSON.stringify(formattedCategories))); // Deep copy
      setChangedCategories(new Set());
      setCategoryErrors({});
    } catch (error: any) {
      console.error('Error loading ticket categories:', error);
      setError('Error al cargar las categorías de boletos.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleCategoryChange = (
    categoryId: number,
    field: keyof Omit<TicketCategoryFormState, 'id'>,
    value: string
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      )
    );

    // Track changes
    const originalCategory = originalCategories.find((cat) => cat.id === categoryId);
    if (originalCategory) {
      const hasChanged = originalCategory[field] !== value;
      setChangedCategories((prev) => {
        const newSet = new Set(prev);
        if (hasChanged) {
          newSet.add(categoryId);
        } else {
          // Check if any other field is different
          const currentCategory = categories.find((cat) => cat.id === categoryId);
          if (currentCategory) {
            const stillChanged = Object.keys(currentCategory).some(
              (key) => key !== 'id' && originalCategory[key as keyof TicketCategoryFormState] !== 
                      currentCategory[key as keyof TicketCategoryFormState]
            );
            if (!stillChanged) {
              newSet.delete(categoryId);
            }
          }
        }
        return newSet;
      });
    }

    // Clear field-specific error
    if (categoryErrors[categoryId]?.[field]) {
      setCategoryErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (newErrors[categoryId]) {
          delete newErrors[categoryId][field];
          if (Object.keys(newErrors[categoryId]).length === 0) {
            delete newErrors[categoryId];
          }
        }
        return newErrors;
      });
    }
  };

  const validateCategories = (): boolean => {
    const newErrors: Record<number, CategoryErrors> = {};
    let isValid = true;

    for (const category of categories) {
      const categoryErrors: CategoryErrors = {};

      // Validar nombre
      if (!category.name.trim()) {
        categoryErrors.name = 'Requerido';
        isValid = false;
      } else if (category.name.trim().length < 3) {
        categoryErrors.name = 'Mínimo 3 caracteres';
        isValid = false;
      } else if (category.name.trim().length > 50) {
        categoryErrors.name = 'Máximo 50 caracteres';
        isValid = false;
      }

      // Validar precio
      if (!category.price && category.price !== '0') {
        categoryErrors.price = 'Requerido';
        isValid = false;
      } else if (isNaN(parseFloat(category.price)) || parseFloat(category.price) < 0) {
        categoryErrors.price = 'Debe ser mayor o igual a 0';
        isValid = false;
      } else if (!/^\d+(\.\d{1,2})?$/.test(category.price)) {
        categoryErrors.price = 'Máximo 2 decimales';
        isValid = false;
      } else if (parseFloat(category.price) > 10000) {
        categoryErrors.price = 'Máximo $10,000';
        isValid = false;
      }

      // Validar boletos disponibles
      if (!category.availableTickets) {
        categoryErrors.availableTickets = 'Requerido';
        isValid = false;
      } else if (isNaN(parseInt(category.availableTickets, 10)) || parseInt(category.availableTickets, 10) <= 0) {
        categoryErrors.availableTickets = 'Debe ser mayor a 0';
        isValid = false;
      }

      // Validar fechas
      if (!category.startDay) {
        categoryErrors.startDay = 'Requerido';
        isValid = false;
      }

      if (!category.endDate) {
        categoryErrors.endDate = 'Requerido';
        isValid = false;
      }

      if (category.startDay && category.endDate && new Date(category.startDay) >= new Date(category.endDate)) {
        categoryErrors.endDate = 'Debe ser posterior al inicio';
        isValid = false;
      }

      if (Object.keys(categoryErrors).length > 0) {
        newErrors[category.id] = categoryErrors;
      }
    }

    setCategoryErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (changedCategories.size === 0) {
      setError('No has realizado ningún cambio en las categorías.');
      return;
    }

    if (!validateCategories()) {
      setError('Por favor, corrige los errores en los campos marcados.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Actualizar solo las categorías que cambiaron
      const updatePromises = Array.from(changedCategories).map(async (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        const original = originalCategories.find((cat) => cat.id === categoryId);
        
        if (!category || !original) return;

        // Construir objeto con solo los campos que cambiaron
        const updateData: any = {};
        
        if (category.name !== original.name) {
          updateData.name = category.name.trim();
        }
        if (category.price !== original.price) {
          // Validar y convertir precio
          const priceStr = category.price.toString().trim();
          
          if (priceStr === '' || priceStr === null || priceStr === undefined) {
            throw new Error(`El precio para la categoría "${category.name}" es requerido`);
          }
          
          const priceValue = parseFloat(priceStr);
          if (isNaN(priceValue) || priceValue < 0) {
            throw new Error(`El precio para la categoría "${category.name}" debe ser un número válido mayor o igual a 0`);
          }
          
          // Enviar como número decimal con precisión de 2 decimales
          updateData.price = parseFloat(priceStr)
        }
        if (category.description !== original.description) {
          updateData.description = category.description.trim();
        }
        if (category.availableTickets !== original.availableTickets) {
          updateData.availableTickets = parseInt(category.availableTickets, 10);
        }
        if (category.startDay !== original.startDay) {
          updateData.startDay = new Date(category.startDay);
        }
        if (category.endDate !== original.endDate) {
          updateData.endDate = new Date(category.endDate);
        }

        if (Object.keys(updateData).length > 0) {
          return ticketCategoryProvider.update('ticket-category', {
            id: categoryId,
            data: updateData,
            previousData: {}, // Required by react-admin interface
          });
        }
      });

      await Promise.all(updatePromises);

      onCategoriesUpdated();
      onClose();
      handleReset();
    } catch (error: any) {
      console.error('Error updating ticket categories:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error inesperado al actualizar las categorías de boletos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCategories([]);
    setOriginalCategories([]);
    setChangedCategories(new Set());
    setCategoryErrors({});
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
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
        <EditIcon sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Editar Categorías de Boletos
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
        {loadingCategories ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {categories.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Este evento no tiene categorías de boletos configuradas.
                </Typography>
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {categories.map((category, index) => (
                  <Card
                    key={category.id}
                    sx={{
                      border: changedCategories.has(category.id) 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      position: 'relative',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                          Categoría {index + 1}
                          {changedCategories.has(category.id) && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ ml: 2, color: 'primary.main', fontWeight: 500 }}
                            >
                              ✨ Modificada
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {category.id}
                        </Typography>
                      </Box>

                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Nombre de la Categoría"
                            value={category.name}
                            onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                            error={!!categoryErrors[category.id]?.name}
                            helperText={categoryErrors[category.id]?.name}
                          />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Precio ($)"
                            type="number"
                            value={category.price}
                            onChange={(e) => handleCategoryChange(category.id, 'price', e.target.value)}
                            error={!!categoryErrors[category.id]?.price}
                            helperText={categoryErrors[category.id]?.price}
                            inputProps={{ step: '0.01', min: '0' }}
                          />
                        </Grid2>

                        <Grid2 size={12}>
                          <TextField
                            fullWidth
                            label="Descripción"
                            multiline
                            rows={2}
                            value={category.description}
                            onChange={(e) => handleCategoryChange(category.id, 'description', e.target.value)}
                          />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Boletos Disponibles"
                            type="number"
                            value={category.availableTickets}
                            onChange={(e) => handleCategoryChange(category.id, 'availableTickets', e.target.value)}
                            error={!!categoryErrors[category.id]?.availableTickets}
                            helperText={categoryErrors[category.id]?.availableTickets}
                            inputProps={{ min: '1' }}
                          />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Fecha de Inicio"
                            type="date"
                            value={category.startDay}
                            onChange={(e) => handleCategoryChange(category.id, 'startDay', e.target.value)}
                            error={!!categoryErrors[category.id]?.startDay}
                            helperText={categoryErrors[category.id]?.startDay}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid2>

                        <Grid2 size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Fecha de Fin"
                            type="date"
                            value={category.endDate}
                            onChange={(e) => handleCategoryChange(category.id, 'endDate', e.target.value)}
                            error={!!categoryErrors[category.id]?.endDate}
                            helperText={categoryErrors[category.id]?.endDate}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid2>
                      </Grid2>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid rgba(74, 255, 117, 0.2)` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box>
            {changedCategories.size > 0 && (
              <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                {changedCategories.size} categoría{changedCategories.size > 1 ? 's' : ''} modificada{changedCategories.size > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={loading || loadingCategories}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading || loadingCategories || changedCategories.size === 0}
              sx={{
                background: 'linear-gradient(135deg, #4AFF75 0%, #39E65C 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #39E65C 0%, #2ECC4F 100%)',
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground,
                },
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketCategoriesModal;
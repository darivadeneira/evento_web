import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Stack,
  LinearProgress,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { apiAuth } from '../../api/api';

export interface EventCategoryMetrics {
  ticketCategoryId: number;
  name?: string;
  price?: number;
  startDay?: string;
  endDate?: string;
  capacity: number;
  requested: number;
  generated: number;
}

export interface EventMetricsResponseDto {
  eventId: number;
  totals: {
    categories: number;
    ticketsCapacity: number;
    ticketsRequested: number;
    ticketsGenerated: number;
    transactions: number;
  };
  byCategory: EventCategoryMetrics[];
}

type Props = {
  open: boolean;
  onClose: () => void;
  eventId: number;
  eventName?: string;
};

export default function EventMetricsModal({ open, onClose, eventId, eventName }: Props) {
  const [metrics, setMetrics] = useState<EventMetricsResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await apiAuth.get(`/events/${eventId}/metrics`);
      setMetrics(resp.data as EventMetricsResponseDto);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al cargar métricas del evento');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && eventId) {
      fetchMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, eventId]);

  const fmt = (n?: number) => (typeof n === 'number' ? n.toLocaleString() : '—');
  const pct = (num: number, den: number) => (den > 0 ? `${Math.round((num / den) * 100)}%` : '—');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Métricas del evento{eventName ? `: ${eventName}` : ''}</DialogTitle>
      <DialogContent dividers>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {metrics && (
          <>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              <Chip
                size="small"
                label={`Categorías: ${fmt(metrics.totals.categories)}`}
              />
              <Chip
                size="small"
                label={`Capacidad: ${fmt(metrics.totals.ticketsCapacity)}`}
              />
              <Chip
                size="small"
                color="primary"
                label={`Solicitados: ${fmt(metrics.totals.ticketsRequested)}`}
              />
              <Chip
                size="small"
                color="success"
                label={`Generados: ${fmt(metrics.totals.ticketsGenerated)}`}
              />
              <Chip
                size="small"
                label={`Transacciones: ${fmt(metrics.totals.transactions)}`}
              />
            </Stack>

            <Paper variant="outlined">
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Capacidad</TableCell>
                      <TableCell align="right">Solicitados</TableCell>
                      <TableCell align="right">Generados</TableCell>
                      <TableCell align="right">% Generado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.byCategory?.map((c) => (
                      <TableRow key={c.ticketCategoryId}>
                        <TableCell>
                          <Box>
                            <Typography fontWeight={600}>{c.name ?? `Cat. ${c.ticketCategoryId}`}</Typography>
                            {(c.startDay || c.endDate) && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {c.startDay ? new Date(c.startDay).toLocaleDateString() : ''}
                                {c.startDay && c.endDate ? ' — ' : ''}
                                {c.endDate ? new Date(c.endDate).toLocaleDateString() : ''}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {typeof c.price === 'number' ? `$${c.price.toFixed(2)}` : '—'}
                        </TableCell>
                        <TableCell align="right">{fmt(c.capacity)}</TableCell>
                        <TableCell align="right">{fmt(c.requested)}</TableCell>
                        <TableCell align="right">{fmt(c.generated)}</TableCell>
                        <TableCell align="right">{pct(c.generated, c.capacity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

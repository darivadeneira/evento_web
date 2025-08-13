import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Chip,
  LinearProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
} from '@mui/material';
import { apiAuth } from '../../api/api';

type TxItem = {
  id: number | string;
  createdAt?: string;
  ownerName?: string;
  ownerLastname?: string;
  ownerEmail?: string;
  ownerCi?: string;
  paymentMethod?: string;
  status?: string;
  totalAmount?: number;
  ticketCategoryRequests?: { quantity?: number }[];
  items?: { quantity?: number }[];
  quantity?: number;
};

type EventMetricsResponseDto = {
  eventId: number;
  totals: {
    categories: number;
    ticketsCapacity: number;
    ticketsRequested: number;
    ticketsGenerated: number;
    transactions: number;
  };
  byCategory: Array<{
    ticketCategoryId: number;
    name?: string;
    price?: number;
    startDay?: string;
    endDate?: string;
    capacity: number;
    requested: number;
    generated: number;
  }>;
};

function sumTickets(tx: TxItem) {
  const a = Array.isArray(tx.ticketCategoryRequests)
    ? tx.ticketCategoryRequests.reduce((s, r) => s + (Number(r.quantity) || 0), 0)
    : 0;
  const b = Array.isArray(tx.items) ? tx.items.reduce((s, r) => s + (Number(r.quantity) || 0), 0) : 0;
  const c = Number(tx.quantity) || 0;
  return Math.max(a, b, c);
}

export default function TransactionsTable({ eventId }: { eventId: number }) {
  const [rows, setRows] = useState<TxItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<EventMetricsResponseDto | null>(null);
  const [error, setError] = useState<string>('');

  const fetchMetrics = async () => {
    try {
      const resp = await apiAuth.get(`/events/${eventId}/metrics`);
      setMetrics(resp.data as EventMetricsResponseDto);
    } catch (e: any) {
      setMetrics(null);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await apiAuth.post('/transaction/paginated', {
        page: page + 1,
        rowsPage: perPage,
        orderBy: 'id',
        order: 'DESC',
        filter: { eventId },
      });
      const items = data?.data ?? [];
      const count = data?.count ?? items.length;
      setRows(
        items.map((it: any) => ({
          id: it.id ?? it._id,
          ...it,
        })),
      );
      setTotal(count);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al cargar transacciones');
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [eventId]);

  useEffect(() => {
    fetchTransactions();
  }, [eventId, page, perPage]);

  const empty = !loading && rows.length === 0;

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, overflow: 'hidden' }}
    >
      {metrics && (
        <Box sx={{ px: 2, py: 1.5, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
          >
            <Chip
              size="small"
              label={`Categorías: ${metrics.totals.categories}`}
            />
            <Chip
              size="small"
              label={`Capacidad: ${metrics.totals.ticketsCapacity}`}
            />
            <Chip
              size="small"
              color="primary"
              label={`Solicitados: ${metrics.totals.ticketsRequested}`}
            />
            <Chip
              size="small"
              color="success"
              label={`Generados: ${metrics.totals.ticketsGenerated}`}
            />
            <Chip
              size="small"
              label={`Transacciones: ${metrics.totals.transactions}`}
            />
          </Stack>
        </Box>
      )}

      {loading && <LinearProgress />}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Comprador</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CI</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Entradas</TableCell>
              <TableCell align="right">Total (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '—'}</TableCell>
                <TableCell>{`${tx.ownerName ?? ''} ${tx.ownerLastname ?? ''}`.trim() || '—'}</TableCell>
                <TableCell>{tx.ownerEmail || '—'}</TableCell>
                <TableCell>{tx.ownerCi || '—'}</TableCell>
                <TableCell>{tx.paymentMethod || '—'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={tx.status || 'PENDIENTE'}
                    color={tx.status === 'APPROVED' ? 'success' : tx.status === 'REJECTED' ? 'error' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  {(function () {
                    return sumTickets(tx);
                  })()}
                </TableCell>
                <TableCell align="right">
                  {typeof tx.totalAmount === 'number' ? tx.totalAmount.toFixed(2) : '—'}
                </TableCell>
              </TableRow>
            ))}
            {empty && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Box sx={{ py: 2, textAlign: 'center' }}>
                    <Typography color="text.secondary">No hay transacciones para este evento</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Box sx={{ py: 1, textAlign: 'center' }}>
                    <Typography color="error">{error}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={perPage}
        onRowsPerPageChange={(e) => {
          setPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}

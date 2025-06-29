export interface IPurchase {
  eventId: number;
  email: string;
  firstName: string;
  lastName: string;
  cedula: string;
  paymentMethod: 'transaccion_bancaria' | 'tarjeta_credito' | 'paypal';
  tickets: IPurchaseTicket[];
  totalAmount: number;
  userId?: number | null;
}

export interface IPurchaseTicket {
  categoryId: string;
  quantity: number;
}

export interface IPurchaseResponse {
  id: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  message: string;
}

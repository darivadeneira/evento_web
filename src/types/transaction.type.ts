export interface ITicketCategory {
  id: number;
  name: string;
  price: number;
  description: string;
  availableTickets: number;
  startDay: string;
  endDate: string | null;
  eventId: number;
}

export interface ITicket {
  id: number;
  qrCode: string;
  qrData: string;
  state: string;
  useDate: Date | null;
  ticketCategoryId: number;
  ticketCategory: ITicketCategory | null;
}

export interface IEventCategory {
  id: number;
  name: string;
  description?: string;
}

export interface ICategoryManage {
  id: number;
  idEventCategory: number;
  idEventEntity: number;
  eventCategory: IEventCategory;
}

export interface IUserTransaction {
  id: number; // transactionId
  transactionId: number;
  eventId: number;
  eventInfo: {
    id: number;
    name: string;
    date: string;
    hour: string;
    latitude: string;
    longitude: string;
    city: string;
    description: string;
    capacity: number;
    state: string;
    userId: number;
    categoryManages?: ICategoryManage[];
  };
  transactionState: string;
  purchaseDate: string;
  totalAmount: string;
  paymentMethod: string;
  tickets: ITicket[];
}

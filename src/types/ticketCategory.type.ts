export interface ITicketCategory {
  name: string;

  price: number;

  description: string;

  availableTickets: number;

  startDay: Date;

  endDate: Date;

  eventId: number;
}

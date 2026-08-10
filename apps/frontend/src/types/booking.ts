export type TicketStatus = 'AVAILABLE' | 'HELD' | 'BOOKED';

export interface Event {
  id: string;
  title: string;
  description: string;
  total_tickets: number;
  available_tickets: number;
  start_time: string;
  end_time: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  seat_number: string;
  price: number;
  status: TicketStatus;
  category: 'VIP' | 'CAT 1' | 'CAT 2';
}

export interface Order {
  id: string;
  user_id: string;
  ticket_id: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';
  amount: number;
  idempotency_key: string;
  created_at: string;
}

export interface BookTicketPayload {
  user_id: string;
  event_id: string;
  ticket_id: string;
  idempotency_key: string;
}

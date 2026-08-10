package domain

import (
	"time"

	"github.com/google/uuid"
)

type TicketStatus string

const (
	TicketStatusAvailable TicketStatus = "AVAILABLE"
	TicketStatusHeld      TicketStatus = "HELD"
	TicketStatusBooked    TicketStatus = "BOOKED"
)

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "PENDING"
	OrderStatusPaid      OrderStatus = "PAID"
	OrderStatusExpired   OrderStatus = "EXPIRED"
	OrderStatusCancelled OrderStatus = "CANCELLED"
)

type Event struct {
	ID               uuid.UUID `json:"id"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	TotalTickets     int       `json:"total_tickets"`
	AvailableTickets int       `json:"available_tickets"`
	StartTime        time.Time `json:"start_time"`
	EndTime          time.Time `json:"end_time"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Ticket struct {
	ID         uuid.UUID    `json:"id"`
	EventID    uuid.UUID    `json:"event_id"`
	SeatNumber string       `json:"seat_number"`
	Price      float64      `json:"price"`
	Status     TicketStatus `json:"status"`
	Version    int          `json:"version"`
	CreatedAt  time.Time    `json:"created_at"`
	UpdatedAt  time.Time    `json:"updated_at"`
}

type Order struct {
	ID             uuid.UUID   `json:"id"`
	UserID         uuid.UUID   `json:"user_id"`
	TicketID       uuid.UUID   `json:"ticket_id"`
	Status         OrderStatus `json:"status"`
	Amount         float64     `json:"amount"`
	IdempotencyKey string      `json:"idempotency_key"`
	CreatedAt      time.Time   `json:"created_at"`
	UpdatedAt      time.Time   `json:"updated_at"`
}

type BookTicketRequest struct {
	UserID         uuid.UUID `json:"user_id" binding:"required"`
	EventID        uuid.UUID `json:"event_id" binding:"required"`
	TicketID       uuid.UUID `json:"ticket_id" binding:"required"`
	IdempotencyKey string    `json:"idempotency_key" binding:"required"`
}

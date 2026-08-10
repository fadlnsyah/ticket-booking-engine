package postgres

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/domain"
)

type BookingRepository interface {
	GetTicketByID(ctx context.Context, ticketID uuid.UUID) (*domain.Ticket, error)
	GetOrderByKey(ctx context.Context, idempotencyKey string) (*domain.Order, error)
	CreateOrderTx(ctx context.Context, order *domain.Order) error
}

type postgresBookingRepository struct {
	db *sql.DB
}

func NewPostgresBookingRepository(db *sql.DB) BookingRepository {
	return &postgresBookingRepository{db: db}
}

func (r *postgresBookingRepository) GetTicketByID(ctx context.Context, ticketID uuid.UUID) (*domain.Ticket, error) {
	query := `
		SELECT id, event_id, seat_number, price, status, version, created_at, updated_at
		FROM tickets WHERE id = $1
	`
	ticket := &domain.Ticket{}
	err := r.db.QueryRowContext(ctx, query, ticketID).Scan(
		&ticket.ID, &ticket.EventID, &ticket.SeatNumber, &ticket.Price,
		&ticket.Status, &ticket.Version, &ticket.CreatedAt, &ticket.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, domain.ErrTicketNotFound
	}
	if err != nil {
		return nil, err
	}
	return ticket, nil
}

func (r *postgresBookingRepository) GetOrderByKey(ctx context.Context, idempotencyKey string) (*domain.Order, error) {
	query := `
		SELECT id, user_id, ticket_id, status, amount, idempotency_key, created_at, updated_at
		FROM orders WHERE idempotency_key = $1
	`
	order := &domain.Order{}
	err := r.db.QueryRowContext(ctx, query, idempotencyKey).Scan(
		&order.ID, &order.UserID, &order.TicketID, &order.Status,
		&order.Amount, &order.IdempotencyKey, &order.CreatedAt, &order.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return order, nil
}

func (r *postgresBookingRepository) CreateOrderTx(ctx context.Context, order *domain.Order) error {
	tx, err := r.db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
	if err != nil {
		return err
	}
	defer tx.Rollback()

	updateTicketQuery := `
		UPDATE tickets
		SET status = 'HELD', version = version + 1, updated_at = NOW()
		WHERE id = $1 AND status = 'AVAILABLE' AND version = $2
	`
	res, err := tx.ExecContext(ctx, updateTicketQuery, order.TicketID, 1)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return domain.ErrTicketUnavailable
	}

	updateEventQuery := `
		UPDATE events
		SET available_tickets = available_tickets - 1, updated_at = NOW()
		WHERE id = (SELECT event_id FROM tickets WHERE id = $1) AND available_tickets > 0
	`
	resEvent, err := tx.ExecContext(ctx, updateEventQuery, order.TicketID)
	if err != nil {
		return err
	}
	eventRows, err := resEvent.RowsAffected()
	if err != nil || eventRows == 0 {
		return domain.ErrSeatSoldOut
	}

	insertOrderQuery := `
		INSERT INTO orders (id, user_id, ticket_id, status, amount, idempotency_key, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
	`
	_, err = tx.ExecContext(ctx, insertOrderQuery,
		order.ID, order.UserID, order.TicketID, order.Status, order.Amount, order.IdempotencyKey,
	)
	if err != nil {
		return fmt.Errorf("failed to insert order: %w", err)
	}

	return tx.Commit()
}

package usecase_test

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/domain"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/usecase"
)

// Mock Locking Repository
type mockLockRepo struct {
	shouldFail bool
}

func (m *mockLockRepo) AcquireLock(ctx context.Context, key string, ttl time.Duration) (string, error) {
	if m.shouldFail {
		return "", domain.ErrLockAcquisition
	}
	return "mock-lock-val", nil
}

func (m *mockLockRepo) ReleaseLock(ctx context.Context, key string, lockVal string) (bool, error) {
	return true, nil
}

// Mock Booking Repository
type mockBookingRepo struct {
	ticket *domain.Ticket
	order  *domain.Order
}

func (m *mockBookingRepo) GetTicketByID(ctx context.Context, ticketID uuid.UUID) (*domain.Ticket, error) {
	if m.ticket == nil {
		return nil, domain.ErrTicketNotFound
	}
	return m.ticket, nil
}

func (m *mockBookingRepo) GetOrderByKey(ctx context.Context, idempotencyKey string) (*domain.Order, error) {
	return m.order, nil
}

func (m *mockBookingRepo) CreateOrderTx(ctx context.Context, order *domain.Order) error {
	m.order = order
	return nil
}

func TestBookingUsecase_LockAcquisitionFailure(t *testing.T) {
	bRepo := &mockBookingRepo{}
	lRepo := &mockLockRepo{shouldFail: true}

	uc := usecase.NewBookingUsecase(bRepo, lRepo)

	req := domain.BookTicketRequest{
		UserID:         uuid.New(),
		EventID:        uuid.New(),
		TicketID:       uuid.New(),
		IdempotencyKey: "test-idempotency-123",
	}

	_, err := uc.BookTicket(context.Background(), req)
	if err != domain.ErrLockAcquisition {
		t.Fatalf("expected ErrLockAcquisition, got %v", err)
	}
}

func TestBookingUsecase_Success(t *testing.T) {
	ticketID := uuid.New()
	bRepo := &mockBookingRepo{
		ticket: &domain.Ticket{
			ID:     ticketID,
			Price:  150.00,
			Status: domain.TicketStatusAvailable,
		},
	}
	lRepo := &mockLockRepo{shouldFail: false}

	uc := usecase.NewBookingUsecase(bRepo, lRepo)

	req := domain.BookTicketRequest{
		UserID:         uuid.New(),
		EventID:        uuid.New(),
		TicketID:       ticketID,
		IdempotencyKey: "test-idempotency-456",
	}

	order, err := uc.BookTicket(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if order == nil || order.TicketID != ticketID {
		t.Fatalf("expected order for ticket %s, got %v", ticketID, order)
	}
}

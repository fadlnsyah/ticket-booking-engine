package usecase

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/domain"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/repository/postgres"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/repository/redis"
)

type BookingUsecase interface {
	BookTicket(ctx context.Context, req domain.BookTicketRequest) (*domain.Order, error)
}

type bookingUsecase struct {
	bookingRepo postgres.BookingRepository
	lockRepo    redis.LockRepository
}

func NewBookingUsecase(bRepo postgres.BookingRepository, lRepo redis.LockRepository) BookingUsecase {
	return &bookingUsecase{
		bookingRepo: bRepo,
		lockRepo:    lRepo,
	}
}

func (u *bookingUsecase) BookTicket(ctx context.Context, req domain.BookTicketRequest) (*domain.Order, error) {
	existingOrder, err := u.bookingRepo.GetOrderByKey(ctx, req.IdempotencyKey)
	if err != nil {
		return nil, err
	}
	if existingOrder != nil {
		return existingOrder, nil
	}

	lockKey := req.TicketID.String()
	lockVal, err := u.lockRepo.AcquireLock(ctx, lockKey, 10*time.Second)
	if err != nil {
		return nil, domain.ErrLockAcquisition
	}
	defer func() {
		_, _ = u.lockRepo.ReleaseLock(context.Background(), lockKey, lockVal)
	}()

	ticket, err := u.bookingRepo.GetTicketByID(ctx, req.TicketID)
	if err != nil {
		return nil, err
	}
	if ticket.Status != domain.TicketStatusAvailable {
		return nil, domain.ErrTicketUnavailable
	}

	order := &domain.Order{
		ID:             uuid.New(),
		UserID:         req.UserID,
		TicketID:       req.TicketID,
		Status:         domain.OrderStatusPending,
		Amount:         ticket.Price,
		IdempotencyKey: req.IdempotencyKey,
	}

	err = u.bookingRepo.CreateOrderTx(ctx, order)
	if err != nil {
		return nil, fmt.Errorf("booking failed: %w", err)
	}

	return order, nil
}

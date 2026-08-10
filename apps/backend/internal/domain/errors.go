package domain

import "errors"

var (
	ErrEventNotFound     = errors.New("event not found")
	ErrTicketNotFound    = errors.New("ticket not found")
	ErrTicketUnavailable = errors.New("ticket is already booked or held by another user")
	ErrSeatSoldOut       = errors.New("all tickets for this event are sold out")
	ErrDuplicateOrder    = errors.New("duplicate booking request (idempotency key already processed)")
	ErrLockAcquisition   = errors.New("failed to acquire distributed lock, please try again")
	ErrOrderNotFound     = errors.New("order not found")
)

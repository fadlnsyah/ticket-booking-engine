package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/domain"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/usecase"
	"github.com/yourname/ticket-booking-engine/apps/backend/pkg/response"
)

type BookingHandler struct {
	usecase usecase.BookingUsecase
}

func NewBookingHandler(u usecase.BookingUsecase) *BookingHandler {
	return &BookingHandler{usecase: u}
}

func (h *BookingHandler) BookTicket(c *gin.Context) {
	var req domain.BookTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request payload", err)
		return
	}

	order, err := h.usecase.BookTicket(c.Request.Context(), req)
	if err != nil {
		switch err {
		case domain.ErrTicketUnavailable, domain.ErrSeatSoldOut:
			response.Error(c, http.StatusConflict, err.Error(), err)
		case domain.ErrLockAcquisition:
			response.Error(c, http.StatusTooManyRequests, err.Error(), err)
		case domain.ErrTicketNotFound:
			response.Error(c, http.StatusNotFound, err.Error(), err)
		default:
			response.Error(c, http.StatusInternalServerError, "Failed to process booking", err)
		}
		return
	}

	response.Success(c, http.StatusCreated, "Ticket booked successfully", order)
}

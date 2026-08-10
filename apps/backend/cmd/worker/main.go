package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/config"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/domain"
	rmqRepo "github.com/yourname/ticket-booking-engine/apps/backend/internal/repository/rabbitmq"
)

func main() {
	cfg := config.LoadConfig()
	log.Printf("[WORKER] Starting ticket order queue worker on %s", cfg.RabbitMQURL)

	conn, err := amqp.Dial(cfg.RabbitMQURL)
	if err != nil {
		log.Fatalf("[WORKER] Failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	queueRepo := rmqRepo.NewRabbitMQRepository(conn)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		err := queueRepo.ConsumeOrderEvents(ctx, func(order *domain.Order) error {
			log.Printf("[WORKER-EVENT] Processing async task for Order ID: %s | Amount: $%.2f | User ID: %s",
				order.ID, order.Amount, order.UserID)
			// Invoice generation & payment gateway notification logic executed here asynchronously
			return nil
		})
		if err != nil {
			log.Printf("[WORKER-ERROR] Error listening queue: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[WORKER] Stopping worker gracefully...")
}

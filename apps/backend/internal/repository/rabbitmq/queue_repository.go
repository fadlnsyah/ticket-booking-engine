package rabbitmq

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/domain"
)

const QueueOrderCreated = "order_created_queue"

type QueueRepository interface {
	PublishOrderEvent(ctx context.Context, order *domain.Order) error
	ConsumeOrderEvents(ctx context.Context, handler func(order *domain.Order) error) error
}

type rabbitMQRepository struct {
	conn *amqp.Connection
}

func NewRabbitMQRepository(conn *amqp.Connection) QueueRepository {
	return &rabbitMQRepository{conn: conn}
}

func (r *rabbitMQRepository) PublishOrderEvent(ctx context.Context, order *domain.Order) error {
	ch, err := r.conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open channel: %w", err)
	}
	defer ch.Close()

	_, err = ch.QueueDeclare(
		QueueOrderCreated,
		true,  // durable
		false, // auto-delete
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue: %w", err)
	}

	body, err := json.Marshal(order)
	if err != nil {
		return fmt.Errorf("failed to marshal order event: %w", err)
	}

	err = ch.PublishWithContext(
		ctx,
		"",                // exchange
		QueueOrderCreated, // routing key
		false,             // mandatory
		false,             // immediate
		amqp.Publishing{
			ContentType:  "application/json",
			DeliveryMode: amqp.Persistent,
			Body:         body,
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	log.Printf("[RABBITMQ] Published Order Event ID: %s to Queue %s", order.ID, QueueOrderCreated)
	return nil
}

func (r *rabbitMQRepository) ConsumeOrderEvents(ctx context.Context, handler func(order *domain.Order) error) error {
	ch, err := r.conn.Channel()
	if err != nil {
		return fmt.Errorf("failed to open channel: %w", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		QueueOrderCreated,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to declare queue: %w", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",    // consumer
		false, // auto-ack (manual ack for reliability)
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to register consumer: %w", err)
	}

	log.Printf("[RABBITMQ] Worker is actively listening on queue: %s", QueueOrderCreated)

	for {
		select {
		case <-ctx.Done():
			return nil
		case d, ok := <-msgs:
			if !ok {
				return nil
			}

			var order domain.Order
			if err := json.Unmarshal(d.Body, &order); err != nil {
				log.Printf("[WORKER] Error unmarshaling order: %v", err)
				d.Nack(false, false)
				continue
			}

			if err := handler(&order); err != nil {
				log.Printf("[WORKER] Error processing order %s: %v", order.ID, err)
				d.Nack(false, true) // requeue on error
			} else {
				d.Ack(false)
			}
		}
	}
}

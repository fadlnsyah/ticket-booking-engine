package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/yourname/ticket-booking-engine/apps/backend/internal/config"
)

func main() {
	cfg := config.LoadConfig()
	log.Printf("[WORKER] Starting ticket order queue worker on %s", cfg.RabbitMQURL)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[WORKER] Stopping worker gracefully...")
}

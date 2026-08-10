package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/config"
	delivery "github.com/yourname/ticket-booking-engine/apps/backend/internal/delivery/http"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/repository/postgres"
	redisRepo "github.com/yourname/ticket-booking-engine/apps/backend/internal/repository/redis"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/usecase"
	"github.com/yourname/ticket-booking-engine/apps/backend/pkg/response"
)

func main() {
	cfg := config.LoadConfig()

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect PostgreSQL: %v", err)
	}
	defer db.Close()
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		log.Printf("[WARN] PostgreSQL not reachable at startup: %v", err)
	} else {
		log.Println("[DB] Connected to PostgreSQL successfully")
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password: cfg.RedisPass,
		DB:       0,
	})
	defer redisClient.Close()

	if err := redisClient.Ping(context.Background()).Err(); err != nil {
		log.Printf("[WARN] Redis not reachable at startup: %v", err)
	} else {
		log.Println("[REDIS] Connected to Redis successfully")
	}

	bRepo := postgres.NewPostgresBookingRepository(db)
	lRepo := redisRepo.NewRedisLockRepository(redisClient)
	bUsecase := usecase.NewBookingUsecase(bRepo, lRepo)
	bHandler := delivery.NewBookingHandler(bUsecase)

	if cfg.ServerEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()

	r.GET("/health", response.HealthCheck)

	v1 := r.Group("/api/v1")
	{
		v1.POST("/bookings", bHandler.BookTicket)
	}

	srv := &http.Server{
		Addr:    ":" + cfg.ServerPort,
		Handler: r,
	}

	go func() {
		log.Printf("[HTTP] Server listening on port %s", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Listen error: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[HTTP] Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}
	log.Println("[HTTP] Server exiting")
}

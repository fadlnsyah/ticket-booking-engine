package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"github.com/yourname/ticket-booking-engine/apps/backend/internal/config"
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

	if err := db.Ping(); err != nil {
		log.Fatalf("PostgreSQL connection error: %v", err)
	}

	// Run initial migration automatically if tables do not exist
	migrationPaths := []string{"migrations/000001_init_schema.up.sql", "../migrations/000001_init_schema.up.sql", "../../migrations/000001_init_schema.up.sql"}
	var migrationSQL []byte
	for _, p := range migrationPaths {
		if content, err := os.ReadFile(p); err == nil {
			migrationSQL = content
			break
		}
	}

	if len(migrationSQL) > 0 {
		log.Println("[SEED] Running initial database migrations...")
		if _, err := db.Exec(string(migrationSQL)); err != nil {
			log.Printf("[WARN] Migration execution note: %v", err)
		}
	}

	log.Println("[SEED] Seeding database initial data...")

	// Reset old tickets & orders to ensure clean UUID mapping
	_, _ = db.Exec(`TRUNCATE TABLE orders, tickets CASCADE;`)

	eventID := uuid.MustParse("22222222-2222-2222-2222-222222222222")
	totalTickets := 1000

	_, err = db.Exec(`
		INSERT INTO events (id, title, description, total_tickets, available_tickets, start_time, end_time)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + INTERVAL '7 days')
		ON CONFLICT (id) DO UPDATE SET available_tickets = $5
	`, eventID, "Coldplay World Tour 2026 - Jakarta Flash Sale", "Grand Flash Sale Event", totalTickets, totalTickets)

	if err != nil {
		log.Fatalf("Failed to seed event: %v", err)
	}
	log.Printf("[SEED] Inserted Event ID: %s (Total Tickets: %d)", eventID, totalTickets)

	tx, err := db.Begin()
	if err != nil {
		log.Fatalf("Failed to begin tx: %v", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
		INSERT INTO tickets (id, event_id, seat_number, price, status, version)
		VALUES ($1, $2, $3, $4, 'AVAILABLE', 1)
		ON CONFLICT (event_id, seat_number) DO UPDATE SET id = EXCLUDED.id, status = 'AVAILABLE', version = 1
	`)
	if err != nil {
		log.Fatalf("Failed to prepare stmt: %v", err)
	}
	defer stmt.Close()

	for i := 1; i <= totalTickets; i++ {
		seatNo := fmt.Sprintf("SEAT-A-%04d", i)
		ticketIDStr := fmt.Sprintf("11111111-1111-1111-1111-%012d", i)
		ticketID := uuid.MustParse(ticketIDStr)
		_, err := stmt.Exec(ticketID, eventID, seatNo, 1500000.00)
		if err != nil {
			log.Fatalf("Failed to insert ticket %d: %v", i, err)
		}
	}

	if err := tx.Commit(); err != nil {
		log.Fatalf("Failed to commit seed tx: %v", err)
	}

	log.Printf("[SEED] Successfully seeded 1,000 tickets into database!")
	log.Printf("[SEED] Test Event ID:  %s", eventID)
	log.Printf("[SEED] Test Ticket ID: 11111111-1111-1111-1111-000000000001")
}

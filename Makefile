.PHONY: docker-up docker-down backend-run backend-worker test load-test

docker-up:
	docker compose up -d

docker-down:
	docker compose down

backend-run:
	cd apps/backend && go run cmd/api/main.go

backend-worker:
	cd apps/backend && go run cmd/worker/main.go

seed:
	cd apps/backend && go run cmd/seed/main.go

frontend-run:
	cd apps/frontend && npm run dev

test:
	cd apps/backend && go test -v -race ./...

load-test:
	k6 run scripts/load_test.js

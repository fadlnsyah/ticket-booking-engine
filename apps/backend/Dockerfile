FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/api cmd/api/main.go
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/worker cmd/worker/main.go

FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata

COPY --from=builder /app/bin/api /app/api
COPY --from=builder /app/bin/worker /app/worker

EXPOSE 8080

CMD ["/app/api"]

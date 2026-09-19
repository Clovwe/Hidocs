# Stage 1: Build binary Golang
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build biner teroptimasi dari ./cmd/api
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o hidocs-backend ./cmd/api

# Stage 2: Final Minimal Image
FROM alpine:latest

# Install sertifikat SSL untuk SMTP email & data zona waktu
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/

# Copy hasil biner saja dari stage builder
COPY --from=builder /app/hidocs-backend .

EXPOSE 8080

CMD ["./hidocs-backend"]
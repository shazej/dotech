# Dotech Makefile
# Automates common dev tasks

.PHONY: setup dev up down db-reset lint test format check-ports help

# Variables
DC=docker-compose
BACKEND_DIR=backend
FRONTEND_DIR=frontend

help:
	@echo "Available commands:"
	@echo "  make setup       - Install dependencies and setup environment files"
	@echo "  make up          - Start database and redis via Docker"
	@echo "  make down        - Stop Docker services"
	@echo "  make dev-backend - Start backend in dev mode"
	@echo "  make dev-frontend- Start frontend in dev mode"
	@echo "  make lint        - Lint all projects"
	@echo "  make check-ports - Check if required ports are free"

# Setup
setup:
	@echo "Installing Backend Dependencies..."
	cd $(BACKEND_DIR) && npm install
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		echo "Creating backend .env..."; \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env || echo "Please create $(BACKEND_DIR)/.env manually"; \
	fi
	@echo "Installing Frontend Dependencies..."
	cd $(FRONTEND_DIR) && npm install
	@if [ ! -f $(FRONTEND_DIR)/.env.local ]; then \
		echo "Creating frontend .env.local..."; \
		cp $(FRONTEND_DIR)/.env.example $(FRONTEND_DIR)/.env.local || echo "Please create $(FRONTEND_DIR)/.env.local manually"; \
	fi
	@echo "Setup complete! Don't forget to update .env files with real keys."

# Docker Services
up:
	$(DC) up -d
	@echo "Waiting for services to be ready..."
	sleep 5

down:
	$(DC) down

# Development
dev-backend:
	cd $(BACKEND_DIR) && npm run start:dev

dev-frontend:
	cd $(FRONTEND_DIR) && npm run dev

# Database Operations
db-migrate:
	@echo "TypeORM 'synchronize' is enabled in app.module.ts."
	@echo "Schema changes are applied automatically when the backend starts."
	@echo "To run manual migrations, add typeorm scripts to package.json."

db-seed:
	@echo "Seeding database..."
	@echo "Ensure backend is running on port 3000!"
	cd $(BACKEND_DIR) && node seed.js

# Utility
check-ports:
	@echo "Checking ports 3000, 5432, 6379..."
	@lsof -i :3000 || echo "Port 3000 is free"
	@lsof -i :5432 || echo "Port 5432 is free"
	@lsof -i :6379 || echo "Port 6379 is free"

mobile-setup:
	@echo "Installing Provider App Dependencies..."
	cd provider_app && flutter pub get
	@echo "Installing Customer App Dependencies..."
	cd customer_app && flutter pub get
	@echo "Mobile Setup Complete. Note: Update 'baseUrl' in injection_container.dart before running."

lint:
	cd $(BACKEND_DIR) && npm run lint
	cd $(FRONTEND_DIR) && npm run lint

# Variables
COMPOSE_FILE=srcs/docker-compose.yml

# Build the Docker images defined in docker-compose.yml
build:
	docker-compose -f $(COMPOSE_FILE) build

# Run the services defined in docker-compose.yml
up:
	docker-compose -f $(COMPOSE_FILE) up -d

# Stop the services defined in docker-compose.yml
stop:
	docker-compose -f $(COMPOSE_FILE) stop

# Down the services and remove containers, networks, and volumes
down:
	docker-compose -f $(COMPOSE_FILE) down

# View the logs of the services
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

# Rebuild and start the services
rebuild: down build up

# Show running services
ps:
	docker-compose -f $(COMPOSE_FILE) ps

# Prune unused Docker data (optional for cleanup)
prune:
	docker system prune -f

# Show help for available commands
help:
	@echo "Available commands:"
	@echo "  build     - Build the Docker images defined in docker-compose.yml"
	@echo "  up        - Run the services in detached mode"
	@echo "  stop      - Stop the running services"
	@echo "  down      - Stop and remove containers, networks, volumes, and images"
	@echo "  logs      - View the logs of the services"
	@echo "  rebuild   - Rebuild and start the services"
	@echo "  shell     - Open a shell in a specified container (use SERVICE=<service_name>)"
	@echo "  ps        - Show running services"
	@echo "  prune     - Prune unused Docker data"
	@echo "  help      - Show this help message"

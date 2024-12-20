# Variables
COMPOSE_FILE=srcs/docker-compose.yml
PROJECT_NAME=transcendance

# Commandes pour Docker Compose
up:
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d

down:
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down

build:
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) build

logs:
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) logs -f

restart:
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d

ps:
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) ps

clean:
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v
	docker-compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) rm -f

# Aide
help:
	@echo "Commandes disponibles :"
	@echo "  make up        : Démarre les services en arrière-plan"
	@echo "  make down      : Arrête et supprime les conteneurs"
	@echo "  make build     : Construit les images Docker"
	@echo "  make logs      : Affiche les logs en temps réel"
	@echo "  make restart   : Redémarre les services"
	@echo "  make ps        : Liste les conteneurs en cours d'exécution"
	@echo "  make clean     : Nettoie les volumes et conteneurs associés"

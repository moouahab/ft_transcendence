#!/bin/sh
set -e

# Lire le mot de passe PostgreSQL depuis le secret Docker
POSTGRES_PASSWORD=$(cat "$POSTGRES_PASSWORD_FILE")

# Se connecter à PostgreSQL en tant qu'utilisateur 'postgres' pour créer la base de données et l'utilisateur
psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
    CREATE DATABASE $POSTGRES_DB;
    CREATE USER $POSTGRES_USER WITH ENCRYPTED PASSWORD '$POSTGRES_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
EOSQL


# Utiliser une image légère Alpine
FROM alpine:3.14

# Installer PostgreSQL et les autres dépendances nécessaires
RUN apk update && apk upgrade && \
    apk add --no-cache \
    postgresql \
    postgresql-client \
    su-exec \
    curl \
    ca-certificates

# Créer les répertoires nécessaires et définir les permissions
RUN mkdir -p /var/lib/postgresql/data /run/postgresql && \
    chown -R postgres:postgres /var/lib/postgresql /run/postgresql

# Copier les scripts d'initialisation et d'entrée
COPY tools/init-db.sh /docker-entrypoint-initdb.d/
COPY tools/entrypoint.sh /entrypoint.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh /entrypoint.sh

# Exposer le port PostgreSQL par défaut
EXPOSE 5432

# Utiliser le script d'entrée personnalisé pour démarrer PostgreSQL
ENTRYPOINT ["/entrypoint.sh"]

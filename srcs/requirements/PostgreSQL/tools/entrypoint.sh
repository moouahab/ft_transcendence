#!/bin/sh
set -e

# Initialiser le répertoire de données PostgreSQL s'il est vide
if [ -z "$(ls -A /var/lib/postgresql/data)" ]; then
  su-exec postgres initdb -D /var/lib/postgresql/data

  # Démarrer PostgreSQL temporairement
  su-exec postgres postgres -D /var/lib/postgresql/data &
  pid="$!"

  # Attendre que PostgreSQL soit prêt
  for i in {30..0}; do
    if su-exec postgres psql -c "SELECT 1" > /dev/null 2>&1; then
      break
    fi
    echo "PostgreSQL en démarrage, attente..."
    sleep 1
  done

  # Exécuter les scripts d'initialisation dans /docker-entrypoint-initdb.d/
  for f in /docker-entrypoint-initdb.d/*; do
    case "$f" in
      *.sh)  echo "$0: running $f"; . "$f" ;;
      *.sql) echo "$0: running $f"; su-exec postgres psql -f "$f" ;;
      *)     echo "$0: ignoring $f" ;;
    esac
    echo
  done

  # Arrêter le serveur PostgreSQL temporaire
  kill "$pid"
  wait "$pid"
fi

# Démarrer PostgreSQL en mode continue
exec su-exec postgres postgres -D /var/lib/postgresql/data

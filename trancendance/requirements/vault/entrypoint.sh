#!/usr/bin/env sh
set -e

echo "[INFO] Démarrage de Vault (HTTP) ..."
vault server -config=/vault/config/vault.hcl &
VAULT_PID=$!

echo "[INFO] Attente de 5s pour laisser Vault démarrer ..."
sleep 5

echo "[INFO] Initialisation de Vault (forcée) ..."
vault operator init -key-shares=1 -key-threshold=1 -format=json > /tmp/vault_init.json

UNSEAL_KEY=$(jq -r '.unseal_keys_b64[0]' /tmp/vault_init.json)
ROOT_TOKEN=$(jq -r '.root_token' /tmp/vault_init.json)

echo "[INFO] Unseal Vault avec la clé: $UNSEAL_KEY"
vault operator unseal "$UNSEAL_KEY"

echo "[INFO] On exporte le root token: $ROOT_TOKEN"
export VAULT_TOKEN="$ROOT_TOKEN"

echo "[DEBUG] Vérification du token :"
vault token lookup

echo "[INFO] Activation du moteur de secrets KV sur le chemin 'secret'..."
vault secrets enable -path=secret kv

echo "[INFO] Insertion des secrets..."
vault kv put secret/postgres \
  POSTGRES_DB="${POSTGRES_DB}" \
  POSTGRES_USER="${POSTGRES_USER}" \
  POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
  POSTGRES_HOST="${POSTGRES_HOST}" \
  POSTGRES_PORT="${POSTGRES_PORT}"

vault kv put secret/django \
  DJANGO_SUPERUSER_USERNAME="${DJANGO_SUPERUSER_USERNAME}" \
  DJANGO_SUPERUSER_PASSWORD="${DJANGO_SUPERUSER_PASSWORD}" \
  DJANGO_SUPERUSER_EMAIL="${DJANGO_SUPERUSER_EMAIL}" \
  SECRET_KEY="${SECRET_KEY}" \
  ALLOWED_HOSTS="${ALLOWED_HOSTS}" \
  DEBUG="${DEBUG}"

vault kv put secret/email \
  EMAIL_HOST_USER="${EMAIL_HOST_USER}" \
  EMAIL_HOST_PASSWORD="${EMAIL_HOST_PASSWORD}"

echo "[INFO] Secrets insérés avec succès. Vault tourne maintenant."

wait $VAULT_PID

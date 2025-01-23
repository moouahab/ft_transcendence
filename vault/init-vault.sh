# vault-init/init-vault.sh

#!/bin/bash

set -e

# Configurer les variables d'environnement
export VAULT_ADDR="http://vault:8200"
export VAULT_TOKEN="root"

# Attendre que Vault soit prêt
echo "Attente de Vault pour être prêt..."
until curl --silent --fail $VAULT_ADDR/v1/sys/health; do
    echo "Vault n'est pas encore prêt. Réessai dans 2 secondes..."
    sleep 2
done

echo "Vault est prêt."

# Générer les certificats SSL auto-signés
echo "Génération des certificats SSL auto-signés..."
mkdir -p /tmp/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /tmp/ssl/selfsigned.key \
    -out /tmp/ssl/selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

# Injecter les certificats dans Vault
echo "Injection des certificats dans Vault..."
vault kv put secret/nginx-modsecurity ssl_cert="$(awk 'NF {sub(/\r/, ""); printf "%s\\n",$0}' /tmp/ssl/selfsigned.crt)" ssl_key="$(awk 'NF {sub(/\r/, ""); printf "%s\\n",$0}' /tmp/ssl/selfsigned.key)"

echo "Certificats SSL injectés avec succès dans Vault."

exit 0

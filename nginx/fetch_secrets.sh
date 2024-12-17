#!/bin/bash

# fetch_secrets.sh

set -e

# Vérifier la disponibilité de VAULT_ADDR et VAULT_TOKEN
if [ -z "$VAULT_ADDR" ] || [ -z "$VAULT_TOKEN" ]; then
    echo "VAULT_ADDR ou VAULT_TOKEN non défini !"
    exit 1
fi

# Attendre que Vault soit prêt
until curl --silent --fail $VAULT_ADDR/v1/sys/health; do
    echo "En attente de Vault..."
    sleep 2
done

echo "Vault est prêt."

# Récupérer les certificats depuis Vault
SECRET_PATH="secret/nginx-modsecurity"

# Récupérer le contenu JSON
RESPONSE_CERT=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/$SECRET_PATH)
SSL_CERT=$(echo "$RESPONSE_CERT" | jq -r '.data.data.ssl_cert')

RESPONSE_KEY=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/$SECRET_PATH)
SSL_KEY=$(echo "$RESPONSE_KEY" | jq -r '.data.data.ssl_key')

# Débogage : Afficher les valeurs récupérées (à supprimer après dépannage)
echo "SSL_CERT: $SSL_CERT"
echo "SSL_KEY: $SSL_KEY"

# Vérifier que les certificats ont été récupérés
if [ "$SSL_CERT" == "null" ] || [ "$SSL_KEY" == "null" ]; then
    echo "Impossible de récupérer les certificats depuis Vault."
    exit 1
fi

# Sauvegarder les certificats dans des fichiers locaux avec des nouvelles lignes correctes
mkdir -p /etc/nginx/ssl/
printf '%b\n' "$SSL_CERT" > /etc/nginx/ssl/nginx.crt
printf '%b\n' "$SSL_KEY" > /etc/nginx/ssl/nginx.key

echo "Certificats SSL récupérés et sauvegardés."

# Vous pouvez ajouter d'autres injections de secrets ici si nécessaire

# Activer ModSecurity
# (Déjà activé via les configurations Nginx)

echo "Secrets injectés avec succès."

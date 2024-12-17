# vault-init/Dockerfile

FROM hashicorp/vault:1.18.2

# Installer les outils nécessaires
RUN apk add --no-cache openssl bash jq curl

# Copier le script d'initialisation
COPY init-vault.sh /init-vault.sh

# Rendre le script exécutable
RUN chmod +x /init-vault.sh

# Définir le point d'entrée
ENTRYPOINT ["/init-vault.sh"]

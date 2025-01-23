# vault/Dockerfile

FROM hashicorp/vault:1.18.2

# Créer les répertoires nécessaires pour la configuration et les données
RUN mkdir -p /vault/config /vault/data

# Copier le fichier de configuration Vault
COPY config.hcl /vault/config/config.hcl

# Exposer le port Vault (par défaut, 8200)
EXPOSE 8200

# Définir les capacités nécessaires
# Ajout de IPC_LOCK pour sécuriser Vault
USER root
RUN setcap cap_ipc_lock=+ep /bin/vault

# Utiliser un utilisateur non-root pour plus de sécurité
RUN adduser -D vault && chown -R vault:vault /vault
USER vault

# Commande par défaut pour démarrer Vault
CMD ["vault", "server", "-config=/vault/config/config.hcl"]

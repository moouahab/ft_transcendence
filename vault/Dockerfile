# Étape 1 : Utiliser l'image officielle de HashiCorp Vault
FROM hashicorp/vault:latest


# Étape 2 : Créer les répertoires nécessaires pour la configuration et les données
RUN mkdir -p /vault/config /vault/data

# Étape 3 : Ajouter le fichier de configuration Vault
# Nous ajouterons ce fichier dans une étape suivante
COPY config/config.hcl /vault/config/

# Étape 4 : Exposer le port Vault (par défaut, 8200)
EXPOSE 8200

# Étape 5 : Commande par défaut pour démarrer Vault
CMD ["vault", "server", "-config=/vault/config/config.hcl"]

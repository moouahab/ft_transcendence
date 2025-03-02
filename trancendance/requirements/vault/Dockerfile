FROM vault:1.13.3

# Installation de jq (pour extraire le JSON renvoyé par 'vault operator init')
# Sur base alpine, par ex.:
RUN apk add --no-cache jq

# Copie de votre script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copie du fichier de config vault.hcl
# COPY vault.hcl /vault/config/vault.hcl

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Étape 1 : Utiliser une base Nginx stable
FROM nginx:stable

# Étape 2 : Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    libtool \
    libpcre3 \
    libpcre3-dev \
    libxml2 \
    libxml2-dev \
    zlib1g \
    zlib1g-dev \
    wget \
    curl jq\
    openssl && \ 
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Étape 3 : Compiler ModSecurity
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity.git /tmp/ModSecurity && \
    cd /tmp/ModSecurity && \
    git submodule init && git submodule update && \
    ./build.sh && ./configure && make && make install

# Étape 4 : Télécharger et compiler le module Nginx pour ModSecurity
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git /tmp/ModSecurity-nginx && \
    cd /tmp/ModSecurity-nginx && \
    wget http://nginx.org/download/nginx-$(nginx -v 2>&1 | grep -o '[0-9.]*').tar.gz -O /tmp/nginx.tar.gz && \
    tar -xzf /tmp/nginx.tar.gz -C /tmp && \
    cd /tmp/nginx-* && \
    ./configure --with-compat --add-dynamic-module=/tmp/ModSecurity-nginx && make modules && \
    cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules/ && \
    rm -rf /tmp/nginx* /tmp/ModSecurity* 

# Étape 4 : Télécharger et installer le CRS (Core Rule Set)
RUN git clone --depth 1 https://github.com/coreruleset/coreruleset.git /usr/share/modsecurity-crs && \
    mv /usr/share/modsecurity-crs/crs-setup.conf.example /usr/share/modsecurity-crs/crs-setup.conf

# Étape 5 : Configurer les certificats SSL auto-signés
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/selfsigned.key \
    -out /etc/nginx/ssl/selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost" && \
    openssl  dhparam -out /etc/nginx/ssl/dhparam.pem 2048

# Étape 6 : Ajouter les fichiers de configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY main.conf /etc/nginx/modsec/main.conf

# Étape 7 : Exposer les ports nécessaires
RUN apt-get update && apt-get install -y

# Copier le script de récupération des secrets
COPY fetch_secrets.sh /usr/local/bin/fetch_secrets.sh
RUN chmod +x /usr/local/bin/fetch_secrets.sh

EXPOSE 80 443

# Exécuter le script avant de démarrer Nginx
CMD ["/bin/bash", "-c", "/usr/local/bin/fetch_secrets.sh && nginx -g 'daemon off;'"]

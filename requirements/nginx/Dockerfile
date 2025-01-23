FROM owasp/modsecurity:nginx

# Supprimer les scripts qui réécrivent les configurations
RUN rm -rf /docker-entrypoint.d/*

# Copier vos configurations locales dans l'image
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

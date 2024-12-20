# Utiliser une image de base légère
FROM python:3.9-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les dépendances
COPY requirements.txt /app/

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code source dans le conteneur
COPY . /app/

# Exposer le port 8000 pour le serveur Django
EXPOSE 8003

# Commande par défaut pour lancer Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8003"]

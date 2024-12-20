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
EXPOSE 8001

# Commande par défaut pour lancer Django
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Exécuter les migrations et créer le superutilisateur
CMD ["sh", "-c", "python manage.py migrate && python manage.py shell < create_superuser.py && python manage.py runserver 0.0.0.0:8001"]


# Utiliser une image Python officielle compatible avec votre projet
FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /jwt2fa

# Copier le fichier requirements.txt
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir logs

# Copier le contenu du projet dans le conteneur
COPY . .

# Copier le script pour créer le superutilisateur
COPY create_superuser.py /user_auth/create_superuser.py

# Exposer le port sur lequel Django fonctionnera
EXPOSE 8000

# Définir la commande par défaut pour lancer le serveur Django
CMD ["gunicorn", "jwt2fa.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
# CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python create_superuser.py && python manage.py runserver 0.0.0.0:8000"]

import os
import django
from django.contrib.auth import get_user_model

# Charger les paramètres Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jwt2fa.settings')
django.setup()

# Obtenir le modèle utilisateur personnalisé
User = get_user_model()

# Informations du super utilisateur
SUPERUSER_USERNAME = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
SUPERUSER_EMAIL = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
SUPERUSER_PASSWORD = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin1234')

def create_superuser():
    if not User.objects.filter(email=SUPERUSER_EMAIL).exists():
        User.objects.create_superuser(
            username=SUPERUSER_USERNAME,
            email=SUPERUSER_EMAIL,
            password=SUPERUSER_PASSWORD
        )
        print(f"Superuser '{SUPERUSER_USERNAME}' created successfully.")
    else:
        print(f"Superuser with email '{SUPERUSER_EMAIL}' already exists.")

if __name__ == '__main__':
    create_superuser()

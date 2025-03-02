import os
import django
from django.contrib.auth import get_user_model

# --- 1) Charger Django ---
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jwt2fa.settings')
django.setup()

# --- 2) Import hvac pour se connecter à Vault (en supposant qu'il est installé) ---
import hvac

def get_vault_secret(path):
    """
    Essaie de lire un secret dans Vault (KV v2).
    Renvoie un dict, ou {} en cas d'erreur.
    """
    try:
        client = hvac.Client(
            url=os.environ.get('VAULT_ADDR', 'http://localhost:8200'),
            token=os.environ.get('VAULT_TOKEN', 'root')  # En dev ; en prod, token restreint
        )
        response = client.secrets.kv.read_secret_version(path=path)
        return response['data']['data']
    except Exception as e:
        return {}


# --- 3) Récupérer le modèle d'utilisateur personnalisé ---
User = get_user_model()

# --- 4) Récupérer les secrets depuis Vault (par ex. 'secret/django')
vault_django = get_vault_secret('django')

# --- 5) Définir les valeurs du superuser, avec fallback sur os.getenv ---
SUPERUSER_USERNAME = vault_django.get(
    'DJANGO_SUPERUSER_USERNAME',
    os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
)

SUPERUSER_EMAIL = vault_django.get(
    'DJANGO_SUPERUSER_EMAIL',
    os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
)

SUPERUSER_PASSWORD = vault_django.get(
    'DJANGO_SUPERUSER_PASSWORD',
    os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin1234')
)

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

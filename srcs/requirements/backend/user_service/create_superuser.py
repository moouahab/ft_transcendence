import os
from django.contrib.auth.models import User


print("=====================================================================================================================================================")
# Vérifiez si l'utilisateur admin existe déjà
if not User.objects.filter(username=os.environ['DJANGO_SUPERUSER_USERNAME']).exists():
    User.objects.create_superuser(
        username=os.environ['DJANGO_SUPERUSER_USERNAME'],
        email=os.environ['DJANGO_SUPERUSER_EMAIL'],
        password=os.environ['DJANGO_SUPERUSER_PASSWORD']
    )
    print("Superuser created successfully!")
else:
    print("Superuser already exists.")

print("=====================================================================================================================================================")
# ft_transcendence
"ft_transcendence" est un projet de jeu en ligne basé sur Pong, où les utilisateurs jouent en temps réel contre d'autres joueurs via un site web. Il inclut des fonctionnalités comme des tournois, du matchmaking, et la gestion des utilisateurs, le tout sous des contraintes techniques et de sécurité strictes.

## API REST Utilisateurs - Documentation

### Description Générale
Ce projet met en place une API REST pour gérer les utilisateurs. Les fonctionnalités incluent :
- Lister tous les utilisateurs.
- Créer un nouvel utilisateur.
- Récupérer les détails d’un utilisateur spécifique.

Le modèle utilisateur a été personnalisé pour inclure des champs spécifiques comme un avatar.

---

### Structure du Projet

```plaintext
backend/
├── app/
│   ├── users/
│   │   ├── __init__.py
│   │   ├── admin.py       # Enregistre le modèle utilisateur dans l'admin Django
│   │   ├── apps.py        # Configuration de l'app users
│   │   ├── models.py      # Définition du modèle utilisateur personnalisé (UserTrans)
│   │   ├── serializers.py # Sérialiseur pour convertir les données utilisateur en JSON
│   │   ├── views.py       # Logique des endpoints REST
│   │   ├── urls.py        # Routes de l'app users
│   │   └── tests.py       # Tests unitaires (non implémentés pour l'instant)
├── backend/
│   ├── settings.py        # Configuration principale du projet Django
│   ├── urls.py            # Inclusion des routes de l'app users
└── manage.py              # Commande principale Django

```
---
### Modèle Utilisateur

Fichier : users/models.py

```py
from django.contrib.auth.models import AbstractUser
from django.db import models

class UserTrans(AbstractUser):
    email = models.EmailField(unique=True)  # Champ email unique
    avatar = models.ImageField(upload_to='avatars/', default='default.png', blank=True, null=True)  # Avatar

    def __str__(self):
        return self.username
```
#### Champs Personnalisés
    - email : Champ email unique pour chaque utilisateur.
    - avatar : Image optionnelle téléversée par l’utilisateur.

--- 
### Endpoints API
#### Liste et Création des Utilisateurs

    - URL : /users/
    - Méthodes :
        GET : Retourne la liste des utilisateurs.
        POST : Crée un nouvel utilisateur.

##### Exemple - GET /users/

    Requête : Aucune donnée requise.
    Réponse (JSON) :

    [
      {
        "id": 1,
        "username": "moouahab",
        "email": "mohamed.ouahab1999@gmail.com",
        "avatar": null
      },
      {
        "id": 2,
        "username": "testuser",
        "email": "testuser@example.com",
        "avatar": null
      }
    ]

##### Exemple - POST /users/

    Requête (JSON) :
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "secure_password123"
}
```
##### Réponse (JSON) :
```json
{
    "id": 3,
    "username": "newuser",
    "email": "newuser@example.com",
    "avatar": null
}
```

##### Détails d’un Utilisateur

    URL : /users/<int:pk>/
    Méthode : GET
    Description : Retourne les détails d’un utilisateur spécifique.

##### Exemple - GET /users/1/

    Requête : Aucune donnée requise.
    Réponse (JSON) :
```json
    {
      "id": 1,
      "username": "moouahab",
      "email": "mohamed.ouahab1999@gmail.com",
      "avatar": null
    }
```
### Sérialiseur

Fichier : users/serializers.py
```py
from rest_framework import serializers
from .models import UserTrans

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTrans
        fields = ['id', 'username', 'email', 'avatar']
```

    Le sérialiseur convertit les objets UserTrans en JSON et valide les données envoyées par les requêtes.

### Vues
1. Vue UserListCreateView

Fichier : users/views.py
```py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserTrans
from .serializers import UserSerializer

class UserListCreateView(APIView):
    def get(self, request):
        """Liste tous les utilisateurs."""
        users = UserTrans.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Crée un nouvel utilisateur."""
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```
2. Vue UserDetailView

Fichier : users/views.py
```py
from rest_framework.generics import RetrieveAPIView

class UserDetailView(RetrieveAPIView):
    queryset = UserTrans.objects.all()
    serializer_class = UserSerializer
```
    Vue générique pour récupérer les détails d’un utilisateur spécifique par son ID.

#### Routes

Fichier : users/urls.py

```py
from django.urls import path
from .views import UserDetailView, UserListCreateView

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user_list_create'),
    path('<int:pk>/', UserDetailView.as_view(), name='user_detail'),
]
```
### Tests

#### Vous pouvez tester ces endpoints avec :

    Postman ou Insomnia pour simuler des requêtes.
    cURL depuis le terminal :

    curl -X GET http://127.0.0.1:8000/users/

### Améliorations Futures
    - Ajouter l’authentification avec JWT pour sécuriser les endpoints.
    - Permettre la mise à jour (PUT/PATCH) et la suppression (DELETE) des utilisateurs.
    - Ajouter des champs supplémentaires (biographie, score, statut en ligne).
    - Ajouter des tests unitaires pour valider le comportement de l’API.

## Auteur
    Nom : Mohamed Ouahab
    Nom : Michaël Bourgeois
    Nom : Otto Szwalberg
    Contact : mohamed.ouahab1999@gmail.com



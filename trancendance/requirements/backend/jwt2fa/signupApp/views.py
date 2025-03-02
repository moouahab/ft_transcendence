# signupApp/views.py

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
from .serializers import SignupUserSerializer
from .utils import generate_tokens_for_user, validate_access_token

logger = logging.getLogger(__name__)

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SignupUserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()

                # Génération des tokens JWT
                tokens = generate_tokens_for_user(user)
                
                # Log des tokens générés
                logger.info(f"Tokens générés pour l'utilisateur {user.email}")
                logger.debug(f"Access Token : {tokens['access']}")
                logger.debug(f"Refresh Token : {tokens['refresh']}")

                # Création de la réponse
                response = Response({
                    "message": "Utilisateur créé avec succès. Veuillez confirmer votre email.",
                    "access_token": tokens["access"],
                    "refresh_token": tokens["refresh"],
                    "username": user.username,
                }, status=status.HTTP_201_CREATED)

                # Stocker les tokens dans les cookies
                secure = True
                response.set_cookie(
                    key="access",
                    value=tokens["access"],
                    httponly=True,
                    secure=secure,
                    samesite='Strict',
                    max_age=3600  # Expiration en 1 heure
                )
                response.set_cookie(
                    key="refresh",
                    value=tokens["refresh"],
                    httponly=True,
                    secure=secure,
                    samesite='Strict'
                )

                return response
            except Exception as e:
                logger.error(f"Erreur lors de la création de l'utilisateur : {str(e)}")
                return Response({
                    "message": "Une erreur interne s'est produite.",
                    "details": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            logger.warning(f"Échec de l'inscription avec les données : {serializer.errors}")
            return Response({
                "message": "Échec de la création de l'utilisateur.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


class CheckTokenView(APIView):
    def get(self, request, *args, **kwargs):
        access_token = request.COOKIES.get("access")
        if not access_token:
            return Response({"message": "Aucun token trouvé."}, status=status.HTTP_401_UNAUTHORIZED)

        # Validation du token
        if not validate_access_token(access_token):
            return Response({"message": "Token invalide ou expiré."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"message": "Token valide."}, status=status.HTTP_200_OK)

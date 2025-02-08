# loginApp/views.py

import logging
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from signupApp.utils import generate_tokens_for_user, generate_otp_for_user, send_otp_email
from rest_framework.parsers import JSONParser
from signupApp.models import SignupUser
from datetime import timedelta
from django.utils import timezone

logger = logging.getLogger(__name__)

class LoginView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            logger.warning("Tentative de login sans email ou mot de passe.")
            return Response({"message": "Email et mot de passe sont requis."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Authentifier l'utilisateur
        user = authenticate(request, email=email, password=password)

        if user is not None:
            if user.is_2fa_enabled:
                otp_code = generate_otp_for_user(user)
                try:
                    send_otp_email(user, otp_code)
                    logger.info(f"OTP envoyé à {user.email}")
                except Exception as e:
                    logger.error(f"Erreur lors de l'envoi de l'OTP à {user.email}: {str(e)}")
                    return Response({
                        "message": "Erreur lors de l'envoi de l'OTP. Veuillez réessayer plus tard."
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                return Response({
                    "message": "Identifiants validés. Un code OTP a été envoyé par email."
                }, status=status.HTTP_200_OK)
            else:
                tokens = generate_tokens_for_user(user)
                response = Response({ "message": f"Bienvenue, {user.username} !", "access_token": tokens["access"], "refresh_token": tokens["refresh"]
                }, status=status.HTTP_200_OK)
                secure = True
                response.set_cookie(key="access", value=tokens["access"], httponly=True, secure=secure, samesite='Strict', max_age=86400000)
                response.set_cookie(key="refresh", value=tokens["refresh"],  httponly=True, secure=secure, samesite='Strict')
                logger.info(f"Tokens générés pour {user.email}")
                return response
        else:
            logger.warning(f"Tentative de login échouée pour l'email : {email}")
            return Response({"message": "Identifiants invalides."},
                            status=status.HTTP_401_UNAUTHORIZED)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        otp_code = request.data.get("otp_code")

        if not email or not otp_code:
            logger.warning("Tentative de vérification OTP sans email ou code.")
            return Response({"message": "Email et code OTP sont requis."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = SignupUser.objects.get(email=email)
        except SignupUser.DoesNotExist:
            logger.warning(f"Vérification OTP échouée : utilisateur avec email {email} non trouvé.")
            return Response({"message": "Utilisateur non trouvé."},
                            status=status.HTTP_404_NOT_FOUND)

        # Vérifie si l'OTP correspond et n'a pas expiré (5 minutes)
        if user.otp_code == otp_code:
            if user.otp_created_at and (timezone.now() - user.otp_created_at) <= timedelta(minutes=5):
                # OTP valide, réinitialiser le code, l'heure et les tentatives
                user.otp_code = None
                user.otp_created_at = None
                user.otp_attempts = 0
                user.save(update_fields=["otp_code", "otp_created_at", "otp_attempts"])

                # Génération des tokens JWT
                tokens = generate_tokens_for_user(user)
                
                # Création de la réponse avec les tokens
                response = Response({
                    "message": "Connexion réussie.",
                    "access_token": tokens["access"],
                    "refresh_token": tokens["refresh"]
                }, status=status.HTTP_200_OK)

                # Stocker les tokens dans les cookies
                secure = True
                response.set_cookie(key="access", value=tokens["access"], httponly=True, secure=secure, samesite='Strict', max_age=3600)
                response.set_cookie(key="refresh", value=tokens["refresh"], httponly=True, secure=secure, samesite='Strict')
                logger.info(f"Tokens générés pour {user.email} après validation OTP.")
                return response
            else:
                logger.warning(f"OTP expiré pour l'utilisateur {email}.")
                return Response({"message": "OTP expiré."},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            # Incrémente le compteur de tentatives
            user.otp_attempts += 1
            if user.otp_attempts >= 5:
                logger.warning(f"Utilisateur {email} a dépassé le nombre maximal de tentatives OTP.")
                # Optionnel : Désactiver la 2FA ou bloquer l'utilisateur
                user.is_2fa_enabled = False
                user.save(update_fields=["otp_attempts", "is_2fa_enabled"])
                return Response({"message": "Nombre maximal de tentatives dépassé. La 2FA a été désactivée."},
                                status=status.HTTP_400_BAD_REQUEST)
            user.save(update_fields=["otp_attempts"])
            logger.warning(f"OTP invalide pour l'utilisateur {email}. Tentative {user.otp_attempts}/5.")
            return Response({"message": "Code OTP invalide."},
                            status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        response = Response({"message": "Déconnexion réussie."}, status=status.HTTP_200_OK)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response



from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RefreshTokenView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")  # Récupération du refresh token depuis les cookies
        if not refresh_token:
            return Response({"message": "Aucun Refresh Token trouvé."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            new_access_token = str(RefreshToken(refresh_token).access_token)  # Générer un nouvel access_token
            response = Response({"access_token": new_access_token}, status=status.HTTP_200_OK)

            # Remettre le nouveau token dans le cookie
            secure = True
            response.set_cookie(key="access", value=new_access_token, httponly=True, secure=secure, samesite='Strict', max_age=3600)

            return response
        except Exception as e:
            return Response({"message": "Refresh Token invalide ou expiré."}, status=status.HTTP_401_UNAUTHORIZED)

# loginApp/views.py

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from signupApp.utils import generate_tokens_for_user, validate_access_token, generate_otp_for_user
from signupApp.utils import send_otp_email

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        
        if not email or not password:
            return Response({"message": "Email et mot de passe sont requis."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            # Vérifier si l'utilisateur a activé la 2FA
            if user.is_2fa_enabled:
                # Générer l'OTP et l'enregistrer
                otp_code = generate_otp_for_user(user)
                # Envoyer l'OTP par email
                send_otp_email(user, otp_code)
                
                return Response({
                    "message": "Identifiants validés. Un code OTP a été envoyé par email. Veuillez le saisir pour finaliser la connexion."
                }, status=status.HTTP_200_OK)
            else:
                # Si 2FA n'est pas activé, procéder au login normal
                tokens = generate_tokens_for_user(user)
                response = Response({
                    "message": f"Bienvenue, {user.username} ! Vous êtes connecté(e).",
                    "access_token": tokens["access"],
                    "refresh_token": tokens["refresh"]
                }, status=status.HTTP_200_OK)
                
                secure = not settings.DEBUG
                response.set_cookie(
                    key="access",
                    value=tokens["access"],
                    httponly=True,
                    secure=secure,
                    samesite='Strict',
                    max_age=3600
                )
                response.set_cookie(
                    key="refresh",
                    value=tokens["refresh"],
                    httponly=True,
                    secure=secure,
                    samesite='Strict'
                )
                return response
        else:
            return Response({"message": "Identifiants invalides."},
                            status=status.HTTP_401_UNAUTHORIZED)


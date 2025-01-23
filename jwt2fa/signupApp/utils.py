import random
import requests
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

def generate_tokens_for_user(user):
    """
    Génère un token d'accès et de rafraîchissement pour l'utilisateur.
    """
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }

def validate_access_token(token):
    """
    Valide le token d'accès JWT.
    """
    try:
        JWTAuthentication().get_validated_token(token)
        return True
    except (InvalidToken, TokenError):
        return False



def verify_email(email):
    """
    Vérifie l'existence réelle d'un email via l'API Abstract Email Validation.
    """
    api_url = "https://emailvalidation.abstractapi.com/v1/"
    api_key = "cbf5ddecec564695a7449eb08b611809"
    params = {
        "api_key": api_key,
        "email": email
    }
    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        data = response.json()
        print("Réponse Abstract :", data)

        # Vérifie tous les critères de validité
        is_valid = (
            data.get("is_valid_format", {}).get("value") and
            data.get("is_mx_found", {}).get("value") and
            data.get("is_smtp_valid", {}).get("value") and
            data.get("deliverability") == "DELIVERABLE"
        )
        return is_valid
    except requests.RequestException as e:
        print(f"Erreur de connexion à l'API Abstract : {str(e)}")
        return False



def generate_otp_for_user(user):
    """
    Génère un OTP à 6 chiffres pour l'utilisateur, enregistre l'heure de création,
    et met à jour l'utilisateur en base de données.
    """
    # Génère un nombre aléatoire entre 100000 et 999999 et le convertit en chaîne de caractères
    otp_code = str(random.randint(100000, 999999))
    
    # Enregistre l'heure actuelle pour ce code OTP
    otp_created_at = timezone.now()
    
    # Met à jour l'utilisateur
    user.otp_code = otp_code
    user.otp_created_at = otp_created_at
    user.save(update_fields=["otp_code", "otp_created_at"])
    
    return otp_code



def send_otp_email(user, otp_code):
    """
    Envoie un email contenant le code OTP à l'utilisateur.
    """
    subject = "Votre code OTP pour la connexion"
    message = f"Bonjour {user.username},\n\nVotre code OTP est : {otp_code}\nIl est valable pendant 5 minutes.\n\nSi vous n'avez pas tenté de vous connecter, ignorez cet e-mail."
    from_email = 'moouahab.transcendence@gmail.com'  # ou une adresse mail dédiée
    recipient_list = [user.email]

    # Envoie de l'email
    send_mail(subject, message, from_email, recipient_list)

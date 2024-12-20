import requests
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

def user_service_proxy(request):
    try:
        response = requests.get("http://user_service:8001/get_user/")
        response.raise_for_status()
        return JsonResponse(response.json())
    except requests.exceptions.RequestException as e:
        logger.error(f"Erreur lors de l'appel au service utilisateur : {e}")
        return JsonResponse({"error": "Service utilisateur indisponible"}, status=503)


from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse

class RefreshTokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get("access")
        refresh_token = request.COOKIES.get("refresh")

        if not access_token and refresh_token:
            try:
                new_access_token = str(RefreshToken(refresh_token).access_token)
                response = JsonResponse({"message": "Token rafraîchi"}, status=200)
                response.set_cookie(key="access", value=new_access_token, httponly=True, secure=True, samesite='Strict', max_age=3600)
                return response
            except Exception:
                return JsonResponse({"message": "Refresh Token expiré"}, status=401)
        return None

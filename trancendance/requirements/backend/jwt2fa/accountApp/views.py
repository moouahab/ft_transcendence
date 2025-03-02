from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from signupApp.models import SignupUser
from signupApp.serializers import SignupUserSerializer
from signupApp.utils import generate_tokens_for_user

class AccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Récupère les informations de l'utilisateur connecté.
        """
        user = request.user
        serializer = SignupUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """
        Met à jour l'ensemble des informations de l'utilisateur connecté.
        Après mise à jour, de nouveaux tokens JWT sont générés et stockés dans les cookies.
        """
        user = request.user
        serializer = SignupUserSerializer(user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            tokens = generate_tokens_for_user(user)
            response = Response(serializer.data, status=status.HTTP_200_OK)
            secure = True  # Vous pouvez ajuster cette variable selon votre environnement (True en prod)
            response.set_cookie(key="access", value=tokens["access"], httponly=True, secure=secure, samesite='Strict', max_age=3600)
            response.set_cookie(key="refresh", value=tokens["refresh"], httponly=True, secure=secure, samesite='Strict')
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        user = request.user
        serializer = SignupUserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            tokens = generate_tokens_for_user(user)

            response_data = {
                "message": "Profil mis à jour avec succès",
                "user": serializer.data,
                "access_token": tokens["access"],
                "refresh_token": tokens["refresh"]
            }

            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie("access", tokens["access"], httponly=True, secure=True, samesite='Strict', max_age=3600)
            response.set_cookie("refresh", tokens["refresh"], httponly=True, secure=True, samesite='Strict')

            return response
        
        return Response({"error": "Données invalides", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request):
        """
        Supprime ou désactive le compte de l'utilisateur.
        Les cookies JWT sont également supprimés.
        """
        user = request.user
        user.delete()
        response = Response(
            {"message": "Votre compte a été supprimé avec succès."},
            status=status.HTTP_200_OK
        )
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response

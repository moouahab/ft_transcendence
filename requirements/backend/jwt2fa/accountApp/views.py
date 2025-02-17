from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from signupApp.models import SignupUser
from signupApp.serializers import SignupUserSerializer

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
        Met à jour les informations de l'utilisateur connecté.
        """
        user = request.user
        serializer = SignupUserSerializer(user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """
        Met à jour partiellement les informations (si nécessaire).
        """
        user = request.user
        serializer = SignupUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """
        Supprime ou désactive le compte de l'utilisateur.
        """
        user = request.user
        user.delete()
        return Response({"message": "Votre compte a été supprimé avec succès."}, status=status.HTTP_200_OK)

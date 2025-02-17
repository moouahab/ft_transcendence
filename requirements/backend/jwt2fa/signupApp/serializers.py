# signupApp/serializers.py

from rest_framework import serializers
from .models import SignupUser
from .utils import verify_email

class SignupUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = SignupUser
        fields = ['email', 'username', 'password', 'confirm_password', 'profile_picture']
        
    def validate_email(self, value):
        """
        Vérifie si l'email existe réellement en utilisant une API tierce.
        """
        if not verify_email(value):
            raise serializers.ValidationError("Cet email semble invalide ou inexistant.")
        return value

    def validate(self, data):
        """
        Valide les mots de passe et les autres données.
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Les mots de passe ne sont pas identiques'})
        return data

    def create(self, validated_data):
        """
        Supprime confirm_password et crée un utilisateur.
        """
        validated_data.pop('confirm_password')
        return SignupUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            profile_picture=validated_data.get('profile_picture')
        )

    def update(self, instance, validated_data):
        """
        Permet la mise à jour du pseudo et de l'avatar.
        """
        instance.username = validated_data.get('username', instance.username)
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']
        instance.save()
        return instance

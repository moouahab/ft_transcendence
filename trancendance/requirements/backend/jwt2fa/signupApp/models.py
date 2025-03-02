# signupApp/models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import uuid

class SignupUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email doit être renseignée")
        if not username:
            raise ValueError("Le nom d'utilisateur doit être renseigné")
            
        email = self.normalize_email(email)
        extra_fields.setdefault('activation_token', uuid.uuid4().hex)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError("Le superutilisateur doit avoir is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Le superutilisateur doit avoir is_superuser=True.")
        return self.create_user(email, username, password, **extra_fields)


class SignupUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    is_2fa_enabled = models.BooleanField(default=True)
    activation_token = models.CharField(max_length=32, blank=True, null=True)

    # Champ pour la photo de profil
    profile_picture = models.ImageField(upload_to='image_profile/', blank=True, null=True)

    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_attempts = models.IntegerField(default=0)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    
    objects = SignupUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email

from django.urls import path
from . import views

urlpatterns = [
    # Route vers le service utilisateur
    path('users/', views.user_service_proxy, name='user_service_proxy'),
]

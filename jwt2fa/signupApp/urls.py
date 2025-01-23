from django.urls import path
from .views import SignupView, CheckTokenView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('check-token/', CheckTokenView.as_view(), name='check-token'),
]

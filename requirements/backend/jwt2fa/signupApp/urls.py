from django.urls import path
from .views import SignupView, CheckTokenView
from loginApp.views import LoginView, VerifyOTPView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('check-token/', CheckTokenView.as_view(), name='check-token'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
]

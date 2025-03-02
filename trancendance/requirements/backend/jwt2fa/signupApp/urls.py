from django.urls import path
from .views import SignupView, CheckTokenView
from loginApp.views import LoginView, VerifyOTPView, LogoutView, RefreshTokenView, Auth42
from accountApp.views import AccountView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('check-token/', CheckTokenView.as_view(), name='check-token'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),
    path('account/', AccountView.as_view(), name='account'),
    path('auth42/', Auth42.as_view(), name='auth42')
]
from django.contrib import admin
from .models import SignupUser

# Register your models here.

@admin.register(SignupUser)
class SignupUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_staff')
    search_fields = ('email', 'username')

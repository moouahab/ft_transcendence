# Generated by Django 5.1.4 on 2025-01-20 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('signupApp', '0004_remove_signupuser_profile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='signupuser',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='image_profile/'),
        ),
    ]

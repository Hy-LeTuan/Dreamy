from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    phone = models.CharField(
        verbose_name="Phone number", max_length=20, blank=False)
    secondary_email = models.EmailField(
        verbose_name="Secondary email", blank=True, null=True)

    password_reset_otp = models.CharField(max_length=6, null=True, blank=True)

    # automatically set USERNAME_FIELD to username
    REQUIRED_FIELDS = ["email"]

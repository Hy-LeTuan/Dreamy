from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    phone = models.CharField(
        verbose_name="Phone number", max_length=20, blank=False)

    REQUIRED_FIELDS = ["email"]

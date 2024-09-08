from .models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password, password_changed, password_validators_help_texts
from django.contrib.auth.hashers import make_password
from django.core.exceptions import (
    ValidationError,
)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    secondary_email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["username", "email", "secondary_email", "phone", "password"]

    def validate(self, data):
        # check for empty secondary email
        if data["secondary_email"] == "null" or data["secondary_email"] == None or data["secondary_email"] == "" or not data["secondary_email"]:
            data["secondary_email"] = data["email"]
            print(f"set secondary email to: {data['secondary_email']}")

        # validate password with Django hash functions
        user_password = data["password"]

        try:
            validate_password(password=user_password)
        except ValidationError as valError:
            raise serializers.ValidationError(
                {"help message": password_validators_help_texts(), "error": valError.messages})

        user_password = make_password(user_password)
        data["password"] = user_password

        data = super().validate(data)

        return data


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # custom clais
        token["username"] = user.username
        token["email"] = user.email

        return token

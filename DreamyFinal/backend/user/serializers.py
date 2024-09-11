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
        fields = ["id", "username", "email",
                  "secondary_email", "phone", "password"]

    def validate(self, data):
        # validate password with Django hash functions
        if (data.get("password")):
            user_password = data["password"]
            try:
                validate_password(password=user_password)
            except ValidationError as valError:
                raise serializers.ValidationError(
                    {"help-message": password_validators_help_texts(), "message": valError.messages})

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

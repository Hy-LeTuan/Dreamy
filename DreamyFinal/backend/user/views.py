from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CreateUserAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def handle_exception(self, exc):
        return super().handle_exception(exc)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

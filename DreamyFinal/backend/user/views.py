from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer
# Create your views here.


class CreateUserAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer

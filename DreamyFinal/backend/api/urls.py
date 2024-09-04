from django.contrib import admin
from django.urls import path, include

import user.views as user_views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("users/register", user_views.CreateUserAPIView.as_view()),
    path("users/login", user_views.MyTokenObtainPairView.as_view()),
    path("token/refresh", TokenRefreshView.as_view()),
]

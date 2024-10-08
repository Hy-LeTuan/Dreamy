from django.contrib import admin
from django.urls import path, include

import user.views as user_views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("users/register", user_views.CreateUserAPIView.as_view()),
    path("users/token", user_views.MyTokenObtainPairView.as_view()),
    path("users/token/refresh", TokenRefreshView.as_view()),
    path("users/otp/<str:username>/<str:email>",
         user_views.RetrieveUserAndSendOTPAPIView.as_view()),
    path("users/otp/reset-password/<int:id>/<str:otp>",
         user_views.RetrieveUserAndValidateOTPAPIView.as_view()),
]

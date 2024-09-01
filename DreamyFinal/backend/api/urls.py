from django.contrib import admin
from django.urls import path, include

import user.views as user_views

urlpatterns = [
    path("users/", user_views.CreateUserAPIView.as_view()),
]

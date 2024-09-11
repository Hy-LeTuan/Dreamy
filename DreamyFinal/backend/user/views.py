from rest_framework import generics
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status

from django.core.mail import send_mail

from datetime import datetime, timedelta
from user.models import User
from user.utils import generate_email, generate_otp_secret, get_totp


class CreateUserAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def handle_exception(self, exc):
        return super().handle_exception(exc)


class RetrieveUserAndSendOTPAPIView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    lookup_url_kwarg = "username"
    lookup_field = "username"
    queryset = User.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # validate for valid email from user
        email = instance.email
        secondary_email = instance.secondary_email
        user_typed_email = self.kwargs["email"]

        # send OTP after validating email
        otp_secret = generate_otp_secret()
        otp = get_totp(otp_secret=otp_secret)

        instance.password_reset_otp = otp_secret
        instance.save()

        if email != user_typed_email and (not secondary_email or user_typed_email != secondary_email):
            return Response(data={
                "email": "Your email does not match with registered emails",
            }, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            send_mail("This is subject", "Here is the message",
                      from_email=None,
                      recipient_list=["letuanhy1507@gmail.com"],
                      html_message=generate_email(instance.username, otp.now()))
            return Response(data=serializer.data, status=status.HTTP_200_OK)


class RetrieveUserAndValidateOTPAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    lookup_field = "id"
    queryset = User.objects.all()

    # def retrieve(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance)

    #     # get entered otp
    #     user_type_otp = self.kwargs["otp"]
    #     stored_otp_secret = instance.password_reset_otp

    #     totp = get_totp(stored_otp_secret)

    #     # verify otp
    #     if (totp.verify(user_type_otp)):
    #         return Response(data=serializer.data, status=status.HTTP_200_OK)
    #     else:
    #         return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # get entered otp
        user_typed_otp = kwargs.get("otp")
        stored_otp_secret = instance.password_rest_otp
        totp = get_totp(stored_otp_secret)

        print("---------------------")
        print(f"User typed: {user_typed_otp}")

        # verify otp
        if (totp.verify(user_typed_otp)):
            # perform update and validation with new password
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # forcibly invalidate the prefetch cache on the instance.
                instance._prefetched_objects_cache = {}
            return Response(serializer.data)
        else:
            time_remaining = totp.interval - datetime.now().timestamp() % totp.interval

            if time_remaining <= 0:
                # OTP passed allowed time
                return Response({
                    "is_timeout": True,
                }, status=status.HTTP_406_NOT_ACCEPTABLE)
            else:
                # wrong OTP
                return Response({
                    "is_timeout": False,
                }, status=status.HTTP_406_NOT_ACCEPTABLE)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

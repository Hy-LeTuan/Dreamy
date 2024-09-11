from rest_framework import generics
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status

from django.core.mail import send_mail

from datetime import datetime, timedelta
from user.models import User
from user.utils import generate_email, generate_otp_secret, get_totp, verify_otp, verify_otp_time


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

        if email != user_typed_email and (not secondary_email or user_typed_email != secondary_email):
            return Response(data={
                "email": "Your email does not match with registered emails",
            }, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            # send OTP after validating email
            otp_secret = generate_otp_secret()
            totp = get_totp(otp_secret=otp_secret)
            otp = totp.now()
            print(f"----OTP: {otp}")
            email_result = send_mail("This is subject", "Here is the message",
                                     from_email=None,
                                     recipient_list=["letuanhy1507@gmail.com"],
                                     html_message=generate_email(instance.username, otp))

            print(f"Email result ---- {email_result}")
            if (email_result):
                instance.password_reset_otp = otp
                instance.password_reset_otp_time = str(datetime.now())
                instance.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(data={
                    "message": "Cannot send OTP request to your email, please try again",
                }, status=status.HTTP_502_BAD_GATEWAY)


class RetrieveUserAndValidateOTPAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    lookup_field = "id"
    queryset = User.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # get entered otp
        user_typed_otp = kwargs.get("otp")
        stored_otp = instance.password_reset_otp
        stored_otp_time = instance.password_reset_otp_time

        print("---------------------")
        print(f"User typed: {user_typed_otp}")
        print(f"Stored otp: {stored_otp}")
        print(f"Stored otp time: {stored_otp_time}")

        # verify otp
        if (verify_otp_time(stored_otp_time)):
            if (verify_otp(stored_otp, user_typed_otp)):
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
                # wrong OTP
                print("wrong otp ------")
                return Response({
                    "timeout": False,
                }, status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            # OTP passed allowed time
            return Response({
                "timeout": True,
            }, status=status.HTTP_406_NOT_ACCEPTABLE)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

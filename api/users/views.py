from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from api.users import serializers
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.urls import path
from . import views
from django.http import Http404


class RegistroView(generics.CreateAPIView):
    # TODO 13 y 15
    serializer_class = serializers.UsuarioSerializer
    def handle_exception(self, exc):
        if isinstance(exc, IntegrityError):
            return Response(status=status.HTTP_409_CONFLICT, data={"error": "Username already exists"})
        else:
            return super().handle_exception(exc)


class LoginView(generics.CreateAPIView):
    # TODO 16
    serializer_class = serializers.LoginSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            response = Response({"status": "success"})
            response.set_cookie(key='session', value=token.key, samesite='lax')
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuarioView(generics.RetrieveUpdateDestroyAPIView):
    # TODO 18 y 20
    serializer_class = serializers.UsuarioSerializer
    def get_object(self):
        # Retrieve session cookie
        token_key = self.request.COOKIES.get('session')
        if not token_key:
            raise Http404("No session cookie found")

        # Try to retrieve the token
        try:
            user = Token.objects.get(key=token_key).user
        except Token.DoesNotExist:
            raise Http404("No user found with the provided session token")

        return user
    
    def get(self, request):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)
    
    def put(self, request):
        serializer = self.get_serializer(self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# TODO 26
class LogoutView(generics.DestroyAPIView):
    # TODO 19
    
    def delete(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT, data={"status": "success"})
        try:
            if Token.objects.get(key=request.COOKIES.get('session')):
                response.delete_cookie('session') 
                return response
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED, data={"error": "No session found"})
        
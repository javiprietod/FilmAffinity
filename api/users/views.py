from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from api.users import serializers
from api.users import models
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.urls import path
from . import views
from django.http import Http404

def calculate_rating(movie_title):
    reviews = models.Review.objects.filter(movie__title=movie_title)
    if len(reviews) == 0:
        return 0
    rating = sum([review.rating for review in reviews]) / len(reviews)
    movie = models.Movie.objects.get(title=movie_title)
    movie.rating = rating
    movie.save()

class RegistroView(generics.CreateAPIView):
    serializer_class = serializers.UsuarioSerializer
    def handle_exception(self, exc):
        if isinstance(exc, IntegrityError):
            return Response(status=status.HTTP_409_CONFLICT, data={"error": "Username already exists"})
        else:
            return super().handle_exception(exc)


class LoginView(generics.CreateAPIView):
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


class LogoutView(generics.DestroyAPIView):
    
    def delete(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT, data={"status": "success"})
        try:
            if Token.objects.get(key=request.COOKIES.get('session')):
                response.delete_cookie('session') 
                return response
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED, data={"error": "No session found"})
        

class MovieList(generics.ListCreateAPIView):
    serializer_class = serializers.MovieSerializer
    

    def get_queryset(self):
        queryset = models.Movie.objects.all()
        title = self.request.query_params.get('title')
        if title is not None:
            queryset = queryset.filter(title__icontains=title)
        return queryset
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.MovieSerializer
    def get_object(self):
        try:
            return models.Movie.objects.get(pk=self.kwargs.get('title'))
        except models.Movie.DoesNotExist:
            raise Http404("No movie found with the provided title")
    
    def get(self, request, pk):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)
    
    def put(self, request, pk):
        serializer = self.get_serializer(self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND, data={"error": str(exc)})
        return super().handle_exception(exc)


class ReviewList(generics.ListCreateAPIView):
    serializer_class = serializers.ReviewSerializer
    
    def get_queryset(self):
        queryset = models.Review.objects.all()
        title = self.request.query_params.get('title', None)
        username = self.request.query_params.get('username', None)
        if title is not None:
            queryset = queryset.filter(movie__title=title)
        if username is not None:
            queryset = queryset.filter(user__username=username)
        return queryset
    
    def post(self, request):
        data = request.data
        # data['movie'] = models.Movie.objects.get(title=data['movie'])
        # data['user'] = models.Usuario.objects.get(username=data['user'])
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            movie_title = request.data.get('movie')
            calculate_rating(movie_title)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ReviewSerializer
    def get_object(self):
        try:
            return models.Review.objects.get(pk=self.kwargs.get('id'))
        except models.Review.DoesNotExist:
            raise Http404("No review found with the provided id")
    
    def get(self, request, id):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)
    
    def put(self, request, id):
        serializer = self.get_serializer(self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            movie_title = request.data.get('movie')
            calculate_rating(movie_title)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        review = self.get_object()
        movie = review.movie.title
        self.get_object().delete()
        calculate_rating(movie)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(status=status.HTTP_404_NOT_FOUND, data={"error": str(exc)})
        return super().handle_exception(exc)
    

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import (
    Case,
    When,
    Value,
    IntegerField,
    Q,
    Count,
)
from api.users import serializers
from api.users import models
from django.http import Http404
from django.core.paginator import Paginator
from rest_framework.decorators import api_view


def calculate_rating(movie_id):
    reviews = models.Review.objects.filter(movie__id=movie_id)
    if len(reviews) == 0:
        return 0
    rating = round(sum([review.rating for review in reviews]) / len(reviews), 1)
    movie = models.Movie.objects.get(id=movie_id)
    movie.rating = rating
    movie.save()


class RegistroView(generics.ListCreateAPIView):
    serializer_class = serializers.UsuarioSerializer

    def get_queryset(self):
        users = models.Usuario.objects.all()
        return users

    def handle_exception(self, exc):
        if isinstance(exc, ValidationError):
            if "email" in exc.detail:
                if exc.detail["email"][0] == "Enter a valid email address.":
                    return Response(
                        status=status.HTTP_400_BAD_REQUEST,
                        data={"error": exc.detail["email"][0]},
                    )
                return Response(
                    status=status.HTTP_409_CONFLICT,
                    data={"error": "Email already exists"},
                )
            elif "password" in exc.detail:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "Invalid password"},
                )
        return super().handle_exception(exc)


class LoginView(generics.CreateAPIView):
    serializer_class = serializers.LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            response = Response(status=status.HTTP_201_CREATED)
            response.set_cookie(
                key="session", value=token.key, samesite="None", secure=True
            )
            return response
        else:
            return Response(
                serializer.errors, status=status.HTTP_401_UNAUTHORIZED
            )


class UsuarioView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.UsuarioSerializer

    def get_object(self):
        # Retrieve session cookie
        token_key = self.request.COOKIES.get("session")
        if not token_key:
            raise Http404("No session cookie found")

        # Try to retrieve the token
        try:
            user = Token.objects.get(key=token_key).user
        except Token.DoesNotExist:
            raise Http404("No user found with the provided session token")

        return user

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"error": "No user found with the provided session token"},
            )
        return super().handle_exception(exc)

    def get(self, request):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    def put(self, request):
        serializer = self.get_serializer(self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        serializer = self.get_serializer(
            self.get_object(), data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        # Check if the user is authenticated
        token_key = request.COOKIES.get("session")
        if not token_key:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"error": "No session cookie found"},
            )
        response = Response(
            status=status.HTTP_204_NO_CONTENT, data={"status": "success"}
        )
        Token.objects.filter(key=request.COOKIES.get("session")).delete()
        response.delete_cookie("session")
        return response


class LogoutView(generics.DestroyAPIView):
    def delete(self, request):
        response = Response(
            status=status.HTTP_204_NO_CONTENT, data={"status": "success"}
        )
        token_key = request.COOKIES.get("session")
        if not token_key:
            return Response(
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
                data={"error": "No session cookie found"},
            )
        Token.objects.filter(key=request.COOKIES.get("session")).delete()
        response.delete_cookie("session")
        return response

    def handle_exception(self, exc):
        if isinstance(exc, ObjectDoesNotExist):
            return Response(
                status=status.HTTP_401_UNAUTHORIZED,
                data={"error": "No session found"},
            )
        return super().handle_exception(exc)


class MovieList(generics.ListCreateAPIView):
    serializer_class = serializers.MovieSerializer

    def get_queryset(self):
        queryset = models.Movie.objects.all()
        title = self.request.GET.get("title")
        if title is not None:
            queryset = queryset.filter(title__icontains=title)
        director = self.request.GET.get("director")
        if director is not None:
            queryset = queryset.filter(director__icontains=director)
        actor = self.request.GET.get("actor")
        if actor is not None:
            queryset = queryset.filter(actor__icontains=actor)
        genre = self.request.GET.get("genre")
        if genre is not None:
            queryset = queryset.filter(genre__icontains=genre)
        year = self.request.GET.get("year")
        if year is not None:
            queryset = queryset.filter(year=year)
        rating = self.request.GET.get("rating")
        if rating is not None:
            queryset = queryset.filter(rating__gte=rating)
        return queryset

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        token_key = request.COOKIES.get("session")
        if token_key:
            try:
                user = Token.objects.get(key=token_key).user
            except Token.DoesNotExist:
                raise Http404("No user found with the provided session token")
            user_reviews = models.Review.objects.filter(
                user__username=user.username
            )
            # If the user has no reviews, return the top rated movies
            if len(user_reviews) == 0:
                queryset = queryset.order_by("-rating")
            else:
                # Extract genres from user's reviews
                user_genres = []
                max_rating = 0
                for review in user_reviews:
                    if review.rating > max_rating:
                        max_rating = review.rating
                        genres = (
                            review.movie.genre.split(",")
                            if review.rating >= 3
                            else []
                        )
                        user_genres = [
                            genre.strip()
                            for genre in genres
                            if genre.strip() not in user_genres
                        ]

                # Find movies with similar genres that the user likes
                q_objects = [
                    Q(genre__icontains=genre.strip()) for genre in user_genres
                ]
                q = q_objects.pop()
                for obj in q_objects:
                    q |= obj

                recommended_movies = queryset.annotate(
                    similarity_score=Count(
                        Case(
                            *[
                                When(
                                    genre__icontains=genre.strip(),
                                    then=Value(1),
                                )
                                for genre in user_genres
                            ],
                            output_field=IntegerField()
                        )
                    )
                )

                queryset = recommended_movies.order_by(
                    "-similarity_score", "-rating"
                )

        limit = request.query_params.get("limit", 9)
        skip = request.query_params.get("skip", 0)
        try:
            limit = int(limit)
            skip = int(skip)
        except ValueError:
            return Response(
                {"error": "Limit and skip parameters must be integers."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        paginator = Paginator(queryset, limit)
        page = paginator.get_page(skip // limit + 1)
        serializer = self.get_serializer(page, many=True)
        return Response(serializer.data)


class MovieDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.MovieSerializer

    def get_object(self):
        try:
            return models.Movie.objects.get(pk=self.kwargs.get("id"))
        except models.Movie.DoesNotExist:
            raise Http404("No movie found with the provided id")

    def get(self, request, id):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    def put(self, request, id):
        serializer = self.get_serializer(self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"error": str(exc)}
            )
        return super().handle_exception(exc)


@api_view(["POST"])
def movie_bulk_create(request):
    if request.method == "POST":
        data = request.data
        if not isinstance(data, list):
            return Response(
                {"error": "Request body must be a list"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = serializers.MovieSerializer(data=data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class ReviewList(generics.ListCreateAPIView):
    serializer_class = serializers.ReviewSerializer

    def get_queryset(self):
        queryset = models.Review.objects.all()
        id = self.request.GET.get("movieid", None)
        username = self.request.GET.get("username", None)
        if id is not None:
            queryset = queryset.filter(movie__id=id)
        if username is not None:
            queryset = queryset.filter(user__username=username)
        return queryset

    def post(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            movie_id = request.data.get("movie")
            calculate_rating(movie_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.ReviewSerializer

    def get_object(self):
        try:
            return models.Review.objects.get(pk=self.kwargs.get("id"))
        except models.Review.DoesNotExist:
            raise Http404("No review found with the provided id")

    def get(self, request, id):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    def put(self, request, id):
        serializer = self.get_serializer(self.get_object(), data=request.data)
        if serializer.is_valid():
            serializer.save()
            movie_id = request.data.get("movie")
            calculate_rating(movie_id)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        serializer = self.get_serializer(
            self.get_object(), data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            movie_id = request.data.get("movie")
            calculate_rating(movie_id)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        review = self.get_object()
        movie_id = review.movie.id
        self.get_object().delete()
        calculate_rating(movie_id)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def handle_exception(self, exc):
        if isinstance(exc, Http404):
            return Response(
                status=status.HTTP_404_NOT_FOUND, data={"error": str(exc)}
            )
        return super().handle_exception(exc)

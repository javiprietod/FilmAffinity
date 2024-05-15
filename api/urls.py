from django.contrib import admin
from django.urls import path
from api.users import views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("api/users/", views.RecordView.as_view(), name="record"),
    path("api/users/login/", views.LoginView.as_view(), name="login"),
    path("api/users/me/", views.UserView.as_view(), name="user"),
    path("api/users/logout/", views.LogoutView.as_view(), name="logout"),
    path("api/movies/", views.MovieList.as_view(), name="movies"),
    path("api/movies/<int:id>/", views.MovieDetail.as_view(), name="movie_detail"),
    path("api/movies/bulk/", views.movie_bulk_create, name="movies_bulk"),
    path("api/reviews/", views.ReviewList.as_view(), name="reviews"),
    path(
        "api/reviews/<int:id>/",
        views.ReviewDetail.as_view(),
        name="review_detail",
    ),
]

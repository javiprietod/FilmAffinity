from django.db import models
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    nombre = models.CharField(max_length=256)
    tel = models.CharField(max_length=32)
    email = models.EmailField(max_length=128, primary_key=True)
    password = models.CharField(max_length=128)

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        return f"""
        nombre: {self.nombre}
        tel: {self.tel}
        email: {self.email}
        password: {self.password}
        """


class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    year = models.IntegerField()
    duration = models.IntegerField()
    rating = models.FloatField(default=0.0, null=True, blank=True)
    genre = models.CharField(max_length=256)
    summary = models.TextField()
    director = models.CharField(max_length=256)
    thumbnail = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"""
        title: {self.title}
        year: {self.year}
        duration: {self.duration}
        rating: {self.rating}
        genre: {self.genre}
        summary: {self.summary}
        director: {self.director}
        """


class Review(models.Model):
    id = models.AutoField(primary_key=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    rating = models.FloatField()
    body = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"""
        movie: {self.movie}
        user: {self.user}
        rating: {self.rating}
        body: {self.body}
        """

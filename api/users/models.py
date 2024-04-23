from django.db import models
from django.contrib.auth.models import AbstractUser


class Usuario(AbstractUser):
    # TODO 2
    nombre = models.CharField(max_length=256)
    tel = models.CharField(max_length=32)
    email = models.EmailField(max_length=128)
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

class Actor(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()

    def __str__(self):
        return self.name

class Movie(models.Model):
    # TODO 3
    title = models.CharField(max_length=100)
    year = models.IntegerField()
    duration = models.IntegerField()
    rating = models.FloatField()
    genre = models.CharField(max_length=256)
    summary = models.TextField()
    director = models.CharField(max_length=256)
    actors = models.ManyToManyField(Actor)
    thumbnail = models.ImageField(upload_to='thumbnails/')

    def __str__(self):
        return f"""
        title: {self.title}
        year: {self.year}
        duration: {self.duration}
        rating: {self.rating}
        genre: {self.genre}
        summary: {self.summary}
        director: {self.director}
        actors: {self.actors}
        """
    


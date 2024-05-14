from rest_framework.exceptions import ValidationError
from django.test import SimpleTestCase, TestCase
from api.users import serializers
from api.users import models


class TestUsuarioSerializer(SimpleTestCase):
    def test_funcionalidad_validar_password(self):
        # Caso 1: Contraseña válida
        password = "Aa123456"
        self.assertEqual(
            serializers.UsuarioSerializer().validate_password(password),
            password,
        )
        # Caso 2: Contraseña sin número
        password_erronea = "AaBbCcDd"
        self.assertRaises(
            ValidationError,
            serializers.UsuarioSerializer().validate_password,
            password_erronea,
        )

    def test_funcionalidad_validar_telefono(self):
        # Caso 1: Teléfono válido 1
        tel = "623456789"
        self.assertEqual(
            serializers.UsuarioSerializer().validate_tel(tel),
            tel,
        )
        # Caso 2: Teléfono válido 2
        tel = "+34623456789"
        self.assertEqual(
            serializers.UsuarioSerializer().validate_tel(tel),
            tel,
        )
        # Caso 3: Teléfono válido 3
        tel = "+34 623456789"
        self.assertEqual(
            serializers.UsuarioSerializer().validate_tel(tel),
            tel,
        )
        # Caso 4: Teléfono erróneo
        tel_erroneo = "123456789"
        self.assertRaises(
            ValidationError,
            serializers.UsuarioSerializer().validate_tel,
            tel_erroneo,
        )


class TestRegistroView(TestCase):
    def test_funcionalidad_registro(self):
        data = {
            "nombre": "Juan",
            "tel": "623456789",
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

        # Verificar que el usuario se haya creado
        usuario = models.Usuario.objects.get(email=data["email"])
        self.assertEqual(usuario.nombre, data["nombre"])
        self.assertEqual(usuario.tel, data["tel"])
        self.assertEqual(usuario.email, data["email"])

    def test_funcionalidad_registro_usuario_existente(self):
        data = {
            "nombre": "Juan",
            "tel": "623456789",
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }

        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 201)

        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 409)

    def test_funcionalidad_registro_contrasena_invalida(self):
        data = {
            "nombre": "Juan",
            "tel": "623456789",
            "email": "hola@gmail.com",
            "password": "AaBbCcDd",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 400)

    def test_funcionalidad_registro_telefono_invalido(self):
        data = {
            "nombre": "Juan",
            "tel": "123456789",
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 400)


class TestLoginView(TestCase):
    def setUp(self):
        data = {
            "nombre": "Juan",
            "tel": "623456789",
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

    def test_funcionalidad_login(self):
        data = {
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)
        self.assertIn(
            "session", response.cookies, "Session cookie not found in response"
        )

    def test_funcionalidad_login_usuario_inexistente(self):
        data = {
            "email": "hola1@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 401)
        self.assertNotIn(
            "session",
            response.cookies,
            "Session cookie should not be in response",
        )

    def test_funcionalidad_login_password_incorrecto(self):
        data = {
            "email": "hola@gmail.com",
            "password": "Aa1234567",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 401)
        self.assertNotIn(
            "session",
            response.cookies,
            "Session cookie should not be in response",
        )


class TestUsuarioView(TestCase):
    def setUp(self):
        self.data = {
            "nombre": "Juan",
            "tel": "623456789",
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", self.data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

    def test_funcionalidad_usuario(self):
        # Iniciar sesión y comprobar que el usuario se ha logueado
        data = {
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["nombre"], self.data["nombre"])
        self.assertEqual(response.data["tel"], self.data["tel"])
        self.assertEqual(response.data["email"], self.data["email"])

    def test_funcionalidad_usuario_sin_sesion(self):
        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 404)

    def test_funcionalidad_actualizar_usuario(self):
        # Iniciar sesión
        data = {
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        data = {
            "nombre": "Juanito",
            "tel": "623456789",
        }
        response = self.client.patch(
            "/api/users/me/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["nombre"], data["nombre"])
        self.assertEqual(response.data["tel"], data["tel"])

    def test_funcionalidad_actualizar_usuario_sin_sesion(self):
        data = {
            "nombre": "Juanito",
            "tel": "623456789",
        }
        response = self.client.patch(
            "/api/users/me/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

    def test_funcionalidad_actualizar_usuario_contrasena(self):
        # Iniciar sesión
        data = {
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        data = {
            "nombre": "Juanito",
            "tel": "623456789",
            "password": "Aa1234567",
        }
        response = self.client.patch(
            "/api/users/me/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        # Verificar que la contraseña se ha actualizado
        data = {
            "email": "hola@gmail.com",
            "password": "Aa1234567",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

    def test_funcionalidad_borrar_usuario(self):
        # Iniciar sesión
        data = {
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        response = self.client.delete("/api/users/me/")
        self.assertEqual(response.status_code, 204)

        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 404)
        self.assertNotIn(
            "session",
            response.cookies,
            "Session cookie should not be in response",
        )

    def test_funcionalidad_borrar_usuario_sin_sesion(self):
        response = self.client.delete("/api/users/me/")
        self.assertEqual(response.status_code, 404)


class TestLogoutView(TestCase):
    def setUp(self):
        self.data = {
            "nombre": "Juan",
            "tel": "623456789",
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", self.data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

    def test_funcionalidad_logout(self):
        # Iniciar sesión
        data = {
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        response = self.client.delete("/api/users/logout/")
        self.assertEqual(response.status_code, 204)

        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 404)

    def test_funcionalidad_logout_sin_sesion(self):
        response = self.client.delete("/api/users/logout/")
        self.assertEqual(response.status_code, 405)


class TestMovieList(TestCase):
    def test_funcionalidad_lista_peliculas(self):
        response = self.client.get("/api/movies/")
        self.assertEqual(response.status_code, 200)

    def test_funcionalidad_crear_pelicula(self):
        data = {
            "title": "Pelicula 1",
            "summary": "Descripcion 1",
            "year": 2022,
            "duration": "130",
            "director": "Director 1",
            "genre": "Genero 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.data["title"], data["title"])
        self.assertEqual(response.data["summary"], data["summary"])
        self.assertEqual(response.data["year"], data["year"])

        # Verificar que la película se haya creado
        movie = models.Movie.objects.get(title=data["title"])
        self.assertEqual(movie.title, data["title"])
        self.assertEqual(movie.summary, data["summary"])
        self.assertEqual(movie.year, data["year"])


class TestMovieDetail(TestCase):
    def test_funcionalidad_detalle_pelicula(self):
        data = {
            "title": "Pelicula 1",
            "summary": "Descripcion 1",
            "year": 2022,
            "duration": 130,
            "director": "Director 1",
            "genre": "Genero 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        response = self.client.get(f"/api/movies/{movie.id}/")
        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data["title"], data["title"])
        self.assertEqual(response.data["summary"], data["summary"])
        self.assertEqual(response.data["year"], data["year"])

    def test_funcionalidad_actualizar_pelicula(self):
        data = {
            "title": "Pelicula 1",
            "summary": "Descripcion 1",
            "year": 2022,
            "duration": 130,
            "director": "Director 1",
            "genre": "Genero 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        data = {
            "title": "Pelicula 2",
            "summary": "Descripcion 2",
            "year": 2023,
            "duration": 140,
            "director": "Director 2",
            "genre": "Genero 2",
        }

        response = self.client.patch(
            f"/api/movies/{movie.id}/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        movie = models.Movie.objects.get(title=data["title"])
        self.assertEqual(movie.title, data["title"])
        self.assertEqual(movie.summary, data["summary"])
        self.assertEqual(movie.year, data["year"])

        data = {
            "year": "hola",
        }

        response = self.client.patch(
            f"/api/movies/{movie.id}/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    def test_funcionalidad_eliminar_pelicula(self):
        data = {
            "title": "Pelicula 1",
            "summary": "Descripcion 1",
            "year": 2022,
            "duration": 130,
            "director": "Director 1",
            "genre": "Genero 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        response = self.client.delete(f"/api/movies/{movie.id}/")
        self.assertEqual(response.status_code, 204)

        with self.assertRaises(models.Movie.DoesNotExist):
            models.Movie.objects.get(title=data["title"])

    def test_funcionalidad_eliminar_pelicula_inexistente(self):
        response = self.client.delete("/api/movies/1/")
        self.assertEqual(response.status_code, 404)


class TestBulkMovie(TestCase):
    def test_funcionalidad_bulk_create(self):
        data = [
            {
                "title": "Pelicula 1",
                "summary": "Descripcion 1",
                "year": 2022,
                "duration": 130,
                "director": "Director 1",
                "genre": "Genero 1",
            },
            {
                "title": "Pelicula 2",
                "summary": "Descripcion 2",
                "year": 2023,
                "duration": 140,
                "director": "Director 2",
                "genre": "Genero 2",
            },
        ]

        response = self.client.post("/api/movies/bulk/", data, content_type="application/json")
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.data[0]["title"], data[0]["title"])
        self.assertEqual(response.data[0]["summary"], data[0]["summary"])
        self.assertEqual(response.data[0]["year"], data[0]["year"])

        self.assertEqual(response.data[1]["title"], data[1]["title"])
        self.assertEqual(response.data[1]["summary"], data[1]["summary"])
        self.assertEqual(response.data[1]["year"], data[1]["year"])

        # Verificar que las películas se hayan creado
        movie1 = models.Movie.objects.get(title=data[0]["title"])
        self.assertEqual(movie1.title, data[0]["title"])
        self.assertEqual(movie1.summary, data[0]["summary"])
        self.assertEqual(movie1.year, data[0]["year"])

        movie2 = models.Movie.objects.get(title=data[1]["title"])
        self.assertEqual(movie2.title, data[1]["title"])
        self.assertEqual(movie2.summary, data[1]["summary"])
        self.assertEqual(movie2.year, data[1]["year"])

    def test_funcionalidad_bulk_create_con_error(self):
        data = {
                "title": "Pelicula 1",
                "summary": "Descripcion 1",
                "year": 2022,
                "duration": 130,
                "director": "Director 1",
                "genre": "Genero 1",
            }

        response = self.client.post("/api/movies/bulk/", data, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        data = {
                "title": "Pelicula 1",
                "summary": "Descripcion 1",
                "year": "error",
                "duration": 130,
                "director": "Director 1",
                "genre": "Genero 1",
            }

        response = self.client.post("/api/movies/bulk/", data, content_type="application/json")
        self.assertEqual(response.status_code, 400)


class TestSortMovies(TestCase):
    def setUp(self):
        self.data = {
            "nombre": "Juan",
            "tel": "623456789",
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", self.data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

        login_data = {
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }

        response = self.client.post("/api/users/login/", login_data)
        self.assertEqual(response.status_code, 201)

        self.data = [
            {
                "title": "Pelicula 1",
                "summary": "Descripcion 1",
                "year": 2022,
                "duration": 130,
                "director": "Director 1",
                "genre": "Genero 1",
                "rating": 5
            },
            {
                "title": "Pelicula 2",
                "summary": "Descripcion 2",
                "year": 2023,
                "duration": 140,
                "director": "Director 2",
                "genre": "Genero 2",
                "rating": 2
            },
            {
                "title": "Pelicula 3",
                "summary": "Descripcion 3",
                "year": 2024,
                "duration": 150,
                "director": "Director 3",
                "genre": "Genero 3",
                "rating": 3
            },
        ]
        response = self.client.post("/api/movies/bulk/", self.data, content_type="application/json")
        self.assertEqual(response.status_code, 201)


        movie = models.Movie.objects.get(title=self.data[1]["title"])

        data = {
            "movie": movie.id,
            "rating": 4,
            "body": "Comentario",
            "user": "hola@gmail.com",
        }

        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, 201)
            


    def test_funcionalidad_sort_movies(self):

        response = self.client.get("/api/movies/")
        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data[0]["title"], self.data[1]["title"])
        self.assertEqual(response.data[1]["title"], self.data[0]["title"])
        self.assertEqual(response.data[2]["title"], self.data[2]["title"])

class TestReview(TestCase):
    def setUp(self):
        data = {
            "nombre": "Juan",
            "tel": "623456789",
            "email": "prueba@prueba.com",
            "password": "PRUEBAprueba1",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 201)

    def test_funcionalidad_crear_review(self):
        data = {
            "title": "Pelicula 1",
            "summary": "Descripcion 1",
            "year": 2022,
            "duration": 130,
            "director": "Director 1",
            "genre": "Genero 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        data = {
            "movie": movie.id,
            "rating": 5,
            "body": "Comentario",
            "user": "prueba@prueba.com",
        }

        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.data["rating"], data["rating"])
        self.assertEqual(response.data["body"], data["body"])
        self.assertEqual(response.data["user"], data["user"])

        # Verificar que la review se haya creado
        review = models.Review.objects.get(movie=movie)
        self.assertEqual(review.rating, data["rating"])
        self.assertEqual(review.body, data["body"])

    def test_funcionalidad_actualizar_review(self):
        data = {
            "title": "Pelicula 1",
            "summary": "Descripcion 1",
            "year": 2022,
            "duration": 130,
            "director": "Director 1",
            "genre": "Genero 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        data = {
            "movie": movie.id,
            "rating": 5,
            "body": "Comentario",
            "user": "prueba@prueba.com",
        }

        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, 201)

        review = models.Review.objects.get(movie=movie)

        data = {
            "rating": 4,
            "body": "Comentario 2",
        }

        response = self.client.patch(
            f"/api/reviews/{review.id}/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        review = models.Review.objects.get(movie=movie)
        self.assertEqual(review.rating, data["rating"])
        self.assertEqual(review.body, data["body"])

    def test_funcionalidad_eliminar_review(self):
        data = {
            "title": "Pelicula 1",
            "summary": "Descripcion 1",
            "year": 2022,
            "duration": 130,
            "director": "Director 1",
            "genre": "Genero 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        data = {
            "movie": movie.id,
            "rating": 5,
            "body": "Comentario",
            "user": "prueba@prueba.com",
        }

        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, 201)

        review = models.Review.objects.get(movie=movie)

        response = self.client.delete(f"/api/reviews/{review.id}/")
        self.assertEqual(response.status_code, 204)

        with self.assertRaises(models.Review.DoesNotExist):
            models.Review.objects.get(movie=movie)

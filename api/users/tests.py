from rest_framework.exceptions import ValidationError
from rest_framework.authtoken.models import Token
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


class TestRegistroView(TestCase):
    def test_funcionalidad_registro(self):
        data = {
            "nombre": "Juan",
            "tel": "1234567890",
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


class TestLoginView(TestCase):
    def setUp(self):
        data = {
            "nombre": "Juan",
            "tel": "1234567890",
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
        self.assertEqual(response.status_code, 200)
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
            "session", response.cookies, "Session cookie should not be in response"
        )

    def test_funcionalidad_login_password_incorrecto(self):
        data = {
            "email": "hola@gmail.com",
            "password": "Aa1234567",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 401)
        self.assertNotIn(
            "session", response.cookies, "Session cookie should not be in response"
        )


class TestUsuarioView(TestCase):
    def setUp(self):
        self.data = {
            "nombre": "Juan",
            "tel": "1234567890",
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
        self.assertEqual(response.status_code, 200)

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
        self.assertEqual(response.status_code, 200)

        data = {
            "nombre": "Juanito",
            "tel": "1234567890",
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
            "tel": "1234567890",
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
        self.assertEqual(response.status_code, 200)

        data = {
            "nombre": "Juanito",
            "tel": "1234567890",
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
        self.assertEqual(response.status_code, 200)


class TestLogoutView(TestCase):
    def setUp(self):
        self.data = {
            "nombre": "Juan",
            "tel": "1234567890",
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
        self.assertEqual(response.status_code, 200)

        response = self.client.delete("/api/users/logout/")
        self.assertEqual(response.status_code, 204)

        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 404)

    def test_funcionalidad_logout_sin_sesion(self):
        response = self.client.post("/api/users/logout/")
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

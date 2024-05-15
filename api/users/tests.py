from rest_framework.exceptions import ValidationError
from django.test import SimpleTestCase, TestCase
from api.users import serializers
from api.users import models


class TestUserSerializer(SimpleTestCase):
    def test_feature_validate_password(self):
        # Case 1: Invalid password
        password = "Aa123456"
        self.assertEqual(
            serializers.UserSerializer().validate_password(password),
            password,
        )
        # Case 2: Password without number
        incorrect_pass = "AaBbCcDd"
        self.assertRaises(
            ValidationError,
            serializers.UserSerializer().validate_password,
            incorrect_pass,
        )

    def test_feature_validate_telephone(self):
        # Case 1: Valid phone number 1
        tel = "623456789"
        self.assertEqual(
            serializers.UserSerializer().validate_tel(tel),
            tel,
        )
        # Case 2: Valid phone number 2
        tel = "+34623456789"
        self.assertEqual(
            serializers.UserSerializer().validate_tel(tel),
            tel,
        )
        # Case 3: Valid phone number 3
        tel = "+34 623456789"
        self.assertEqual(
            serializers.UserSerializer().validate_tel(tel),
            tel,
        )
        # Case 4: Wrong phone number
        incorrect_tel = "123456789"
        self.assertRaises(
            ValidationError,
            serializers.UserSerializer().validate_tel,
            incorrect_tel,
        )


class TestRecordView(TestCase):
    def test_feature_record(self):
        data = {
            "name": "Juan",
            "tel": "623456789",
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

        user = models.User.objects.get(email=data["email"])
        self.assertEqual(user.name, data["name"])
        self.assertEqual(user.tel, data["tel"])
        self.assertEqual(user.email, data["email"])

    def test_feature_record_existing_user(self):
        data = {
            "name": "Juan",
            "tel": "623456789",
            "email": "example@gmail.com",
            "password": "Aa123456",
        }

        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 201)

        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 409)

    def test_feature_record_invalid_password(self):
        data = {
            "name": "Juan",
            "tel": "623456789",
            "email": "example@gmail.com",
            "password": "AaBbCcDd",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 406)

    def test_feature_record_invalid_telephone(self):
        data = {
            "name": "Juan",
            "tel": "123456789",
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 400)


class TestLoginView(TestCase):
    def setUp(self):
        data = {
            "name": "Juan",
            "tel": "623456789",
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

    def test_feature_login(self):
        data = {
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)
        self.assertIn(
            "session", response.cookies, "Session cookie not found in response"
        )

    def test_feature_login_inexistent_user(self):
        data = {
            "email": "example1@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 401)
        self.assertNotIn(
            "session",
            response.cookies,
            "Session cookie should not be in response",
        )

    def test_feature_login_incorrect_password(self):
        data = {
            "email": "example@gmail.com",
            "password": "Aa1234567",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 401)
        self.assertNotIn(
            "session",
            response.cookies,
            "Session cookie should not be in response",
        )


class TestUserView(TestCase):
    def setUp(self):
        self.data = {
            "name": "Juan",
            "tel": "623456789",
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", self.data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

    def test_feature_user(self):
        data = {
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], self.data["name"])
        self.assertEqual(response.data["tel"], self.data["tel"])
        self.assertEqual(response.data["email"], self.data["email"])

    def test_feature_user_without_session(self):
        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 404)

    def test_feature_update_user(self):
        data = {
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        data = {
            "name": "Juanito",
            "tel": "623456789",
        }
        response = self.client.patch(
            "/api/users/me/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], data["name"])
        self.assertEqual(response.data["tel"], data["tel"])

    def test_feature_update_user_without_session(self):
        data = {
            "name": "Juanito",
            "tel": "623456789",
        }
        response = self.client.patch(
            "/api/users/me/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

    def test_feature_update_user_password(self):
        data = {
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        data = {
            "name": "Juanito",
            "tel": "623456789",
            "password": "Aa1234567",
        }
        response = self.client.patch(
            "/api/users/me/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        data = {
            "email": "example@gmail.com",
            "password": "Aa1234567",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

    def test_feature_delete_user(self):
        data = {
            "email": "example@gmail.com",
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

    def test_feature_delete_user_without_session(self):
        response = self.client.delete("/api/users/me/")
        self.assertEqual(response.status_code, 404)


class TestLogoutView(TestCase):
    def setUp(self):
        self.data = {
            "name": "Juan",
            "tel": "623456789",
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", self.data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

    def test_feature_logout(self):
        data = {
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/login/", data)
        self.assertEqual(response.status_code, 201)

        response = self.client.delete("/api/users/logout/")
        self.assertEqual(response.status_code, 204)

        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 404)

    def test_feature_logout_without_session(self):
        response = self.client.delete("/api/users/logout/")
        self.assertEqual(response.status_code, 405)


class TestMovieList(TestCase):
    def test_feature_movie_list(self):
        response = self.client.get("/api/movies/")
        self.assertEqual(response.status_code, 200)

    def test_feature_create_movie(self):
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": 2022,
            "running_time": "130",
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.data["title"], data["title"])
        self.assertEqual(response.data["summary"], data["summary"])
        self.assertEqual(response.data["year"], data["year"])

        movie = models.Movie.objects.get(title=data["title"])
        self.assertEqual(movie.title, data["title"])
        self.assertEqual(movie.summary, data["summary"])
        self.assertEqual(movie.year, data["year"])


class TestMovieDetail(TestCase):
    def test_feature_movie_detail(self):
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": 2022,
            "running_time": 130,
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        response = self.client.get(f"/api/movies/{movie.id}/")
        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data["title"], data["title"])
        self.assertEqual(response.data["summary"], data["summary"])
        self.assertEqual(response.data["year"], data["year"])

    def test_feature_update_movie(self):
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": 2022,
            "running_time": 130,
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        data = {
            "title": "Movie 2",
            "summary": "Description 2",
            "year": 2023,
            "running_time": 140,
            "director": "Director 2",
            "genre": "Genre 2",
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
            "year": "hello",
        }

        response = self.client.patch(
            f"/api/movies/{movie.id}/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

    def test_feature_delete_movie(self):
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": 2022,
            "running_time": 130,
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        response = self.client.delete(f"/api/movies/{movie.id}/")
        self.assertEqual(response.status_code, 204)

        with self.assertRaises(models.Movie.DoesNotExist):
            models.Movie.objects.get(title=data["title"])

    def test_feature_delete_inexistent_movie(self):
        response = self.client.delete("/api/movies/1/")
        self.assertEqual(response.status_code, 404)


class TestBulkMovie(TestCase):
    def test_feature_bulk_create(self):
        data = [
            {
                "title": "Movie 1",
                "summary": "Description 1",
                "year": 2022,
                "running_time": 130,
                "director": "Director 1",
                "genre": "Genre 1",
            },
            {
                "title": "Movie 2",
                "summary": "Description 2",
                "year": 2023,
                "running_time": 140,
                "director": "Director 2",
                "genre": "Genre 2",
            },
        ]

        response = self.client.post(
            "/api/movies/bulk/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.data[0]["title"], data[0]["title"])
        self.assertEqual(response.data[0]["summary"], data[0]["summary"])
        self.assertEqual(response.data[0]["year"], data[0]["year"])

        self.assertEqual(response.data[1]["title"], data[1]["title"])
        self.assertEqual(response.data[1]["summary"], data[1]["summary"])
        self.assertEqual(response.data[1]["year"], data[1]["year"])

        movie1 = models.Movie.objects.get(title=data[0]["title"])
        self.assertEqual(movie1.title, data[0]["title"])
        self.assertEqual(movie1.summary, data[0]["summary"])
        self.assertEqual(movie1.year, data[0]["year"])

        movie2 = models.Movie.objects.get(title=data[1]["title"])
        self.assertEqual(movie2.title, data[1]["title"])
        self.assertEqual(movie2.summary, data[1]["summary"])
        self.assertEqual(movie2.year, data[1]["year"])

    def test_feature_bulk_create_with_error(self):
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": 2022,
            "running_time": 130,
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post(
            "/api/movies/bulk/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": "error",
            "running_time": 130,
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post(
            "/api/movies/bulk/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)


class TestSortMovies(TestCase):
    def setUp(self):
        self.data = {
            "name": "Juan",
            "tel": "623456789",
            "email": "example@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post("/api/users/", self.data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn(
            "password", response.data, "Password should not be in response"
        )

        login_data = {
            "email": "example@gmail.com",
            "password": "Aa123456",
        }

        response = self.client.post("/api/users/login/", login_data)
        self.assertEqual(response.status_code, 201)

        self.data = [
            {
                "title": "Movie 1",
                "summary": "Description 1",
                "year": 2022,
                "running_time": 130,
                "director": "Director 1",
                "genre": "Genre 1",
                "rating": 5,
            },
            {
                "title": "Movie 2",
                "summary": "Description 2",
                "year": 2023,
                "running_time": 140,
                "director": "Director 2",
                "genre": "Genre 2",
                "rating": 2,
            },
            {
                "title": "Movie 3",
                "summary": "Description 3",
                "year": 2024,
                "running_time": 150,
                "director": "Director 3",
                "genre": "Genre 3",
                "rating": 3,
            },
        ]
        response = self.client.post(
            "/api/movies/bulk/", self.data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=self.data[1]["title"])

        data = {
            "movie": movie.id,
            "rating": 4,
            "body": "Comment",
            "user": "example@gmail.com",
        }

        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, 201)

    def test_feature_sort_movies(self):
        response = self.client.get("/api/movies/")
        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data[0]["title"], self.data[1]["title"])
        self.assertEqual(response.data[1]["title"], self.data[0]["title"])
        self.assertEqual(response.data[2]["title"], self.data[2]["title"])


class TestReview(TestCase):
    def setUp(self):
        data = {
            "name": "Juan",
            "tel": "623456789",
            "email": "example@example.com",
            "password": "Example123",
        }
        response = self.client.post("/api/users/", data)
        self.assertEqual(response.status_code, 201)

    def test_feature_create_review(self):
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": 2022,
            "running_time": 130,
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        data = {
            "movie": movie.id,
            "rating": 5,
            "body": "Comment",
            "user": "example@example.com",
        }

        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.data["rating"], data["rating"])
        self.assertEqual(response.data["body"], data["body"])
        self.assertEqual(response.data["user"], data["user"])

        review = models.Review.objects.get(movie=movie)
        self.assertEqual(review.rating, data["rating"])
        self.assertEqual(review.body, data["body"])

    def test_feature_update_review(self):
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": 2022,
            "running_time": 130,
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        data = {
            "movie": movie.id,
            "rating": 5,
            "body": "Comment",
            "user": "example@example.com",
        }

        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, 201)

        review = models.Review.objects.get(movie=movie)

        data = {
            "rating": 4,
            "body": "Comment 2",
        }

        response = self.client.patch(
            f"/api/reviews/{review.id}/", data, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

        review = models.Review.objects.get(movie=movie)
        self.assertEqual(review.rating, data["rating"])
        self.assertEqual(review.body, data["body"])

    def test_feature_delete_review(self):
        data = {
            "title": "Movie 1",
            "summary": "Description 1",
            "year": 2022,
            "running_time": 130,
            "director": "Director 1",
            "genre": "Genre 1",
        }

        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, 201)

        movie = models.Movie.objects.get(title=data["title"])

        data = {
            "movie": movie.id,
            "rating": 5,
            "body": "Comment",
            "user": "example@example.com",
        }

        response = self.client.post("/api/reviews/", data)
        self.assertEqual(response.status_code, 201)

        review = models.Review.objects.get(movie=movie)

        response = self.client.delete(f"/api/reviews/{review.id}/")
        self.assertEqual(response.status_code, 204)

        with self.assertRaises(models.Review.DoesNotExist):
            models.Review.objects.get(movie=movie)

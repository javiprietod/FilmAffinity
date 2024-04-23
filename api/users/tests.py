from rest_framework.exceptions import ValidationError
from django.test import SimpleTestCase, TestCase
from api.users import serializers


class TestUsuarioSerializer(SimpleTestCase):
    # TODO 21
    def test_funcionalidad_validar_password(self):
        # Caso 1: Contraseña válida
        password = "Aa123456"
        self.assertEqual(
                serializers.UsuarioSerializer().validate_password(password), 
                password,
        )
        # Caso 2: Contraseña sin número
        password_erronea = "AaBbCcDd"
        self.assertRaises(ValidationError, serializers.UsuarioSerializer().validate_password, password_erronea)

class TestRegistroView(TestCase):
    # TODO 22
    def test_funcionalidad_registro(self):
        
        data = {
            "nombre": "Juan",
            "tel": "1234567890",
            "email": "hola@gmail.com",
            "password": "Aa123456",
        }
        response = self.client.post('/api/users/', data)
        self.assertEqual(response.status_code, 201)

        self.assertNotIn("password", response.data, "Password should not be in response")





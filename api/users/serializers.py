import re
from rest_framework import serializers, exceptions
from django.contrib.auth import authenticate
from api.users import models


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        # TODO 5 y 22
        model = models.Usuario
        fields = ["nombre", "tel", "email", "password"]
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self, value):
        # TODO 7: completar
        if len(value) >= 8:
            if re.search("[a-z]", value):
                if re.search("[A-Z]", value):
                    if re.search("[0-9]", value):
                        return value
                    else:
                        raise exceptions.ValidationError(
                            "Password must contain at least one number"
                        )
                else:
                    raise exceptions.ValidationError(
                        "Password must contain at least one uppercase letter"
                    )
            else:
                raise exceptions.ValidationError(
                    "Password must contain at least one lowercase letter"
                )
        else:
            raise exceptions.ValidationError("Password too short")



    # TODO 8
    def create(self, validated_data):
        return models.Usuario.objects.create_user(username=validated_data['email'], **validated_data)

    def update(self, instance, validated_data):
        if (validated_data.get('password')):
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)


class LoginSerializer(serializers.Serializer):
    # TODO 10
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        # TODO 11
        
        # user = authenticate(**data)
        username = data.get('email')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            return user
        raise exceptions.AuthenticationFailed("Invalid credentials")



class MovieSerializer(serializers.ModelSerializer):
    # TODO 12
    class Meta:
        model = models.Movie
        fields = "__all__"

    def create(self, validated_data):
        movie = models.Movie.objects.create(**validated_data)
        return movie
    

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = "__all__"

    def create(self, validated_data):
        return models.Review.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.rating = validated_data.get('rating', instance.rating)
        instance.body = validated_data.get('body', instance.body)
        instance.save()
        return instance
    
    def delete(self, instance):
        instance.delete()
        return instance
    
    def get(self, instance):
        return instance


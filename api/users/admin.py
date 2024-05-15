from django.contrib import admin
from api.users import models

admin.site.register(models.User)
admin.site.register(models.Movie)
admin.site.register(models.Review)

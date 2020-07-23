
# Healthcare/models.py

from django.db import models
# Create your models here.


class Person(models.Model):
    name = models.CharField(max_length=240)
    height = models.TextField(default="")
    age = models.TextField(default="")
    notes = models.TextField(default="")

    def __str__(self):
        return self.name

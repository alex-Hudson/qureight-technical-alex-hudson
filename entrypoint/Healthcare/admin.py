
# Healthcare/admin.py

from django.contrib import admin
from .models import Person


class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'height', 'age', 'notes')
    list_filter = ['name']
    ordering = ('-name',)


# Register your models here.
admin.site.register(Person, PersonAdmin)

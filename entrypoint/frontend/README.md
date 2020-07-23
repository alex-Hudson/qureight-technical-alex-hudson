## Qureight Patient Viewer App

## TO RUN:

1. Create a postgress 12 database called healthcare
2. Point django to the database (you may need to change settings.py)
3. run pip install
4. run healthcare_env.bat
5. cd to entrypoint
6. To create entries in the database first run python manage.py createsuperuser (and give a name and password)
7. run python manage.py runserver
8. go to the server address as directed by the cmd window
9. You should now be able to login but you will need to create entries in the db
10. Go to ther server address /admin and type in your credentials
11. Create a few people
12. Return to the app to view

## Notes

1. I used django and postgress rather than node as directed because I wanted to demostrate my knowledge of crsf security
2. I used React to render the frontend to demostrate my ability with React (and modern architecture)
3. I didn't complete the ability to update or delete information from the GUI- however that would be simple to do with django.
   Django also provides a method of adding and updating when using the admin page

## Further work

1. Create CRUD ability from frontend
2. Change sorting by age/name

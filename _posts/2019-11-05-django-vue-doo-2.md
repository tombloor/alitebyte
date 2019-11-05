---
title: "Django Vue-Doo Part 2"
slug: "django-vue-doo-2"
layout: post
categories: web-dev
tags: 
    - django
    - vue
    - REST
    - JWT
date: 2019-11-05 20:00:00 -0500
excerpt_separator: <!--more-->
---

This will be a short series looking at setting up a simple ToDo list web application using a `Django Rest Framework` backend with a `Vue.js` user interface. Full source code will be available on my [GitHub](https://github.com/tombloor) once the series has finished.

In this part of this series we will be adding some simple authentication and permissions to our API.

<!--more-->

## Recap

Last time we set ourselves up with a functional `Django` web api using the `Django Rest Framework` package. We defined our data-models and applied migrations to our database to create all the necessary tables. By the end of the post we were able to add/update/delete/view data by using our web api.

## Authentication

A lot of the time when you're writing a web api you want to implement some degree of authentication, so you can be sure you know who is making the request and which data they should have access to. There are many ways of handling authentication, we're going to use a form of token authentication called [Javascript Web Tokens](https://jwt.io/introduction/){:target="_blank"}

To implement `JWT` authentication we need to add two new endpoints to our API. The first will be responsible for giving us our access/refresh token pair upon the submission of valid credentials. The second will allow us to obtain a new access token by using a longer lived refresh token.

We're going to install a [package](https://github.com/davesque/django-rest-framework-simplejwt){:target="_blank"} which will take care of generating/authenticating and returning these tokens for us (Don't you just love it when someone else has already done the work for you). Don't forget to activate your virtual environment before you install the package.

```sh
(env) $ pip install djangorestframework_simplejwt
```

Next we need to tell `Django Rest Framework` that we want to add this package to the list of default authentication providers. This is managed in the `settings.py` file.

{% include posts/highlight-file.html name='/django_vue_doo/django_vue_doo/settings.py' %}
{% highlight python linenos %}
...
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
...
{% endhighlight %}

The `simplejwt` package provides the necessary views for requesting, authenticating and refreshing tokens. All we have to do is import the views and define the urls.

{% include posts/highlight-file.html name='/django_vue_doo/django_vue_doo/urls.py' %}
{% highlight python linenos %}
from django.contrib import admin
from django.urls import path, include

from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from api import views as api_views

router = routers.DefaultRouter()
router.register('todo-lists', api_views.ToDoListViewset)
router.register('todo-items', api_views.ToDoItemViewset)
router.register('users', api_views.UserViewset)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
{% endhighlight %}

If you access the `http://127.0.0.1:8000/token` endpoint you'll see a form field for username and password. If you enter your credentials `drf` will return an access token and refresh token. The access token should have a short lifetime, to get another one you can post the refresh token to `http://127.0.0.1:8000/refresh`. The web interface is a nice way to test everything is working, but we'll be writing a custom login page when we get further into the project.

Now that we can request tokens and refresh them, lets implement this authentication on some of our viewsets. In our application we're going to assert that the items in a `ToDoList` should only be accessible to the owner of the list. Create a new file called `permissions.py` in your `api` app and add the following custom permission.

{% include posts/highlight-file.html name='/django_vue_doo/api/permissions.py' %}
{% highlight python linenos %}
from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to view it.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        # Permissions are only allowed to the owner of the list.
        return obj.user == request.user
{% endhighlight %}

Going back to `views.py` it's easy to apply the custom permission to our viewset.

{% include posts/highlight-file.html name='/django_vue_doo/api/views.py' %}
{% highlight python linenos %}
from django.contrib.auth.models import User

from rest_framework import viewsets

from api.models import ToDoList, ToDoItem
from api.serializers import ToDoItemSerializer, ToDoListSerializer, UserSerializer
# Import our custom permission
from api.permissions import IsOwner

class ToDoListViewset(viewsets.ModelViewSet):
    # Apply it to our item viewset
    # This will prevent anyone other than the owner
    # Viewing or modifying the item
    permission_classes = [IsOwner]

    queryset = ToDoList.objects.all()
    serializer_class = ToDoListSerializer

class ToDoItemViewset(viewsets.ModelViewSet):
    queryset = ToDoItem.objects.all()
    serializer_class = ToDoItemSerializer

class UserViewset(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
{% endhighlight %}

You'll find that if you try to access a `ToDoItem` now it will give you a 401 unauthorized error. Try getting an access token and including it in the request headers to see the permissions in action.

{% highlight http %}
GET /todo-lists HTTP/1.1
Host: 127.0.0.1:8000
Authorization: Bearer ACCESS_TOKEN_HERE
{% endhighlight %}

We're left with an API that has extremely basic authentication and permissions, but enough to suffice for this little learning project. You'd definitely want to tighten up the security on a live application, and maybe in the future I'll do a post dedicated to that. But for now I'm eager to get into the client side of things and play with `Vue.js`, which is exactly what we'll be doing in the next post!
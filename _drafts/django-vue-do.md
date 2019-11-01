---
title: "Django Vue-Doo Part 1"
slug: "django-vue-doo-1"
layout: post
categories: web-dev
tags: 
    - django
    - vue
    - REST
date: 2019-10-30 14:20:00 -0500
excerpt_separator: <!--more-->
---

This will be a short series looking at setting up a simple ToDo list web application using a `Django Rest Framework` backend with a `Vue.js` user interface. Full source code will be available on my [GitHub](https://github.com/tombloor) once the series has finished.

In the first part of this series we will be setting up our `Django` project and installing `Django Rest Framework`.

<!--more-->

## Introduction

I like experimenting with different libraries and frameworks, I think it's important to keep a broad view of what is out there when it comes to programming. The more frameworks, languages, etc, you have an understanding of the more options you have in your toolbox, and different tools are more suited for different tasks. Plus it's cool playing with new stuff.

So one day I became aware of a front end framework called [Vue.js](https://vuejs.org/). It was open source, had decent documentation and looked like it could do some pretty cool stuff so I decided to try it out. I find the best way to fully try something like this out is to just dive in and use it, so that's what I'm going to do here. My intention is to create a standard ToDo List application while I figure out how it works, then apply it to one of the projects in my ever growing list of stuff I want to make but haven't got around to yet (don't judge, you know you have that list).

Now `Vue` is a front end framework, so it's completely focused on creating the user interface. This means that it is ideally paired with a backend service to take care of things like data management and user authentication. So because I see an opportunity to make this even more of a learning experience, I've decided to try out another framework which I've never used called [Django Rest Framework](https://www.django-rest-framework.org/). I have a bit more of a head start with this one as I am already very familiar with [Django](https://www.djangoproject.com/). This framework makes it easier to build a full `REST` api while keeping all the cool admin functionality that comes bundled with `Django`.

## Django Setup

First things first, let's set up the web api which will be responsible for all our data related stuff. To do that we need to begin by installing `Django`. Start by creating 2 folders `backend` and `frontend`. These folders will hold our web api and vue interface respectively. Navigate into the `backend`, install `python 3` (if you haven't already) and create a new virtual environment called `env` to work in.

```sh
$ sudo apt install python3
$ sudo apt install python3-venv
$ python3 -m venv env
```

Virtual environments are essential for keeping yourself out of dependency hell, if you don't use them, you really should [(Y tho?)[(https://realpython.com/python-virtual-environments-a-primer/). Next we have to activate our virtual environment. Make sure you do this every time you're working on your project, if you don't you'll get all sorts of errors from missing packages.

```sh
$ source env/bin/activate
```

Now we can safely install the `Django` package and dependencies.

```sh
(env) $ pip install django
```

The `Django` package comes with some nice cli tools to very quickly set up the required files to get started. Run the following commands, replacing `django_vue_doo` with the name of your project.

```sh
(env) $ django-admin startproject django_vue_doo
(env) $ cd django_vue_doo
(env) $ django-admin startapp api
```

Now we should be able to test if everything is working so far.

```sh
(env) $ python3 manage.py runserver
```

The output should include a web address (http://127.0.0.1:8000 by default), navigate to it and you should see a message from `Django`.

<div class='row'>
    <div class='col-8 mx-auto'>
        {% responsive_image path: assets/img/django-new-landing-page.png class: 'img-fluid img-thumbnail' alt: 'Hello, Django!' %}
    </div>
</div>

## Django Rest Framework

Now we're onto installing the `Django Rest Framework` to help us implement an easy to use `REST` web api. 

```sh
(env) $ pip install djangorestframework
```

Once we've installed the package, we need to tell `Django` we want to use it in our application. We do this by adding it into the installed apps section of the `settings.py` file. While you're doing this you should also add our `api` app which we created with the `django-admin startapp` command, as we'll need this later.

{% include posts/highlight-file.html name='/django_vue_doo/django_vue_doo/settings.py' %}
{% highlight python linenos %}
...
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'api'
]
...
{% endhighlight %}

At this point you could also configure your database connection. By default, `Django` will create a `sqlite` database for you when you run your first migration. If you want to configure a different database, you can refer to the [official documentation](https://docs.djangoproject.com/en/2.2/ref/settings/#databases). Once your database connection is configured you can continue to follow along and everything will be the same. For now, I'm just going to stick with the default.

```sh
(env) $ python3 manage.py migrate
```

This command will run all of the migrations that have yet to be applied to your database. In our case, it is currently just applying all the default migrations which come with `Django` and the `Rest Framework`.

Once we've run our first migration it's a good idea to create a superuser account so that we can log into the admin site when needed. You will also be prompted to set a password for the account.

```sh
(env) $ python3 manage.py createsuperuser \
            --email test@alitebyte.com \
            --username admin
```

## Setting up the API

We now have a blank `Django` site with `Django Rest Framework` installed and connected to a fresh database with all the required built in tables. Our next step is to define our data models and set up the `API` to allow us to perform basic `CRUD` operations on them.

We're not going to need anything too complicated here. Our main two models will be a `ToDoList` which will be associated with a user account, and a `ToDoItem` which will be associated with a `ToDoList`. Add a class definition for each of these models in `api/models.py`.

{% include posts/highlight-file.html name='/django_vue_doo/api/models.py' %}
{% highlight python linenos %}
from django.db import models
from django.contrib.auth.models import User

class ToDoList(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, 
        on_delete=models.CASCADE, 
        related_name='lists'
    )

    objects = models.Manager()

    def __str__(self):
        return f'{self.pk} - {self.name}'
    

class ToDoItem(models.Model):
    text = models.CharField(max_length=80)
    todo_list = models.ForeignKey(ToDoList, 
        on_delete=models.CASCADE,
        related_name='items'
    )
    completed = models.BooleanField(default=False)

    objects = models.Manager()

    def __str__(self):
        return f'{self.pk} - {self.text}'
{% endhighlight %}

Once we've defined our models we can have `Django` create a migration script for the changes, and then apply them automatically to our database.

```sh
(env) $ python3 manage.py makemigrations --name todo_list_and_items
(env) $ python3 manage.py migrate
```

Now because we're creating a `REST` api which will be accessed over the web, we need to implement a way of representing our data objects in a textual format, such as `JSON`, that we can then consume in the client side part of our application. For that we can use the serializers built into the `rest framework`. Create a new file in the `api` folder called `serializers.py`

{% include posts/highlight-file.html name='/django_vue_doo/api/serializers.py' %}
{% highlight python linenos %}
from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import ToDoList, ToDoItem

class ToDoItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ToDoItem
        fields = '__all__'

class ToDoListSerializer(serializers.HyperlinkedModelSerializer):
    items = ToDoItemSerializer(many=True, read_only=True)

    class Meta:
        model = ToDoList
        fields = '__all__'

class ToDoListSummarySerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = ToDoList
        fields = ['url', 'name']

class UserSerializer(serializers.ModelSerializer):
    lists = ToDoListSummarySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'lists']
{% endhighlight %}

Take a look at the [documentation](https://www.django-rest-framework.org/api-guide/serializers/) for more detail on how these serializers work, but broadly speaking our serializers are as follows:

- `ToDoItemSerializer` - returns a full representation of a single item.
- `ToDoListSerializer` - returns a full representation of a list, including all it's items.
- `ToDoListSummarySerializer` - returns a slim representation of a list without any information about the items within (we'll need this when we introduce a simple permissions system)
- `UserSerializer` - returns relevant fields from the built in `Django` user object.

I'm using `HyperlinkedModelSerializers` because rather than returning an id to reference each object, they return a url. This means that we don't have to worry about reconstructing the url in out client-side code every time we want to query our api.

Now having all these models and serializers is great, but we can't actually do anything with our api yet. For that we need to define some views referencing our serializers, which will can then map to urls. We're going to use another shortcutty part of the `rest framework` called [viewsets](https://www.django-rest-framework.org/api-guide/viewsets/). These are essentially a collection of views bundled up together, and implements common `CRUD` functionality to save us having to write them all out manually.

{% include posts/highlight-file.html name='/django_vue_doo/api/views.py' %}
{% highlight python linenos %}
from django.contrib.auth.models import User

from rest_framework import viewsets

from api.models import ToDoList, ToDoItem
from api.serializers import ToDoItemSerializer, ToDoListSerializer, UserSerializer

class ToDoListViewset(viewsets.ModelViewSet):
    queryset = ToDoList.objects.all()
    serializer_class = ToDoListSerializer

class ToDoItemViewset(viewsets.ModelViewSet):
    queryset = ToDoItem.objects.all()
    serializer_class = ToDoItemSerializer

class UserViewset(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
{% endhighlight %}

Next we need to map these `viewsets` to urls so that we can access them over the web. Again the `rest framework` has a helper for this called a router which defines all the urls our viewsets will need. Usually I would say it's best to define a seperate `urls.py` file for each app in your project, then just include them in your project `urls.py` file. But because we're only creating a simple example, we'll just work directly in our project urls file.

{% include posts/highlight-file.html name='/django_vue_doo/django_vue_doo/urls.py' %}
{% highlight python linenos %}
from django.contrib import admin
from django.urls import path, include

from api import views as api_views

router = routers.DefaultRouter()
router.register('todo-lists', api_views.ToDoListViewset)
router.register('todo-items', api_views.ToDoItemViewset)
router.register('users', api_views.UserViewset)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
]
{% endhighlight %}

Now lets run the development server again and check it out.

```sh
(env) $ python3 manage.py runserver
```

If you navigate to the root of your site, you should see the `rest framework` web interface, which is a nice way to check everything is working as expected. If you go to `/admin` you can still access the default `Django` admin pages. Try using the controls to send some posts and gets to see how data is saved/retrieved.

In the next post we'll finish up our API by adding authentication and a very basic permissions system. Then after that we can start on the user interface.

---
title: "Django Vue-doo"
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

The output should include a web address (http://127.0.0.1:8000 by default), navigate to it and you should see `Django`.

<div class='row'>
    <div class='col-8 mx-auto'>
        {% responsive_image path: assets/img/django-new-landing-page.png class: 'img-fluid img-thumbnail' alt: 'Hello, Django!' %}
    </div>
</div>
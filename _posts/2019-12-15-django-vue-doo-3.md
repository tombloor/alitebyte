---
title: "Django Vue-Doo Part 3"
slug: "django-vue-doo-3"
layout: post
categories: web-dev
tags: 
    - django
    - vue
    - REST
    - JWT
date: 2019-12-15 20:00:00 -0600
excerpt_separator: <!--more-->
---

This will be a short series looking at setting up a simple ToDo list web application using a `Django Rest Framework` backend with a `Vue.js` user interface. Full source code will be available on my [GitHub](https://github.com/tombloor){:target='_blank'} once the series has finished.

In this part of this series we will be starting on our frontend code by setting up our `vue` plugins and setting up some simple navigation.

<!--more-->

## Disclaimer

Big disclaimer time. I'm still trying to fully get my head around the `vue` stuff, so there may be times in future posts where we have to back track a bit to fix stuff I got wrong. That's what you get for following me blindly into something I'm going into blind myself 😛.

<div class='row'>
    <div class='col-lg-6 col-md-8 mx-auto'>
        {% responsive_image path: assets/img/I-choose-vue.png class: 'img-fluid my-4' alt: 'I Choose Vue!' %}
    </div>
</div>

## Vue setup

So first things first, we want to use `vue`, so we've got to install it. To do this we're going to need `nodejs` and a package manager such as `npm`. I've mentioned in my other posts how important it is to try and manage your dependencies in a way that won't affect other projects on your computer. Failure to do this could result in installing a later version of a dependency which is shared by another project, which could break things and cause general brain ache.

Luckily this is a very common thing to want to do, so there is a tool called `nvm` (Node Version Manager) which brings to node what virtual environments brings to `python`. Installation instructions for `nvm` can be found on the [projects github page](https://github.com/nvm-sh/nvm){:target='_blank'}, but it basically consists of downloading and running an install script, like so:

```sh
$ curl -o - https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
```

Now we can tell `nvm` to download the latest version of `node` and start using it.

```sh
$ nvm install node
$ nvm use node
```

There are a few ways you can start using vue in a project. The main two seem to be:

1. Reference `vue.js` in your html page and instantiate a vue app.
2. Use the `vue-cli` to create a vue project.

I chose to go with number two as I liked the way it allowed you to bundle all the code for each component of your app together, it felt clean. The documentation advises against this for your first project as getting started with option 1 is simpler, but it's not like I have a deadline for this project, it's just a learning experience so I can afford to fumble around for a while.

In the first post we created a folder called `frontend`. Let's install the `vue-cli` tools and create a new app in this folder. (Note, `vue` will warn you that the `frontend` directory already exists, that's fine, just tell it to `overwrite`)

```sh
$ npm install -g @vue/cli
$ vue create frontend
```

Next the installer ask you if you want the default setup or if you want to manually select extra modules you can have pre-installed into your project. We are actually going to use a few of these modules but for the first time using them I'd rather set them up myself so I have a better understanding of what's going on. Just go ahead and complete the setup with all the default options.

## Install Bootstrap

My UI framework of choice for web projects is usually [Bootstrap](https://getbootstrap.com/){:target='_blank'}. I find it pretty intuitive and it doesn't take a lot of work to make something that looks good. `Vue` has a plugin ([Bootstrap-Vue](https://bootstrap-vue.js.org/){:target='_blank'}) which 'vueifies' a lot of the components that come with bootstrap. Let's install it and add it to our project.

(Note, if you don't like bootstrap, there are many other UI frameworks that will work with `vue`, some of which also have plugins to integrate more seamlessly)

```sh
$ cd frontend
$ npm install bootstrap
$ npm install bootstrap-vue
```

Once the packages have been installed, we have to load them into our app.

{% include posts/highlight-file.html name='/src/main.js' %}
{% highlight javascript linenos %}
import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
{% endhighlight %}

## Navigation
*[SPA]: Single Page Application

The next thing I want to set up is navigation. The preferred way to do this seems to be by using [Vue Router](https://router.vuejs.org/){:target='blank'}. It will probably feel pretty familiar to you if you've had experience with creating an SPA before. The installation process is pretty similar to what we did for `bootstrap`, however there is a little bit more to configure.

```sh 
$ npm install vue-router
```

{% include posts/highlight-file.html name='/src/main.js' %}
{% highlight javascript linenos %}
import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter);

Vue.config.productionTip = false

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
{% endhighlight %}

So we started off the same as before, but then we added a few extra pieces:

1. Defined a `constant` to hold our route definitions. These definitions map a path in our application to a `component` (We'll get to those in a second).
2. Instantiated a new `VueRouter` and passed it our routes. We also set the mode to `history`. [Click here](https://router.vuejs.org/api/#mode){:target='_blank'} for more information on router modes.
3. Passed the router to our `vue` instance. This makes it globally available in all our components.

## Setting up some components

So in the last step we set up our router to point to a `Home` component and a `Login` component, neither of which exist yet. Let's make them now.

To begin with we're just going to have these components display a string of text, and a couple of links to move between them. Just to make sure our setup is working.

<div class='row'>
  <div class='col-xl-6'>
{% include posts/highlight-file.html name='/src/components/Home.vue' %}
{% highlight html linenos %}
{% raw %}
<template>
    <div>
        <router-link to="/">Home</router-link>
        <router-link to="login">Login</router-link>
        <p>I am the home component</p>
    </div>
</template>

<script>
export default {
    name: 'Home'
}
</script>
{% endraw %}
{% endhighlight %}
  </div>

  <div class='col-xl-6'>
{% include posts/highlight-file.html name='/src/components/Login.vue' %}
{% highlight html linenos %}
{% raw %}
<template>
    <div>
        <router-link to="/">Home</router-link>
        <router-link to="login">Login</router-link>
        <p>I am the login component</p>
    </div>
</template>

<script>
export default {
    name: 'Login'
}
</script>
{% endraw %}
{% endhighlight %}
  </div>
</div>

They're fairly self explanatory at this stage. The `router-link` tags are handled by the `router` and look up the `routes` mappings to generate an `a` tag with the appropriate `href`. We also have to import these components into our `main.js` file so that `vue` can find them.

{% include posts/highlight-file.html name='/src/main.js' %}
{% highlight javascript linenos %}
import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import Login from './components/Login.vue'

...
{% endhighlight %}

Now we need to tell the `router` where to render the currently active component. For now let's just keep it very basic so we can test everything is working. Replace everything in `src/App.vue` with the following:

{% include posts/highlight-file.html name='/src/App.vue' %}
{% highlight html linenos %}
<template>
  <div id="app" v-cloak>
    <b-container>
      <b-row align-h='center'>
        <b-col cols='8'>
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
{% endhighlight %}

All of the tags that start with `b-` are provided by `bootstrap-vue` and simply map to various bootstrap components. The important bit here is the `router-view`, this tells the router where to render the current component and will be the section of the page that is reloaded as we navigate around the site.

Now would be a good time to test everything we've done so far and make sure it's working. When we created our project with `vue-cli` it also setup some `npm` tasks for us, `serve`, `build` and `lint`. Let's use serve to start up a development server so we can test our progress.

```sh
$ npm run serve
```

The output should give you a url which your site is accessible on. Try clicking back and forth between the two components and you should see the string of text changing to reflect the active components name.

This feels like a good place to stop for this one. Next time we'll try and start talking to our api by making some authentication requests. 

There may be a bit of a delay for the next part, as we're in the run up to Christmas I'm struggling to find as much time to work on this project and there are some improvements to the blog that I want to prioritise, so it'll probably be the end of January before we go any further with this one.

---
title: "Taking a bite out of Jekyll - Part 2"
slug: "taking-a-bite-jekyll-2"
layout: post
categories: jekyll
#date: 2019-10-09 20:47:00 -0500
excerpt_separator: <!--more-->
---

This series is focused on documenting my journey in setting up a blog using `Jekyll`. 

In this part we will look at using `Bootstrap` to quickly set up an extremely minimalist theme for our blog.

<!--more-->

In the last part we went about setting up a simple `Jekyll` site and publishing it locally so that we could view it in the browser. Now I think we should start on customising the appearance of our blog so that we're not just using the default out of the box theme. For my blog I want this to be a gradual process as I don't have a solid idea of what I want the end result to be yet, so I'm going to start here by making an incredibly minimalist theme that I can easily add to and modify in the future.

I would like to think that by the time you're reading this I will have managed to make considerable progress on this theme, so I'll include some pictures below to show you what we're aiming for by the end of this post.

(INSERT PICTURES HERE)
*Humble beginnings*

Now that we know what we're aiming for, let's get started.

## Config

First step is to setup our `_config.yml` file. It's a pretty straightforward file which comes with a lot of explanation in the form of comments, so I'm just going to highlight the key changes:
- Comment out the `theme` setting, we're going to be making our own.
- Set your site title, description etc
- Set your permalink structure, according to the [documentation](https://jekyllrb.com/docs/permalinks/)

Now that's done, it's time to start writing some `html`.

## Main Layout

`Jekyll` uses a template building block approach when it comes to building the site. I'm not going to try and re-explain the structure of a `Jekyll` site as that is all covered in great detail in the official [documentation](https://jekyllrb.com/docs/).

Let's create our default layout file `_layouts/default.html` and add some boilerplate html to check it is working:

{% highlight html linenos %}
<!doctype html>
<html>
    <head>
        <title>Hello, world!</title>
    </head>
    <body>
        <h1>Hello, world!</h1>
    </body>
</html>
{% endhighlight %}

> (INSERT PICTURE HERE)

Now let's get ready for the next step by adding some folders to hold our stylesheets and `javascript` assets. I organised them in the structure below:

```
root
    ...
    |> assets 
        |> css
        |> js
    ...
```

## Bootstrap

`Bootstrap` is awesome. It doesn't really need any more of an introduction than that. If you've developed for the web before you've probably heard of it, and if not you just need to know it's going to save us a lot of work. The [documentation](https://getbootstrap.com/) is great and I almost always have it open while I'm working on web projects.

Lets go ahead and add the `bootstrap` css and js files to our project. Download the latest versions from the [Bootstrap website](https://getbootstrap.com/), making sure you get any listed dependencies (such as `Popper.js` and `jQuery`). Lets add them into the relevant folders, then reference them in our `default.html` layout file.

{% highlight html linenos %}
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Hello, world!</title>
        <link rel='stylesheet' href='/assets/css/bootstrap.min.css'>
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet">
    </head>
    <body>
        <h1>Hello, world!</h1>

        <script src='/assets/js/jquery-3.4.1.min.js'></script>
        <script src='/assets/js/popper.min.js'></script>
        <script src='/assets/js/bootstrap.min.js'></script>
    </body>
</html>
{% endhighlight %}

Notice that we also included a couple of meta tags, these are important when viewing the site on a mobile device. I also added a font from [Google Fonts](https://fonts.google.com/), because why not.

So right now we have a layout which just displays a fixed message. Let's introduce some `liquid` tags to pull some information from our site configuration, and render the content of the page we've requested. We'll also start to add in the classes used by `bootstrap` to structure our content in a mobile friendly grid.

{% highlight html linenos %}
<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>{% raw %}{{ site.title }}{% endraw %}</title>
        <link rel='stylesheet' href='/assets/css/bootstrap.min.css'>
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class='container'>
            <div id='page' class='row'>
                <div class='col'>
                    {% raw %}{{ content }}{% endraw %}
                </div>
            </div>
        </div>

        <script src='/assets/js/jquery-3.4.1.min.js'></script>
        <script src='/assets/js/popper.min.js'></script>
        <script src='/assets/js/bootstrap.min.js'></script>
    </body>
</html>
{% endhighlight %}

## Posts list

So now we've got a basic default layout, lets move onto some content. A pretty essential component of any blog is a list of posts, so let's start with that. Our post list should be the first page people see when they navigate to our blog, so lets open up `index.html`, remove whatever `jekyll` put in there for us and replace it with a simple loop.

{% highlight html linenos %}
---
layout: default
title: Home
---

<h1 class='display-2'>
    {% raw %}{{site.title}}{% endraw %}
</h1>
{% raw %}{% for post in site.posts %}{% endraw %}
    <div class='post-summary'>
        <h2 class='post-heading'>
            {% raw %}{{ post.title }}<br/>{% endraw %}
            <small class='text-muted'>{% raw %}{{ post.date | date_to_string }}{% endraw %}</small>
        </h2>
        {{ post.content }}
    </div>
{% raw %}{% endfor %}{% endraw %}
{% endhighlight %}

It's probably not going to look very impressive if we don't have any posts, so lets add some dummy ones. Create a new folder called `_drafts` in the root of your site, then make a file called `test-post.md` with the following contents.

```markdown
---
title: 'Test Post 1'
---
This is a test post.

With a few of paragraphs.

Bye bye.
```

Copy it a couple of times, change the filenames, titles and content a little to give yourself some variety, then restart your site with the following command to include your draft posts.

```shell
$ bundle exec jekyll serve --drafts
```

(IMAGE SHOWING THE POST LIST)
*And there they are*

Depending on how minimalist you want to be you could stop right there and just start adding posts, but I want to go a little bit further than just one page with all my posts before I actually start writing. Rather than showing the whole post in that list, I'd rather just show an excerpt and then have the rest of the post on it's own page. So let's do that.

First of all we need a new layout for the post page. This layout will inherit from the `default` but will let us add some extra bits, such as a link back to the main posts list. Let's call this layout `post.html`.

{% highlight html linenos %}
---
layout: default
---

<a href='/index.html'>&lt; Back to posts</a>
<h2 class='post-heading'>
    {% raw %}{{ page.title }}<br/>{% endraw %}
    <small class='text-muted'>{% raw %}{{ page.date | date_to_string }}{% endraw %}</small>
</h2>
<div>
    {% raw %}{{ content }}{% endraw %}
</div>
<a href='/index.html'>&lt; Back to posts</a>
{% endhighlight %}
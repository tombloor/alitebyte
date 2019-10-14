---
title: "Taking a bite out of Jekyll - Part 2"
slug: "taking-a-bite-jekyll-2"
layout: post
categories: jekyll
tags: 
    - blogging
    - web
date: 2019-10-14 10:58:00 -0500
excerpt_separator: <!--more-->
---

This series is focused on documenting my journey in setting up a blog using `Jekyll`. 

In this part we will look at using `Bootstrap` to quickly set up an extremely minimalist theme for our blog.

<!--more-->

In the last part we went about setting up a simple `Jekyll` site and publishing it locally so that we could view it in the browser. Now I think we should start on customising the appearance of our blog so that we're not just using the default out of the box theme. For my blog I want this to be a gradual process as I don't have a solid idea of what I want the end result to be yet, so I'm going to start here by making an incredibly minimalist theme that I can easily add to and modify in the future.

I would like to think that by the time you're reading this I will have managed to make considerable progress on this theme, so I'll include some pictures below to show you what we're aiming for by the end of this post.

<div class='row'>
    <div class='col-sm'>
        <img class='img-fluid img-thumbnail' src='/assets/img/new-jekyll-post-list-styled.png' alt='Final Post List'/>
    </div>
    <div class='col-sm'>
        <img class='img-fluid img-thumbnail' src='/assets/img/new-jekyll-post-styled.png' alt='Final Post' />
    </div>
</div>

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

We also need a `index.html` file in the root of our site. `Jekyll` automatically creates `index.markdown` for you, but for our test we'll delete it and do things our way. The file should be empty for now, except for a single line of front matter.

{% highlight html linenos %}
---
layout: default
---
{% endhighlight %}

<div class='row'>
    <div class='col-8 mx-auto'>
        <img class='img-fluid img-thumbnail' src='/assets/img/new-jekyll-hello-world.png' alt='Hello, world!'/>
    </div>
</div>

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
{% raw %}
<h1 class='display-2'>
    {{site.title}}
</h1>
{% for post in site.posts %}
    <div class='post-summary'>
        <h2 class='post-heading'>
            {{ post.title }}<br/>
            <small class='text-muted'>{{ post.date | date_to_string }}</small>
        </h2>
        {{ post.content }}
    </div>
{% endfor %}
{% endraw %}
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

<div class='row'>
    <div class='col mx-auto'>
        <img class='img-fluid img-thumbnail' src='/assets/img/new-jekyll-post-list.png' alt='WIP Post List'/>
    </div>
</div>

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

Now that we've got a dedicated post page to show the content, we don't need to show it all in the posts list. By default there is the option to just render the first block of text in a post by using `{post.excerpt}` instead of `{post.content}`. You can also specify an excerpt property in the front matter of your post, or you can place a marker where you want the excerpt to stop, like so.

```markdown
---
title: 'Test Post 1'
excerpt_separator: <!--more-->
---
This is a test post.

With a few of paragraphs.
<!--more-->
Bye bye.
```

(Note, the excerpt separator can be anything you like)

Now if we change the `index.html` page, this will render the first two blocks of text as our excerpt and we can add a link to view the full post. While we're making this change you've already probably noticed that we're repeating ourselves when we're rendering the post header. We use exactly the same code on the post page as the posts list. Let's take that code out into an includes so we can reuse it. Create folder called `_includes` and add a `heading.html` file.

{% highlight html linenos %}
{% raw %}
<h2 class='post-heading'>
    {{ include.title }}<br/>
    <small class='text-muted'>{{ include.date | date_to_string }}</small>
</h2>
{% endraw %}
{% endhighlight %}

The `include.` object gives us access to the data of the post or page that is currently being rendered (so we could reuse this code anywhere that has the required properties in it's front matter).

Now let's add this to our `index.html` page, and also make the change to show post excerpts rather than content.

{% highlight html linenos %}
---
layout: default
title: Home
---
{% raw %}
<h1 class='display-2'>
    {{site.title}}
</h1>
{% for post in site.posts %}
    <div class='post-summary'>
        <a class='post-heading' href='{{ post.url }}'>
            {% include heading.html date=post.date title=post.title %}
        </a>
        <p>{{ post.excerpt }}</p>
        <a href='{{ post.url }}'>Read More...</a>
    </div>
{% endfor %}
{% endraw %}
{% endhighlight %}

And don't forget to change the `post.html` layout file to use our new heading.

{% highlight html linenos %}
---
layout: default
---
{% raw %}
<a href='/index.html'>&lt; Back to posts</a>
{% include heading.html date=page.date title=page.title %}
<div>
    {{ content }}
</div>
<a href='/index.html'>&lt; Back to posts</a>
{% endraw %}
{% endhighlight %}

Once you've done this, you'll need to tell the posts to use the new layout. In the front matter of your test posts add a `layout` parameter and set it to `post`.

## Final touches

So now we've got our site structure complete, let's add some basic styles to make it look a little nicer. `Jekyll` supports `SASS` and `SCSS` out of the box. It will automatically compile any files found in the `_sass` directory, so let's create that now and add a `main.scss` file.

I'm not doing anything fancy with my styles yet, just changing the body background, using a different font and playing with some of the spacing. I'll be adding a lot more to this as I add features to the site.

{% highlight scss linenos %}
$body-background: #ddd;

body {
    font-family: 'Source Sans Pro', sans-serif;
    background-color: $body-background;
}

.post-summary {
    margin-bottom: 1rem;
}

a.post-heading {
    color: #222;
    text-decoration: none;
}
a.post-heading:hover {
    color: #3e3e3e;
    text-decoration: none;
}

h2.post-heading {
    border-bottom: 2px solid #ccc;
    padding-bottom: 2px;
}
{% endhighlight %}

Now let's add another file to import these styles into `assets/css`. I've called mine `styles.scss`.

{% highlight scss linenos %}
---
---

@import "main";
{% endhighlight %}

Note the empty front matter at the start of the file, this is essential as it tells `Jekyll` that it needs to process this file. Without this, `Jekyll` would not process any `scss` files that were outside the `_scss` directory.

Finally let's reference this file in the head of our `default.html` layout.

{% highlight html linenos %}
{% raw %}
...
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>{{ site.title }}</title>
    <link rel='stylesheet' href='/assets/css/bootstrap.min.css'>
    <link rel='stylesheet' href='/assets/css/styles.css' />
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap" rel="stylesheet">
</head>
...
{% endraw %}
{% endhighlight %}

And there we have it, and incredibly simple `Jekyll` blog to get us started. Whenever I get more content on here and start to introduce more features, I'll probably write up a posts outlining the process for the more significant ones. One feature which I'll definitely be looking into soon is the addition of a comments system, which is certainly not as simple as in some of the database driven blogging platforms, but definitely achievable.
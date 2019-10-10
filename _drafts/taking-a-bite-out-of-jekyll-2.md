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

>(INSERT PICTURES HERE)

Now that we know what we're aiming for, let's get started.

## Layouts

`Jekyll` uses a template building block approach when it comes to building the site. I'm not going to try and re-explain the structure of a `Jekyll` site as that is all covered in great detail in the official [documentation](https://jekyllrb.com/docs/).

Let's create our default layout file `_layouts/default.html` and add some boilerplate html to check it is working

## Bootstrap

`Bootstrap` is awesome. It doesn't really need any more of an introduction than that. If you've developed for the web before you've probably heard of it, and if not you just need to know it's going to save us a lot of work. The [documentation](https://getbootstrap.com/) is great and I almost always have it open while I'm working on web projects.


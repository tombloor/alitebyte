---
title: "Taking a bite out of Jekyll - Part 1"
slug: "taking-a-bite-jekyll-1"
layout: post
excerpt_separator: <!--more-->
---

This series is focused on documenting my journey in setting up a blog using Jekyll. 

In this first part we will look at setting up our environment and building our site locally so that we can view it in a browser.

<!--more-->

## Background

(Feel free to skip this ramble about why I chose Jekyll over Wordpress, the good stuff starts [here](#setup))

I recently developed the desire to start documenting my experiments with different programming languages and frameworks, partly for my own benefit so I can remember what I've done. But also because I know how great it feels when you're stuck on a problem and you find that one blog post that walks you through it step by step. The more developers start blogging the better it is for all of us.

First step in my journey was to find a blogging platform. There are many platforms out there and I don't think there is such thing as the 'best' one, it really depends on personal preference and what you want to use it for. I started out as many others do, with [Wordpress](https://wordpress.com/). Wordpress is very popular for a reason, it is extremely powerful and versatile, definitely more of a full blown CMS than just a blogging platform. So I rented some server space and went about setting up a full LEMP stack, trawled through all the menus to tweak everything to how I wanted it to be and installed the various plugins and libraries I needed to write in the way I wanted to. By the time I finished writing my first post, I already felt burned out. I wanted to personalize my blog with my own theme, but I just couldn't motivate myself to start it.

So I decided to ditch it and go back to looking for another platform. Something more lightweight, simple and less overkill for what I wanted right now. It was at this point that I came across [Jekyll](https://jekyllrb.com/). I looked into the requirements and was instantly put off, 'Full Ruby development environment' :roll_eyes:. My background is `.NET` and `Python`, I've never used `Ruby`. I didn't want to have to learn an entirely new language just to start blogging, but time and time again I saw people singing Jekyll's praises about how lightweight and easy to use it was. So I gave it a go, and so far I'm impressed. Don't be like me and dismiss it because of `Ruby`, I'm yet to write a single line of the stuff.

So now that I've rambled about how I ended up here, let's have a look at what is actually involved in setting up a Jekyll blog.

## <a name='setup'></a> Setup

(Please note, these steps are how I set up my blog. I'm not using `GitPages` for hosting. If you want to use the free hosting provided by `GitPages`, your setup will be [slightly different](https://jekyllrb.com/docs/github-pages/))


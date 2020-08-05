---
title: "Taking a bite out of Jekyll - Part 1"
slug: "taking-a-bite-jekyll-1"
layout: post
categories: web-development
tags: 
    - jekyll
date: 2019-10-08 20:47:00 -0500
excerpt_separator: <!--more-->
---

This series is focused on documenting my journey in setting up a blog using `Jekyll`. 

In this first part we will look at setting up our environment and building our site locally so that we can view it in a browser.

<!--more-->

## Background

(Feel free to skip this ramble about why I chose `Jekyll` over `Wordpress`, the good stuff starts [here](#setup))

I recently developed the desire to start documenting my experiments with different programming projects, partly for my own benefit so I can remember what I've done. But also because I know how great it feels when you're stuck on a problem and you find that one blog post that walks you through it step by step. The more developers start blogging the better it is for all of us.

First step in my journey was to find a blogging platform. There are many platforms out there and I don't think there is such thing as the 'best' one, it really depends on personal preference and what you want to use it for. I started out as many others do, with [Wordpress](https://wordpress.com/). Wordpress is very popular for a reason, it is extremely powerful and versatile, definitely more of a full blown CMS than just a blogging platform. So I rented some server space and went about setting up a full LEMP stack, trawled through all the menus to tweak everything to how I wanted it to be and installed the various plugins and libraries I needed to write in the way I wanted to. By the time I finished writing my first post, I already felt burned out. I wanted to personalize my blog with my own theme, but I just couldn't motivate myself to start it.

So I decided to ditch it and go back to looking for another platform. Something more lightweight, simple and less overkill for what I wanted right now. It was at this point that I came across [Jekyll](https://jekyllrb.com/). I looked into the requirements and was instantly put off, 'Full Ruby development environment' :roll_eyes:. My background is `.NET` and `Python`, I've never used `Ruby`. I didn't want to have to learn an entirely new language just to start blogging, but time and time again I saw people singing Jekyll's praises about how lightweight and easy to use it was. So I gave it a go, and so far I'm impressed. Don't be like me and dismiss it because of `Ruby`, I'm yet to write a single line of the stuff.

So now that I've rambled about how I ended up here, let's have a look at what is actually involved in setting up a `Jekyll` site.

## <a name='setup'></a> Setup

(Please note, these steps are how I set up my blog. I'm not using `GitPages` for hosting. If you want to use the free hosting provided by `GitPages`, your setup will be [slightly different](https://jekyllrb.com/docs/github-pages/))

For this first post we're going to focus on setting up our blog to build and view locally, we'll look at how to deploy it later (it's ridiculously easy). To get our site building locally we have to take a few steps:

1. Setup `Ruby` development environment.

2. Install `Jekyll` and dependencies.

3. Build the sample site.

4. Host the site locally so we can view it in a browser.

### Ruby

First up is to tackle the bit I was dreading, setting up our `Ruby` development environment. Turns out that the [Jekyll documentation](https://jekyllrb.com/docs/installation/) does a really good job of walking you through it. They have a guide for Windows, Mac, Ubuntu and some other Linux distributions. I'm going to summarise the steps I took in Ubuntu.

First we need to install `Ruby` with the development headers.

```bash
$ sudo apt install ruby-full build-essential zlib1g-dev
```

Next the `Jekyll` documentation suggests setting up a folder for your gems in your home directory and adding it to your `$PATH`, rather than defaulting to the storing them at `/gems`. This sounded like a good idea to me so I added the following to my `~/.bashrc` file.

```sh
export GEM_HOME="$HOME/gems"
export PATH="$HOME/gems/bin:$PATH"
```

And reloaded it with.

```sh
$ source ~/.bashrc
```

### Install Jekyll and dependencies

Next up we need to install `Jekyll`. 

An approach to handling dependencies that I've enjoyed using in `Python` is virtual environments, provided by the `virtualenv` package. These allow you to bundle your dependencies up with your code, so you never have to crawl through dependency hell to match up your development environment with production, or find that one dependency you're missing. Turns out that `Ruby` has a similar package called `Bundler` which handles things in much the same way.

Let's install the `Bundler` gem.

```sh
$ gem install bundler
```

Next, navigate into an empty directory and initialise a new bundle, adding `Jekyll` as a dependency, and tell `Bundler` to install the required gems.

```sh
$ bundle init
$ bundle add jekyll
$ bundle install
```

Now that we have all our dependencies, we can create a new `Jekyll` site. Note, it is important to run all commands through `bundle exec`. This ensures that the correct dependencies are available to the command.

```sh
$ bundle exec jekyll new . --force
```

(The use of the `--force` flag is required for `Jekyll` to create a new site in a directory that is not empty)

### Build and host our site locally

And now we're ready to build our site and see how it looks.

```sh
$ bundle exec jekyll serve
```

Blink and you'll miss it!

That's all it takes to build the site and publish it to `http://localhost:4000`. What's even better is while that command is running, if you modify any of your sites files it will automatically rebuild and republish without you having to do a thing.

So now that we have a basic `Jekyll` site set up and viewable, the next step is to customise the look and feel. We'll tackle that in part 2.

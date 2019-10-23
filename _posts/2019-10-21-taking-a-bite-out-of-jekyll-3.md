---
title: "Taking a bite out of Jekyll - Part 3"
slug: "taking-a-bite-jekyll-3"
layout: post
categories: web-dev
tags: 
    - blogging
    - jekyll
date: 2019-10-21 19:59:00 -0500
excerpt_separator: <!--more-->
---

This series is focused on documenting my journey in setting up a blog using `Jekyll`. 

In this part we will look at deploying our blog and setting up `Google Analytics` to see how much traffic we're getting.

<!--more-->

Last time we finished a super simple layout for our blog and tested it locally. This time we're going to look at putting the blog out on the internet for others to see. I decided to go with [Digital Ocean](https://m.do.co/c/d5f8bcc763e9) for web hosting as they seem to be a pretty popular choice among developers and you can get a full VM to play with for just $5 a month, which is pretty nice. If you haven't yet decided on a hosting provider and want to give them a try you can get $50 of free credit for a month by using my [referral link](https://m.do.co/c/d5f8bcc763e9). (Plus you'll have my gratitude as I earn referral rewards for my account which will help keep this blog going :smile: )

It's worth noting that setting up a webserver is outside the scope of this post, so if you do go with a blank slate VM like with `Digital Ocean` I would highly recommend following one of their guides. They have one for all popular web servers (such as [NGINX](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04)) and seem very easy to follow.

## Deploying 

So now that you've got your webserver set up and ready to go, we can start the incredibly simple process of publishing the `Jekyll` blog. The way `Jekyll` works is that when you build/serve your site locally, `Jekyll` processes all of your content into static `HTML` files and puts them in a folder named `_site`. The command to build the site without serving it locally is as follows.

{% highlight shell %}
$ bundle exec jekyll build
{% endhighlight %}

Once that finishes, all you need to do to deploy your blog is to copy the `_site` folder into the webroot of your chosen webserver. There's no database to mess around with, no setup scripts, just copy the files up and you're done.

This is probably the thing that I love most about `Jekyll` right now. There are no dependencies that need to go on the webserver. We don't need to worry about having the correct versions of plugins or libraries. All the work to build the site is done locally and the server just has to serve the static `HTML` files.

## Google Analytics

So now that we've got our blog sitting on the internet, let's set up some analytics so we can see what sort of traffic we're getting. I see no reason to go with anything other than the tried and tested [Google Analytics](https://analytics.google.com/analytics/web/). I've used it before at work and it's really easy to set up. Once you go through the registration process and setup your site in the dashboard you'll be given a snippet of `Javascript` to insert in any pages you want to collect data on.

In our case, this means we'll want to include the tracking script in our `default.html` layout. That seems simple enough, but we also have to be careful. If we want to keep our data clean we'll probably not want the tracking script to trigger while we're developing the site locally. There's a few of approaches you could take here, you could add an if statement to the `Javascript` to check if the page url started with `http://localhost`. You could just leave it alone and filter out localhost traffic from within your `Google Analytics` dashboard. Or you could have `Jekyll` omit the script until you were ready to deploy.

I personally feel like omitting the script until we actually want it to run is the cleanest solution, and with `Jekyll Environments` it's very easy to achieve. When we build/serve our site without specifying which environment we're targeting, `Jekyll` will default to `development`. When we're building for a production we can specify which environment to use like so:

{% highlight shell %}
$ JEKYLL_ENV=production bundle exec jekyll build
{% endhighlight %}

Now as things stand, this will build our site in exactly the same was as if we built it without specifying the environment. However, we can tell `Jekyll` to only render certain parts of our markup when we're in a particular environment. For example, to only render our tracking script when in production mode, we could write.

{% highlight html linenos %}
{% raw %}
{% if jekyll.environment == 'production' %}
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-XXXXXXXXX-X');
    </script>
{% endif %}
{% endraw %}
{% endhighlight %}

The same solution could be useful in many other scenarios too. For example, if you wanted to show debugging information in one of your client side scripts, but hide it in production. Or avoid reporting false hits on ads while you're testing locally. I can also see it being easy to include in deployment scripts or CI pipelines as you start automating more of your build/deploy process. I'll definitely be covering this in future posts as I start automating more of my own processes.

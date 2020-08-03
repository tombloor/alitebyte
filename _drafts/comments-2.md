---
title: "Jekyll Comments"
slug: "comments-2"
layout: post
categories: web-dev
tags: 
    - blogging
    - jekyll
    - alitebyte
date: 2020-06-09 22:56:00 -0500
excerpt_separator: <!--more-->
---

Static site generators have many selling points, but one thing they often 
struggle with is how to handle data driven elements such as a comments system.

In this post I will quickly run through how I implemented my comments system
in a way that didn't require me to set up a database or connect to a third party
service.

<!--more-->

## Objective

I've seen a few posts on reddit recently of people wanting to set up comments systems
for their jekyll sites. Alot of them seem to focus around integrating with some 
third party. This is probably the easier way to get this feature, but what if that
third party goes away, or you just want to retain a bit more control of your site.
In these situations it pays off to have an alternative.

The solution I went with was to roll my own small python webservice which listens for POSTs
and uses the data to create a file to represent the comment. These files make up a
collection in `Jekyll` which I can then access in the relevant post. This approach
also has the advantage that all of the comments are actually a part of my site's 
source code, and therefore can be added to source control. If I ever want to move
my site to a new server, all I have to do is check it out of source control, build,
and there it is, no messing around with changing configuration on external services.

## What does a comment look like

Let's start by having a look at what a comment actually looks like in my site.
As I mentioned before all of the comments are stored as a collection in my site,
which means they are each a physical file in the source code. They look a bit like
this:

{% include posts/highlight-file.html name="_comments/test-comment.md" %}
{% highlight markdown %}
{% raw %}
---
date: 2020-08-02T18:30:00.0000000-06:00
perma: "/2020/08/01/comments-system-1/"
name: "alitebyte"
image: "data:image/png;base64, ........"
---

Hello, world!
{% endraw %}
{% endhighlight %}

This gives me everything I need to render the comment with the appropriate post.
Let me look at this example line by line.

1. `date: 2020-08-02T18:30:00.0000000-06:00`<br/>
This is the first element in the front matter of our file, it is simply the date
that the comment was made.
2. `perma: "/2020/08/01/comments-system-1/"`<br/>
This line tells us which post this comment is related to. I'm using the posts
permalink as a unique identifier as the very nature of a permalink means that
it should be unique and never change.
3. `name: "alitebyte"`<br/>
This is the display name of the commenter. We'll see more about this in the
comment form.
4. `image: "data:image/png;base64, ......."`<br/>
This is the raw data (base64 encoded) for the commenters display picture (shortened 
here for brevarity). As with the name, I'll speak about this in more detail when I 
show the commment form.
5. `Hello, world!`<br/>
This is the content of the comment.

Now not every comment will have all of these things, for example, I wanted people
to be able to comment anonymously if they choose. Therefore the `name` and `image`
values could be blank.

We'll look at how these comment files are actually created a bit later. But for now
it's just import to know that we need these 5 bits of data (2 of which are optional).

## Building the request

Now that we know what data we will need to create out comment files, we can think about
how we can send this data to the server. Most of these fields are simple enough to send
with a standard html form, the only one which is a little bit more complicated is the
image.

I wanted the commenter to have the option to use their usual online persona while 
commenting. As this blog is a static site, I have no way of letting a user log in and
maintain a profile. What would be better is if they could just use the same display name
and profile picture as they use on other sites. Using Javascript I am able to query
some popular sites with a username or email to get a profile picture. Obviously I didn't
want to include the username or email in the comment as I wanted to be able to add all
the comments to source control. Therefore the next step was figuring out how to store 
the raw image data. Whenever you need to store some data as text, it's worth
looking into whether using `base64` encoding would be sufficient,In my case
I'm not concerned with storing this data securely, as it's a publicly available
image already, so `base64` will work fine.

I decided to check 3 different sources for a profile picture, depending on what the 
user enters as their 'persona'.

1. Twitter - If the user enters a name that starts with an @ symbol, we will look
up the profile picture for that twitter handle.
2. Gravicon - If the user enters an email address, we will look up the gravatar.
3. GitHub - If the user input doesn't match either of the previous two criteria,
we will try to look up a Github user.

I'm not going to go into detail on how to do these lookups, unless I get specifically
asked to. If you're interested it can all be seen in the source code of the page.

## Creating the comment

Now that I could send the relevant data to my webservice, I needed to decide on the 
best way to create the comment file. As I am using `Jekyll` for my site, I will
also need to rebuild my site after a new comment has been added.

In keeping with the theme of as much being in source control as possible, I decided
that my webservice would create each new comment as a pull request on my GitHub repo.
This also had the added advantage of letting me moderate each comment before it
is shown on the site.

At the moment the process is:

- A comment comes in and a pull request is created.

## Clever stuff with Github


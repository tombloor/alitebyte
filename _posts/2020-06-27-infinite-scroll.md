---
title: "ALiteByte Infinite Scroll"
slug: "infinite-scroll"
layout: post
categories: web-dev
tags: 
    - blogging
    - jekyll
    - alitebyte
date: 2020-06-27 23:35:00 -0500
---

I don't post as much as I should, but I recently decided to implement an infinite scroll system to stop my front page 
from growing indefinitely as I (albiet slowly) add more and more content. This approach should be fairly easy to 
implement on other Jekyll sites with minimal changes.

The basic premise behind the approach I decided to take is to leverage the existing Jekyll Pagination plugin. This 
plugin will split the posts collection into pages of a specific size. These pages will each be generated as an 
individual html page, allowing us to either navigate to them directly or fetch them dynamically with ajax. We'll be 
implementing the second approach to get the infinite scrolling effect.

Basically when the user accesses the home page of the blog, we will initialize a variable to track the page number. 
Whenever the user scrolls to the bottom of the page we will increment this variable and then try to fetch the 
corrisponding html page. If the page exists we will inject the appropriate html elements into the page. If it does not 
exist, we know their is no more content and we can either display a message to the user or just disable the scroller.

So now that we've got an idea of what we're aiming for, let's see how we can implement it.

## Setup Jekyll Pagination

The first part of this process is setting up the Jekyll Pagination plugin. 

To do this we need to start by installing the Jekyll Paginate gem. Add the following to the end of your Gemfile and then 
run `bundle install` to install it (You do use `bundler` right?...)


```
gem "jekyll-paginate"
```

Next we must configure the plugin. In your `_config.yml` file, add `jeykll-paginate` to the `plugins` section. Then add 
the following to the end of the file. (For a more in depth overview of this plugin, see 
[the documentation](https://jekyllrb.com/docs/pagination/))

```
paginate: 5
paginate_path: "/latest/page:num/"
``` 

Now when you build your site you should see the plugin doing it's work, there will be a folder called `latest` in the 
root of your site and (if you have enough posts) it will contain multiple copies of your index page. We could then add 
links to our layout to let us move between these pages, but that's not exactly the effect I'm going for, so we're going 
to use it a little differently.

## Limiting posts shown to one page

As things stand at the time I'm writing this, we're simply looping through all the posts in our site and rendering 
them on the index page. Now that we've set up the pagination plugin we need to make an adjustment so that our index page 
will only show one page of posts.

Right now our index page will have a line like this to loop through all the posts on our site:

{% include posts/highlight-file.html name='index.html' %}
{% highlight jinja %}
{% raw %}
{% for post in site.posts %}
{% endraw %}
{% endhighlight %}

We can simply replace the `site` object with the `paginator` object to get only the current page of posts:

{% include posts/highlight-file.html name='index.html' %}
{% highlight jinja %}
{% raw %}
{% for post in paginator.posts %}
{% endraw %}
{% endhighlight %}

Now if you build your site again the index page will only show the first 5 posts. Furthermore, if you visit 
`/latest/page2` you will see the next 5 posts, and so on.

## Triggering the infinite scroll

Now we have our posts split up nicely into pages we can start work on our infinite scroller. An infinite scroll system 
will detect when a user scrolls to the bottom of the page, and will then load the next set of posts and add them to the 
list. If done correctly, this can be a really smooth and satisfying experience for the user.

Before we can start thinking about loading the next page of our posts, we need to be able to detect when the user has
scrolled to the bottom of the page. To do this let's add a bit of javascript to our index page.

{% include posts/highlight-file.html name='index.html' %}
{% highlight jinja %}
<script type="text/javascript">
    $(function() {
        $(document).on('scroll', function(){
            let padding = 10;
            let end_pos = $(document).height();
            let current_pos = $(window).scrollTop() + $(window).height();

            if (current_pos + padding >= end_pos) {
                alert('Reached the bottom');
            }            
        });
    });
</script>
{% endhighlight %}

Here we are calculating the absolute position of the bottom of our viewport by adding the window's height to 
`$(window).scrollTop()`. We can then compare this value to the total height of our page to detect if we can see the 
bottom. I've also added a little bit of padding just incase the sizes don't quite add up (different browsers can 
behave differently).

Once we've checked that this is working, we can start writing some logic that will fetch the next page and append it to 
the list of posts. 

## Getting the next page 

There are several things that need to happen for us to fetch and display the next page of post. A nice way to keep all 
of this logic together is to group it into a class. This class should be responsible for the following:

- Keep track of the latest page that was loaded.
- Show some visual feedback that the end of the page has been reached and more data is being loaded.
- Fetch the next page of posts.
- Append the new posts to the page.
- If there are no more posts to load, feedback to the user and disable the feature so that we don't make further 
unnessesary requests.

{% include posts/highlight-file.html name='infinite-scroll.js' %}
{% highlight javascript %}
class InfiniteScroll {
    constructor(content_container, loading_element, base_url) {
        this.content_container = $(content_container);
        this.base_url = base_url;
        this.loading_element = $(loading_element);
        this.current_page = 0;

        this._hide_loading();
    }

    _show_loading() {
        this.loading_element.show();
    }

    _hide_loading() {
        this.loading_element.hide();
    }
}
{% endhighlight %}

When we instantiate this class we will provide 3 arguments:

1. `content_container` - The element which holds the content we'll be adding to (the list of posts).
2. `loading_element` - This is an element which will indicate that the site is currently loading more content. It will
be hidden and shown as neccessary.
3. `base_url` - The url which will be queried for more posts, the page number will be appended to the end. For example, 
if our `base_url` is `/posts/page` when we are retrieving page 4 it would become `/posts/page4`.

Let's add this to our index page:

{% include posts/highlight-file.html name='index.html' %}
{% highlight jinja %}
<script type='text/javascript' src='/assets/js/infinite-scroll.js'></script>
<script type="text/javascript">
    $(function() {
        let infinite_container = $('#infinite-container');
        let infinite_loading = $('#infinite-loading');
        let infinite_url = '/latest/page';

        let infinite = new InfiniteScroll(
            infinite_container, infinite_loading, infinite_url
        );

        $(document).on('scroll', function(){
            let padding = 10;
            let end_pos = $(document).height();
            let current_pos = $(window).scrollTop() + $(window).height();

            if (current_pos + padding >= end_pos) {
                infinite._show_loading();
            }            
        });
    });
</script>
{% endhighlight %}

Now if we scroll to the bottom of our page we'll see the loading indicator appear. Let's start working on the logic to 
load the next pages of posts. Add a new function to the `InfiniteScroll` class called `get_next_page` and update the 
scroll event to call this instead of `_show_loading`. This function will decide which page we need to get next, and 
construct the url. It will then call a different function to actually make the request, but let's not get ahead of 
ourselves.

{% include posts/highlight-file.html name='infinite-scroll.js' %}
{% highlight javascript %}
get_next_page() {
    this._show_loading();

    let next_page = this.current_page + 1;
    let url = this.base_url + next_page;

    this._fetch_page(url);
}
{% endhighlight %}

You'll probably have noticed that we're calling two other functions that we haven't added yet, `_fetch_page` and 
`_add_posts`. `_fetch_page` will make the web request and return the new posts, `_add_posts` will then add those posts 
to the list.

{% include posts/highlight-file.html name='infinite-scroll.js' %}
{% highlight javascript %}
class InfiniteScroll {
...
    _add_posts(posts) {
        this.content_container.append(posts);
    }
    
    _fetch_page(url) {
        let scroller = this;
        $.ajax({
            'url': url,
            'dataType': 'html',
            'success': function(data) {
                let posts = $(data).find('.post-summary');
                console.log(posts.length + ' posts loaded');
                if (posts.length > 0) { 
                    scroller._add_posts(posts);
                    scroller.current_page++;
                    scroller._hide_loading();
                }
            },
            'error': function(xhr, ajaxOptions, thrownError) {
                // This means the next page wasn't found. Later we'll disable 
                // the infinite scroll as we've reached the end
            }
        });
    }
}
{% endhighlight %}

At this point you should be able to load up your page and see it in action. 

## Optimisations

For the most part, our infinite scroller is now working. However there are still some more changes we need to make. 
We'll probably want to add some way to disable the scroller when it runs out of content, otherwise we'll be making lots 
of unnessesary requests. We'll also want to add some logic to make sure we're only sending out one request at a time, 
otherwise we could end up getting duplicate posts added to the list.

Let's start by adding a way to disable the infinite scroller when we run out of content. We'll add a property called
`is_active` and use this to determine if we should be making requests for new posts.

{% include posts/highlight-file.html name='infinite-scroll.js' %}
{% highlight javascript %}
class InfiniteScroll {
    constructor(content_container, loading_element, base_url) {
        ...
        this.is_active = true;
        ...
    }

    _fetch_page(url) {
        let scroller = this;
        $.ajax({
            ...
            'error': function(xhr, ajaxOptions, thrownError) {
                scroller.is_active = false;
                scroller._hide_loading();
            }
        });
    }

    get_next_page() {
        if (this.is_active) {
            this._show_loading();

            let next_page = this.current_page + 1;
            let url = this.base_url + next_page;

            this._fetch_page(url);
        }
    }
}
{% endhighlight %}

Now whenever our ajax call returns a 404 error, meaning there are no more pages to load, we disable the scroller.

Finally I think it's a good idea to add a safeguard to make sure we're not trying to fetch the same page more than once,
this could result in us having duplicate posts and other weirdness. A simple way to do this is to add another boolean 
which is set to `true` when we start requesting data, and is set to `false` when we've received it. Then we can check 
this variable is false before starting another request.

{% include posts/highlight-file.html name='infinite-scroll.js' %}
{% highlight javascript %}
class InfiniteScroll {
        ...
        this.is_loading = false;
        ...
    }

    _fetch_page(url) {
        let scroller = this;
        $.ajax({
            'url': url,
            'dataType': 'html',
            'success': function(data) {
                let posts = $(data).find('.post-summary');
                console.log(posts.length + ' posts loaded');
                if (posts.length > 0) { 
                    scroller._add_posts(posts);
                    scroller.current_page++;
                    scroller._hide_loading();
                }
                scroller.is_loading = false;
            },
            'error': function(xhr, ajaxOptions, thrownError) {
                if (xhr.status == "404") {
                    scroller.is_active = false;
                    scroller.is_loading = false;
                    scroller._hide_loading();
                }
            }
        });
    }

    get_next_page() {
        if (this.is_active && !this.is_loading) {
            this.is_loading = true;
            this._show_loading();

            let next_page = this.current_page + 1;
            let url = this.base_url + next_page;

            this._fetch_page(url);
        }
    }
}
{% endhighlight %}

And there we have the core functionality of the infinite scroller that I'm using on this site. I will obviously be 
polishing it a bit more and making it fit in with the rest of the site, but that's pretty much it. This same approach 
could be used on other `Jekyll` sites with minimal changes.

---
title: "Quote Breaker - A Vue.js Game"
slug: "quote-breaker"
layout: post
categories: 
    - web-development
    - game-development
tags:
    - Vue.js
date: 2020-09-04 20:38:00 -0500
---

Advanced Javascript UI frameworks are all the rage right now and there are plenty
of options to choose between when picking which one to try out. In this post
I'll be introducing you to a little project I put together while learning the
basics of `Vue.Js` and the reason why I picked this particular framework over
it's main competetor `React`.

## What is Vue.js

I think they sum it up pretty well themselves.

>Vue (pronounced /vjuː/, like view) is a progressive framework for building user
>interfaces. Unlike other monolithic frameworks, Vue is designed from the ground
>up to be incrementally adoptable. The core library is focused on the view layer
>only, and is easy to pick up and integrate with other libraries or existing
>projects. On the other hand, Vue is also perfectly capable of powering
>sophisticated Single-Page Applications when used in combination with modern
>tooling and supporting libraries.

*From the [Vue Guide](https://vuejs.org/v2/guide/){:target="_blank"}*

`Vue` occupies a very similar place as `React` and is used to help create
user interfaces. There are countless posts on the internet already explaining
the differences and similarities between the two so I'm not going to rehash
the same content here. For me personally there were a handful of features
which attracted me to learning `Vue` over `React` (At least for now):

1. `Vue` is open source - A purely personal preference.

2. `Vue` seems easier to jump into - You can start using `Vue` by just including
a javascript file in a simple `HTML` page. You're not forced down the route of
complicated build tools.

3. To me it looks like `Vue` has a better approach to code organisation. It looks
to be more traditional.

## What is Quote Breaker

In my opinion the best way to learn something new in programming is to use it in
a project. I wanted to learn `Vue`, and so I made Quote Breaker.

The idea for Quote Breaker comes from an old `DOS` game I occationally revisit,
[Sid Meier's Covert Action](https://en.wikipedia.org/wiki/Sid_Meier%27s_Covert_Action){:target='_blank'}.
In this game you play as a secret agent trying to solve a randomly generated case.
Alot of the gameplay is in the form of minigames that allow you to find clues to
crack the case. The minigame which inspired Quote Breaker has
you take an encoded message outlining part of the criminals plans, and decode it
by substituting letter until you can read what it says. If you have played Covert
Action before, it should feel quite familiar.

Quote Breaker has the same core gameplay, but instead of decoding criminal plans,
you're decoding famous quotes. It is a pretty simple premise and is hopefully
fairly easy to play, however I've found that some of the quotes can be really
quite tricky to figure out. You're given the name of the person who is being
quoted and I've found myself having to scour through lists of quotes by the
same person to try and get hints on what it might be.

<div class='row justify-content-center'>
<figure class='figure col-md-6'>
    {% responsive_image path: assets/img/covert-action-crypto.png class: 'figure-img img-fluid rounded img-thumbnail' alt: 'Sid Meiers Cover Action Cryptography Minigame' %}
    <figcaption class='figure-caption text-center'>Covert Action Cryptography Minigame</figcaption>
</figure>
</div>

## What did I learn

This little project did a good job teaching me some fundamentals of using `Vue`.
I have dabbled with Vue in the past, so I wasn't starting completely from scratch.
But this is the first Vue project that I took all the way to version 1.0 and so 
I feel I learned alot more than when I was just working through tutorials.

### Preventing the ugly flash of unstyled content

To start with it was a good reminder of how to get `Vue` set up in a standard
html page (My first experience with Vue I rather foolishly tried to dive straight
into a complex Single Page Application). The most notable takeaway for me was
how to prevent a minor graphical glitch which would cause the page to render
unstyled when it was first loaded. I found that you can avoid this by using the
`v-cloak` attribute on your vue element and adding a css rule to set the display
to none, like so:

{% highlight html %}
...
<style type='text/css'>
    [v-cloak] { display: none }
</style>
...
<body>
    <div id='app' v-cloak>
    ...
    </div>

    <script type='text/javascript'>
        let app = new Vue({
            el: '#app'
        });
    </script>
</body>
...
{% endhighlight %}

This will hide the element until vue has finished setting everything up that it
needs to, and avoid that ugly flash of unstyled content.

### Talking to an API

The next big thing I felt is a core component of any front-end framework, was
making requests to an API for data. That part that I didn't really think through
when I decided that this game would be all about guessing quotes...is that I don't
really know that many quotes. Luckily for me, I found a nice little API called
[Quoteable](https://github.com/lukePeavey/quotable){:target='_blank'} which has
a large number of quotes already saved. All I had to do to get them was to make
a simple `GET` request. There's no particularly special way to do this in Vue,
any way you usually make requests in javascript should work fine.

{% highlight javascript %}
const url = 'https://api.quotable.io/random';

let app = new Vue({
    el: '#app',
    data: {
        loading: false;
    },
    methods: {
        getQuote: async function() {
            // The Loading property is useful for adding feedback to the UI
            this.loading = true;

            let data = this._requestQuote();
            // Do stuff with the data that is returned

            this.loading = false;
        },
        _requestQuote: async function() {
            let response = await fetch(url);
            if (response.ok) {
                let json = await response.json();
                return {
                    quote: json.content,
                    author: json.author
                };
            } else {
                return {
                    error: response.statusText;
                }
            }
        }
    }
});
{% endhighlight %}

### Databinding complex objects

Finally, I learned a great deal about how databinding works in Vue. I already
had a basic understanding of this from my previous dabbling, but this time I
was trying to databind objects with multiple properties rather than just primitive
types. This took me a little while to figure out, as I quickly learned that if you
bind an object to a control, Vue is unable to track changes to the properties of
that object. Let me show you what I mean.

{% highlight html %}
<div v-for='(value, key, index) in myobject'>
    <input type='text' v-bind='value' />
</div>
{% endhighlight %}

I found that if I changed the value of any of the inputs in this loop, the change
would not feed back to the object. I struggled with this for a while but in the
end, after forcing myself to re-read the documentation and reaaally concentrate
this time, I managed to fix the problem. (Who'd have thought I'd find the answer
by reading the documentation :grimacing:)

{% highlight html %}
<div v-for='(value, key, index) in myobject'>
    <input type='text' v-model='myobject[key]' />
</div>
{% endhighlight %}

The answer was to use the `v-model` attribute rather than `v-bind`. It seems that
the `v-model` attribute is the way to go when you're trying to implement two way databinding. It essentially acts as a shortcut for adding a `v-on` attribute to update the model when the value is changed.  _From the [documentation](https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components){:target='_blank'}_ Remember that: {% highlight html %} <input v-model="searchText"> {% endhighlight %} Does the same thing as:
{% highlight html %}
<input
    v-bind:value="searchText"
    v-on:input="searchText = $event.target.value"
>
{% endhighlight %}

## What's next for this project

It might be a little while before I revisit this project, but I definitely have
plans to improve it and take it a little bit futher.

For starters I want to make it look at bit nicer. I put minimal effort into the
presentation of the game, as my focus was to get a playable version with the 
core functionality complete as soon as possible. I would like to add the choice
of two themes for the user to select, a light theme which will look largely the
same as it does now, and a dark theme because me programmer, me like dark theme.

Another idea I had to add something cool to this project was the concept of a
daily quote challenge. At the moment everytime you play the game you get a
random quote, and when you solve it there's no real reward other than the
oppertunity to pat yourself on the back and marvel at your enormous brain.
What I thought would be cool is a seperate mode where the game picks out a
single quote each day which is shown to all players. Then once a player correctly
decodes the quote they can submit it and I can store a record of who managed
to complete it. This would then allow me to create a leaderboard to see who
is the best quote decoder in all the land.

## What's next in my plan to learn Vue.js

When it comes to my journey to learn `Vue`, I think the next step for me is to
revisit the `SPA` concept and try to create a small project that I can expand
on in the future, much like Quote Breaker. I have a few ideas I want to try
so we'll have to wait and see which one sticks. I'll likely create another post
similar to this when it is in a state to show off, so be sure to drop by now and
again to see what's new.

I think that about wraps it up for this rather drawn out introduction to this little
project. I'm pretty excited to get better at `Vue` and maybe even get my feet wet
with `React` at some point. I'm especially interested in trying to get something
working cross platform, as both a desktop application using electron and a mobile
app using vue-native. But there I go trying to run before I can walk again, it's
probably best I just stop typing now before I talk myself into a colossal project
that'll never make it out of my WIP pile.


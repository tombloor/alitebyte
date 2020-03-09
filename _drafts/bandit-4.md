---
title: "Over the wire - Bandit 4-6"
slug: "otw-bandit-4"
layout: post
categories: ctf
tags: 
    - over-the-wire
    - bandit
    - linux
date: 2020-02-06 22:56:00 -0500
excerpt_separator: <!--more-->
---

In this series I will be working through the `bandit` challenges on [overthewire.org](https://overthewire.org/){:target="_blank"} - A site offering `CTF` style wargames.

This post will contain a walkthrough for challenge 4. 

<!--more-->

To see guides for challenges 0 through 3, [click here]({% post_url 2019-11-26-otw-bandit-0 %})

## Bandit 4

Let's get started with bandit level 4, ssh into the challenge as normal and enter the password from level 3

```sh
tom@alitebyte:~# ssh bandit4@bandit.labs.overthewire.org -p 2220
```

In this challenge we are told that the solution is in the only human-readable file in the `inhere` directory. Now you could sit there and `cat` each file in that directory until you find the right one, but that's not going to cut it when dealing with more than just a handful of files.

The `file` command will attempt to figure out the type of whatever file we point it at. For example, if we pass the first file in the `inhere` directory to the `file` command:

(EXAMPLE HERE)

So now we just have to run the `file` command against all the files we're interested in and see which one returns a human-readable format.

```sh
bandit4@bandit:~$ file inhere/*
```

(DOES THIS ACTUALLY WORK BY ITSELF? OR DO WE REALLY NEED TO PIPE THE FIND)

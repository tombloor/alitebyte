---
title: "Over the wire - Bandit 0-3"
slug: "otw-bandit-0"
layout: post
categories: ctf
tags: 
    - over-the-wire
    - bandit
date: 2019-10-08 20:47:00 -0500
excerpt_separator: <!--more-->
---

Series for over the wire bandit

0 - 3

<!--more--->

because they're so short, I'm bundle the first 4 challenges together. as they get more complex there will be less challenges per post.

## Bandit 0

super easy, first level is just to connect to the game

root@alitebyte:~# shh bandit0@bandit.labs.overthewire.org -p 2220

enter the password when prompted (it's on the webpage)

bandit0@bandit:~$ cat readme

## Bandit 1

connect

ls -la

file is called "-" which messes up cat as it thinks we mean stdin

cat ./-

## Bandit 2

ls 

file has spaces

cat "spaces in this filename"

## Bandit 3

ls 

see folder called inhere but it looks empty because the file is hidden

ls -a inhere

cat inhere/.hidden

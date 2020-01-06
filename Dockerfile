FROM ruby:2.7

RUN apt-get update && apt-get install -y rsync ruby-dev

FROM ruby:2.7

RUN apt-get update && \
    apt-get install -y ruby-full build-essential zlib1g-dev && \
    gem install bundler 

COPY . /app

WORKDIR /app

RUN bundle install

CMD ["bundle", "exec", "jekyll", "build"]

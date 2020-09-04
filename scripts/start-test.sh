#!/bin/zsh

systemctl start docker

docker run \
    --mount type=bind,source="$(pwd)",target=/app \
    --rm -p 4000:4000 alitebyte \
    bundle exec jekyll serve --drafts --host 0.0.0.0
    

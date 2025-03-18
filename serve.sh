#!/bin/bash
# Shell script to serve the Jekyll site locally with livereload

docker run --rm -it \
  -v $(pwd):/site \
  -p 4000:4000 \
  -p 35729:35729 \
  --entrypoint="/bin/sh" \
  ruby:3.1-alpine -c "cd /site && \
  apk add --no-cache build-base git && \
  gem install jekyll bundler && \
  bundle install && \
  bundle exec jekyll serve --host 0.0.0.0 --livereload --livereload-port 35729 --future"
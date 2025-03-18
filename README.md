# Personal Website

This is my personal professional and academic website built with [Jekyll](http://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/).

## Running Locally

### Using Docker (Recommended)

```bash
docker run --rm -it \
  -v $(pwd):/site \
  -p 4000:4000 \
  --entrypoint="/bin/sh" \
  ruby:3.1-alpine -c "cd /site && \
  apk add --no-cache build-base git && \
  gem install jekyll bundler && \
  bundle install && \
  bundle exec jekyll serve --host 0.0.0.0 --future"
```

Once running, view the site at [http://localhost:4000](http://localhost:4000).

### Traditional Method

If you have Ruby and Jekyll installed:

```bash
# Install dependencies
bundle install

# Serve the site locally
bundle exec jekyll serve --livereload
```

## License

Copyright (C) 2017 - Released under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

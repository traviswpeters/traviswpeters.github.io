---
layout: post
title: "The No-Nonsense Guide to App Deployment"
published: true
tags: [dev]
image:
  feature: mcm2017.jpg
  teaser: mcm2017-teaser.jpg
  credit: Maine Coast Marathon
---

## Prerequisites

Install [Homebrew](https://brew.sh/):

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install [Node](https://nodejs.org/en/) & [Node Package Manager (NPM)](https://www.npmjs.com/):

```bash
brew install node # installs node and npm
```

Sign up for accounts...

* [GitHub](https://github.com/) (for hosting code)
* [Heroku](https://www.heroku.com/) (app deployment platform)

## Now Deploy

Run the following commands on *your* system (i.e., "locally").
This is specific to my [toy social news web app project](https://github.com/traviswp/social-news-webapp).
Exchange details for some other project as needed.  

```bash
mkdir ~/projects && cd ~/projects                              # 0. create a directory for project
git clone https://github.com/traviswp/social-news-webapp.git   # 1. clone my sample project locally (a toy social news app)
cd social-news-webapp                                          # 2. move into the project directory
npm install                                                    # 3. use npm install the app dependencies (see: package.json)
heroku create                                                  # 4. heroku magic to, e.g., setup heroku remote & other configuration
git push heroku master                                         # 5. push your repo to the heroku remote (see last step) - more heroku magic to build/run your app
heroku open                                                    # 6. open the heroku-assigned url for your app in your browser
```

There are more details in the project [README](https://github.com/traviswp/social-news-webapp).
This should be all that you need to do to deploy an app!
That's it!

In general:
1. get the code,
2. get the dependencies
3. create a heroku app
4. push your code
5. and go see what you deployed!

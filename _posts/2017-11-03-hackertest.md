---
layout: post
title: Hacker Test
published: true
tags: [HackerTest, hacking]
image:
  feature: hackertest.png
  teaser: hackertest-teaser.png
  credit: hackertest.net
---

Hacker Test is an online "hacker simulator" where you can "test your hacking skills": [http://www.hackertest.net/](http://www.hackertest.net/).
This is yet another adventure into the world of "hacking challenges."
This challenge set was recommended to our Security Reading Group (SRG)/hckd group by Sergey Bratus of Dartmouth College.
What follows is a (hopefully brief) look at some thoughts on my experience working on these challenges.

> **Spoiler Alert:**
*I include the passwords for the various levels in plaintext below.
All of the passwords are probably out there somewhere if you really just want those.
From a pedagogical stand point, it is of no value to simply copy the passwords.
Work through the challenges, understand the techniques, learn the tools and creative thinking skills.
If you aren't doing it for that reason, then why oh why even spend time on these challenges?!*

It is worth noting that in many of the challenges it is useful (necessary?) to look at the webpage source files.
Unless otherwise noted, I'm using Firefox and I can access the page source with the hot-key `cmd-U`.
Most popular browsers support some form of developer tools that may be useful to you - go check them out.

## Level 1
The direct link for this level is: [http://www.hackertest.net/](http://www.hackertest.net/).
Given that these challenges are supposed to help us improve our thinking around, e.g., HTML,
    start with the easiest thing we can do: examine the HTML source.
Search for the obvious stuff (e.g., "password").
Read the code.
What you'll hopefully notice is that, upon submitting a password attempt, the `check()` function is called;
    this function performs a comparison which either takes us to a new location or prompts us to try again.
Examining the code shows the expected password (the string "null") hard-coded in the page's HTML source.

## Level 2
The direct link for this level is: [http://www.hackertest.net/null.htm](http://www.hackertest.net/null.htm).
Again, we'll examine the HTML source.
There, in plain sight, is a password prompt and comparison of our entry to a the string "l3l".
That's the password.

**NOTE:** don't make this harder than it has to be;
    l is a lowercase "L" not "1" - which is how I read it and couldn't figure out for a while why it wasn't working...
Take-away: to hack, one must be able to read... :D

## Level 3
The direct link for this level is: [http://www.hackertest.net/l3l.htm](http://www.hackertest.net/l3l.htm).
We are getting the hang of things now.
Examine the source.
Look for the obvious stuff.
Read the code.

By reading the HTML we see reference to "alinkColor" (specifically, the line `pw=window.document.alinkColor;`).
You can go read about "alinkColor" (I did...) but you'll find that it's just a color setting.
I tried the supposed default value.
I tried "black" and "red" and "blue."

If, however, you search on "alink" in the source (or just look a little above the relevant HTML), you'll see the text `alink="#000000"`.
This appears to be the expected password!
Enter that and you're off to level 4.

## Level 4 & 5
The direct link for this level is: [http://www.hackertest.net/abrae.htm](http://www.hackertest.net/abrae.htm).
This level kind of confused me because you arrive at the page and then it appears you are free to go on to the next level
    (without doing anything for *this* level).
I looked in the source and there doesn't appear to be anything tricky here.
Click the "Click here" link and it takes you to [http://www.hackertest.net/sdrawkcab.htm](http://www.hackertest.net/sdrawkcab.htm).

Now, we are taken to a new page that is awaiting yet another password input.
Take a peek at the source for *this* page.
Just after the password prompt we again see, right there as plain as the day is long, our password: "SAvE-as hELpS a lOt".

## Level 6
The direct link for this level is: [http://www.hackertest.net/save_as.htm](http://www.hackertest.net/save_as.htm).
In the source you'll find a link to an external javascript file, `passwd.js`.
Follow the link to the file and, once again, there you'll find the password for the next level in plaintext: "hackertestz".

## Level 7
The direct link for this level is: [http://www.hackertest.net/included.htm](http://www.hackertest.net/included.htm).
Unlike many of the previous levels, there is nothing remarkable in the page's source, so I started looking into the unremarkable;
    follow links, examine style sheets, inspect site assets... ah ha!
Did you notice the background asset for the body of the page (`bg="images/included.gif"`)?
You can directly view the image here: http://www.hackertest.net/images/included.gif.
The credentials for the next level are in the bottom right corner of the image.

```
Username: phat
Password: jerkybar3
```

In retrospect, the `included.htm` name for this page should have been an immediate clue.
Hindsight is always 20/20 though, right?

## Level 8
The direct link for this level is: [http://www.hackertest.net/pwd2.php](http://www.hackertest.net/pwd2.php),
    though you'll have to go through the previous level and enter the credentials (otherwise it takes you to an "authentication failed" page).

*More coming soon...*

## Level 9
## Level 10
## Level 11
## Level 12
## Level 13
## Level 14
## Level 15
## Level 16
## Level 17
## Level 18
## Level 19
## Level 20

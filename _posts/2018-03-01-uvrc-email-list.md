---
layout: post
title: "UVRC & Managing Email Lists the Fun Way"
published: true
tags: [running, dev]
image:
  feature:
  teaser:
  credit:
---

I recently took over the responsibility of managing the mailing lists that my running club uses.
Like every great computer scientist, I wanted to see if I could do anything to make my new job easier :).
In this post, I'll present a sneak peek behind the scenes into how I'm now managing these email lists
    (FYI we are using [Mailman, the GNU Mailing List Manager](http://www.list.org/)).

My hope for this post is twofold:
    (1) to show how our registration process to become a member of the Upper Valley Running Club
    translates to a new member being added to our our email lists;
    (2) to document my process for future maintainers.

## Background

Our membership process requires people to register/renew each year.
One of the perks of being an official Upper Valley Running Club (UVRC) member is access to our ***all*** mailing list.
Each year we completely purge this list,
    and add people shortly after they register/renew for UVRC membership.
The registration process is simple:
    a prospective member can [register for a UVRC membership online](http://uppervalleyrunningclub.org/membership/) through the Lebanon Parks Department.

Most of the members of the club don't have direct access to the registration information.
Fortunately, our running club has a close connection with the Lebanon Parks Department.
As a result, people that manage the website, mailing lists, etc.,
    get periodic updates in the form of a roster (an Excel file) with information about the registered members of our club
    (thank you, Paul Coats!).
Upon receiving the roster (for this post I'll simply refer to it as `ROSTER.csv`),
    I extract information I need and do some quick operations to make maintaining our mailing lists easy and consistent.

In my work, I assume that our UVRC roster file has the following fields:

```
First Name, Last Name, DOB, Gender, City, State, Phone 1, Phone 3, Email, Date/Time, Emergency Contact Name, Emergency Contact Phone Number, UVRC Personal Goals, UVRC Volunteer
```

As I'll describe below, I only need information from the `Email` field.

## Task 1: Purge a mailing list in Mailman

As I mentioned before, each year we purge our ***all*** email list and re-subscribe
    the members that have registered for the new year.
One way to purge a list in Mailman is to enter a collection of email addresses into a text box
    (each email address on a separate line).
Mailman will use these emails to search our database of emails and remove each email that it matches.

I *could* go through the existing emails one by one, see who is registered (i.e., are they in the roster file?),
    and remove people that aren't.
Not gonna happen.

Instead, I fetch the existing list of emails from Mailman (see the next section) and remove *everyone*.
Assuming I can fetch a list of everyone that is in the Mailman roster (i.e., a collection of email addresses),
    I do a "Mass Removal" using the fetched emails.

## Subtask: Fetching an existing roster from Mailman

So how do I fetch that list?
There are a couple of ways to do this but let's assume I can't login to the server that hosts our Mailman instance.

> ***NOTE:*** I can now, but only after some back-and-forth to get SSH enabled on the server.

Thus, given only a password to login to Mailman as an administrator, we can still carry out our task.

We can use the handy [`mailman-subscribers.py`](http://starship.python.net/crew/jwt/mailman/mailman-subscribers.py) script
    from the [Mailman Tips, Tricks, Scripts](http://starship.python.net/crew/jwt/mailman/#throughtheweb) page to programmatically download an existing mailing list.
I copied the source code from online and saved it to my computer as a little utility script.
Then we can run the script as follows:

```
python2.7 mailman-subscribers.py uppervalleyrunningclub.org all_uppervalleyrunningclub.org PASSWORD > roster.txt
```

This python script will contact our Mailman server, download the existing ***all*** mailing list roster, and save it to a file.
You'll notice from the line of code above that I specify additional arguments.
These arguments specify the Mailman instance to contact (`uppervalleyrunningclub.org`),
    the email list I want to fetch (`all_uppervalleyrunningclub.org`), and
    the password to login;
    saving the file is done as a result of redirecting the output from the request to a file (i.e., `> roster.txt`).

I did find that there are some weird character-encoding issues that need to be corrected - so before saving the file we can throw a little Perl at that issue
    (thank you, [Adrian Pronk](https://unix.stackexchange.com/questions/159253/decoding-url-encoding-percent-encoding/159309#159309)).

```
cat roster.txt | perl -pe 's/\%(\w\w)/chr hex $1/ge'
```

In fact, I can do this all in one line and then I have a nice, clean version of the existing mailman roster:

```
python2.7 mailman-subscribers.py uppervalleyrunningclub.org all_uppervalleyrunningclub.org PASSWORD | perl -pe 's/\%(\w\w)/chr hex $1/ge' | sort > roster-mailman-`date +%Y-%m-%dT%H:%M:%S`.txt
```

While it is inconsequential to the final result,
    note that I save the list to a file named "roster-mailman" with the current date/time.
This isn't necessary but its useful in a few situations (e.g., debugging).

## Task 2: Like a phoenix rising from the ashes... a new roster is born!

Now the good stuff.
After purging an email list (Task 1), how do I create a new list?
Here is how the process goes.

For the purposes of building up our mailing lists, I extract information from the `ROSTER.csv` mentioned above.
As an email list maintainer, I'm only concerned with column nine: the email addresses.
In fact, the `$9` in the line of code below is what selects the column that contains the email addresses.
That's right, I have no reason to look at any of the other information so I get what I need and throw the rest away (so to speak).

```
cat ROSTER.csv | awk 'BEGIN { FS=","; OFS=","; } {print $9}' | tr '[:upper:]' '[:lower:]' | sort | uniq | grep '@' > roster-new-leb-emails-`date +%Y-%m-%dT%H:%M:%S`.txt
```

Let's break down what this single line of code does.

> ***NOTE:*** Each step described below corresponds to each snippet of code separated by the `|` symbol, and should be read from left to right:

* `cat ROSTER.csv` reads in *all* of the roster data,
* `awk ...` extracts only the data in the "Email" column of the data,
* `tr ...` normalizes emails to be all lowercase letters
    (email is case insensitive and this normalization helps with the next step),
* `sort` (you guessed it!) sorts the list and `uniq` identifies only unique email addresses
    (some members register as families so it is common to see the same email for multiple people),
* `grep '@'` selects only the emails that have an `@` symbol.
    We could do more validation but we don't really *need* to do so;
    this is just meant to be something quick and dirty that we can use for easier and more consistent management of email addresses.
    (I can use `grep -v` to invert the matching which will show me if I've filtered out some email address entry that *doesn't* contain an `@` symbol.), and last,
* `> roster-new-leb-emails- ...` saves the result of this processing in a new file (if I didn't want to save the result to a new file, I could directly apply the processed data to my clipboard using `| pbcopy` - I can do this one because I'm a Mac user).

Most of this work is really a preemptive attempt to remove duplicate email addresses and variations of the same email address
    (e.g., in practice `coolrunner@gmail.com` is equivalent to `CoolRunner@gmail.com`).

Finally, I log into [Mailman](http://www.list.org/) through a web browser and either
    upload a file or paste in what is on my clipboard.
I hit enter and voil&agrave;, just like that, a new mailing list is born, "like a phoenix rising from the ashes."

## Task 3: Updating the mailing list periodically

From time to time I'll be emailed a new roster.
Once again I'm faced with a problem:
    I have to go through the updated roster and see which names are already in the system and add them...
Nope. Again, not happening.

> ***ASIDE:*** I guess I could purge the Mailman list every time and then only add back people in the updated roster.
> Thus, every update is just Task 1 (purge) followed by Task 2 (add everyone).
> I want to know, however, who the *newest* members are so I can send them a personal email to let them know they are now part of the email list.
> To do this, I need to identify only the people that are new since the last time I updated the list in Mailman.

What I do:

1. Download the current Mailman roster, just as I did above.
2. Extract the email addresses from an updated roster, similar to how I did it for a new roster above.
3. Compare the two rosters and add only those emails that are *new* since I last updated the Mailman roster.

The last step is the only new one so I'll only show that here:

```
comm -23 roster-new-* roster-mailman-* > roster-emails-to-add-`date +%Y-%m-%dT%H:%M:%S`.txt
```

This command compares (`comm`) two roster files:
    the first of which is the updated roster from the Lebanon Parks Department,
    the second of which is the existing roster in Mailman.
As a result of comparing these files, the `comm` command will generate a new file
    which contains the lines in the first file (`roster-new-*`)
    which are not present in the second file (`roster-mailman-*`).
I copy these emails --- which are all our recently registered members --- and add them to Mailman.

> I also use them to send that personal email I referred to above.

Easy peasy, lemon squeezy.

## Concluding thoughts

This post was written with non-technical people in mind.
Therefore,
    before ending this post I wanted to add a few final thoughts for those that are intrigued by all this nerd talk.

Everything that I've done here is using the [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell)
    shell scripting language (though Section 1 also refers to a [Python](https://en.wikipedia.org/wiki/Python_(programming_language) script);
You can repeat all of this by using the [Terminal](https://en.wikipedia.org/wiki/Terminal_(macOS) program (if you own a Mac).
There is a similarly-named program if you have a computer that runs the UNIX/Linux operating system.
Those of you running Windows could use something like [Cygwin](https://en.wikipedia.org/wiki/Cygwin).

The work I've described here relies heavily on a technique known as ***pipelining*** in which
    I perform a series of steps, and the output from the previous step feeds into the input of the next step.
For example:
```
Step 1 | Step 2 | Step 3 | ... | Step N
```
Here, we start by executing Step 1.
The output of Step 1 becomes the input to Step 2.
Step 2 uses its input from Step 1, does some work, then passes along its output to Step 3.
And so on and so forth.
Notice that each step is delineated by a "pipe" (`|`) symbol --- thus, a "pipeline".

At the end of some of my lines of code shown above, I have code such as:
```
> filename-`date +%Y-%m-%dT%H:%M:%S`.txt
```
This code simply appends a timestamp to the end of a file that is created;
    for example `roster-mailman-2018-02-12T10/45/35.txt`.
This helps me keep track of when files were created,
    so if I find any issues, I can go back to old files and try to troubleshoot them.

And last, guess what...? I did this all without opening Excel once! Neat, right?

If you have any questions or want to learn more, shoot me a message and we can chat!

See you on the mailing lists!

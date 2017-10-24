---
layout: post
title: Leviathan [OverTheWire]
published: true
tags:
- OverTheWire
---

I decided to write up my solutions for the
[Leviathan](http://overthewire.org/wargames/leviathan/)
challenges ("wargames") from
[OverTheWire](http://overthewire.org/wargames/).
There are surely a variety of other ways that the challenges can be solved.
I've tried especially hard to explain my actions and not take mysterious leaps
    with the hope that this write-up would actually be educational to those that spend time reading it,
    rather than simply a collection of "answers."

Throughout the wargame, the levels build on one another.
For example, to log in and do level 1, you need the password recovered from completing level 0.
In general, to attempt level N, use the ssh password from level (N-1).

It may also be helpful to note that, according to the website,
*"Data for the levels can be found in the homedirectories. You can look at /etc/leviathan_pass for the various level passwords."*
Annoyingly, there are 8 separate pages indicating that there are 8 Leviathan challenges.
None of the pages, however, contain any useful information;
    they all simply say "There is no information for this level, intentionally."
Thus, the Leviathan home page is probably the most useful reference (in addition to the rest of the Internet...).

While I'd like to think I'm super smart and can solve all of these by myself,
    the reality exists that I needed help sometimes due to ambiguity in the challenge, issues with the environment, and so forth.
I try my best to cite all of my sources where it is appropriate to do so.

> **Spoiler Alert:**
*I include the passwords for the various levels in plaintext below.
The passwords are added as a comment at the end of the initial `ssh` login command for each level (an example of the format is included below).
I wrote them down this way for my own convenience and I'm not changing that here;
all of the passwords are probably out there somewhere if you really just want those.
From a pedagogical stand point, it is of no value to simply copy the passwords.
Work through the challenges, understand the techniques, learn the tools and creative thinking skills.
If you aren't doing it for that reason, then why oh why even spend time on these challenges?!*

```bash
#Login
ssh leviathanN@leviathan.labs.overthewire.org -p 2223 #password=PASSWORD-FOR-LEVEL-N
```

## Level 0

```bash
#Login
ssh leviathan0@leviathan.labs.overthewire.org -p 2223 #password=leviathan0
```

As the leviathan introduction suggests, you don’t need any special skills to complete these challenges.
As I see it, a bit of curiosity probably suffices.
I logged in (with the ssh command above) and did an `ls -al` to see if there was anything interesting in the home directory.
I’ll let you look for yourself.
I had the thought: "what the heck, let's `grep` around for the obvious stuff."
Sure enough, hiding in plain sight, is the password for level 1.

```bash
$ ls -al
…snip…
$ egrep -r  'pass|leviathan' ~
./.backup/bookmarks.html:<DT><A HREF="http://leviathan.labs.overthewire.org/passwordus.html | This will be fixed later, the password for leviathan1 is rioGegei8m" ADD_DATE="1155384634" LAST_CHARSET="ISO-8859-1" ID="rdf:#$2wIU71">password to leviathan1</A>
```

Here, `egrep` allowed me to recursively search the user's home directory using a regular expression;
    in this case, it will reveal any files (and file content) where "pass" and "leviathan" are found.

**Takeaway:**
Don’t write passwords down in obvious places and don’t write them down in plaintext if at all possible.
If someone where to obtain access to your system, these are surely the first sorts of things they may easily do.

This was easy to find because the password itself was co-located with text that is easy to search for like a username (leviathan1)  
and even the obvious word "password."
Note that even truncating the word or misspelling it likely won’t conceal its presence — you’ll notice
that my `egrep` was run with the word "pass" which matched on "passwordus" and "password".

## Level 1

```bash
#Login
ssh leviathan1@leviathan.labs.overthewire.org -p 2223 #password=rioGegei8m
```

Again, I began by simply checking out what was in the home directory.
Why not check out the executable called `check` since it seems to be beaconing us?!

```bash
$ ls -al
…snip…
```

#### Approach 1: manually probing the executable (with `cat`, `strings`, etc.) for interesting strings
> This approach details how I completed the challenge the first time around.
After speaking with some friends that had also completed these challenges,
    they turned me on to Approach 2 (detailed below).

I was curious if any strings of value were compiled into the executable (e.g., hard-coded passwords).
```bash
$ cat check
…snip…
```

I scanned over the strings and saw things like “sex,” “god,” “love,” that stuck out as normal strings (i.e., not library names and so forth). I tried these passwords when running `check`; the password “sex” dropped me into a new prompt.
Go figure.

**NOTE:** I also ran the following command but didn’t see some of the `strings` that were in the “check” executable.
The `strings` program is good but not perfect.

```bash
$ strings check
…snip…
```
The new prompt might signify that something has changed in our shell environment (new permissions, perhaps?) so let’s check;
I see an effective ID (euid) as leviathan2 (the next level),
so this confirms that this new prompt allows us the ability to execute commands as leviathan2
(even though our user ID is uid=12001 and we are still logged in as leviathan1).

```bash
$ id
uid=12001(leviathan1) gid=12001(leviathan1) euid=12002(leviathan2) groups=12002(leviathan2),12001(leviathan1)
$ cat /etc/leviathan_pass/leviathan2
ougahZi8Ta
```

#### Approach 2: use ltrace (much simpler)

This approach uses `ltrace`: a library call tracer.
In a nut shell, `ltrace` allows you to invoke it with some other program as an argument, and as it executes the target program it
*"intercepts and records the dynamic library calls which are called by the executed process and the signals which are received by that process.
It can also intercept and print the system calls executed by the program"* (quoted text pulled from the man page for `ltrace`).

Thus, I invoked `check` with `ltrace`.
When `check` was running I simply typed “abc” as the password.
As `ltrace` runs, you’ll see that a `strcmp()` is invoked,
comparing the password you entered with the expected password.
Again, we can see the password in plaintext here.
(**Note for the reader:** I commented out the output here because it was messing with my markdown rendered :D)

```bash
$ ltrace ./check
# __libc_start_main(0x804852d, 1, 0xffffd7d4, 0x80485f0 <unfinished ...>
# printf("password: ")                                                                                                                                                             = 10
# getchar(0x8048680, 47, 0x804a000, 0x8048642password: abc
# )                                                                                                                                     = 97
# getchar(0x8048680, 47, 0x804a000, 0x8048642)                                                                                                                                   = 98
# getchar(0x8048680, 47, 0x804a000, 0x8048642)                                                                                                                                   = 99
# strcmp("abc","sex")                                                                                                                          = -1
# puts("Wrong password, Good Bye ..." Wrong password, Good Bye ...
# )                                                                                                                                            = 29
# +++ exited (status 0) +++
```

**Takeaway:**
Passwords (hard-coded) in plaintext in your executables… no no no...

## Level 2

```bash
#login
ssh leviathan2@leviathan.labs.overthewire.org -p 2223 #password=ougahZi8Ta
```

Yet again, let’s check out what “lives” in the home directory.
On this level you should see an executable named `printfile` in the home directory.  

```bash
$ ls -al
…snip…
```
Playing around with `printfile` a bit yields a couple of insights:
1. `printfile` accepts a filename as input
2. `printfile` is owned by user “leviathan3” (see output of ls -al).  
3. `printfile` uses the `access` syscall to check if the user has permission to read the file
    (but note that `access` checks permissions based on the process’ real UID and GID, rather than the effective ID;
    see the man page for `access` for more information).
    The `cat` program is invoked if the user does indeed have permission.
    Run `ltrace` on `printfile` with files that can be accessed by the current user and those that cannot to see this in action.

**Insight:**
If we could construct a file (or collection of files ;)) such that the call to `access` would succeed,
    but then `cat` would be invoked on a file of our choosing, then we might get somewhere!
The solution follows in two parts.
First, create a file with a filename that is multiple words separated by spaces, e.g., "my solution".
Second, create a symbolic link (see `man ln`) to `/etc/leviathan_pass/leviathan3`;
    the filename for the symbolic link should match the first word in the multi-word filename you created in the first step.

Congratulations, you are done!
Almost. now invoke `printfile` on your multi-word filename from the first step (be sure to put quotes around it).
The `printfile` program will first check that the current user (leviathan2) has the appropriate permissions to read "my solution"
(this is my multi-word file).
Since I created it when logged in as leviathan2, I do indeed have permission to access it.
Thus, the `access` check succeeds and the program continues.
Next, `cat` is invoked on the file — something interesting happens here, though.

The `cat` program is designed to take in a list of files separated by spaces and concatenate them all together,
    outputting them to stdout by default.
Since we fed the `printfile` program a filename with multiple words, separated by spaces,
    `cat` will interpret each word as a separate filename which is meant to be concatenated with subsequent files!
In other words, think of it as if you invoked `cat my solution` at the command line.
When `cat` is invoked on “my”, the symbolic link to `/etc/leviathan_pass/leviathan3` will be accessed,
    and since `printfile` is owned by leviathan3, when it is executing it has permission to access that password file!
The second argument passed to `cat` (in our case “solution”) is a file which doesn’t actually exist,
    so `cat` will throw an error there, but not before printing the password for the next level.

```bash
$ touch "my solution"                       #<<< a multi-word filename owned by leviathan2
$ ln -s /etc/leviathan_pass/leviathan3 my   #<<< a symbolic link named “my” that links to /etc/leviathan_pass/leviathan3
                                            #<<< NOTE: leviathan2 owns the symbolic link while leviatahn3 owns the target file (/etc/leviathan_pass/leviathan3) itself.
$ ls -al
...snip...
lrwxrwxrwx  1 leviathan2 leviathan2   30 Oct 19 12:06 my -> /etc/leviathan_pass/leviathan3
-rw-rw-r--  1 leviathan2 leviathan2    0 Oct 19 12:05 my solution
-r-sr-x---  1 leviathan3 leviathan2 7506 Oct 16 04:18 printfile
$ ./printfile "my solution"
Ahdiemoo1j
/bin/cat: solution: No such file or directory
```

I got a little help with the insight from the
[DEMUX blog](https://rundata.wordpress.com/2013/03/27/overthewire-leviathan-wargame-solution-2/).
I found there explanation...lacking, however, which is why I provided a more detailed explanation here.

# Level 3

```bash
#login
ssh leviathan3@leviathan.labs.overthewire.org -p 2223 #password=Ahdiemoo1j
```

As before, we `ls` on the home directory and reveal an executable.
Now with `ltrace` in our bag of tricks, this level seems redundant and too easy.
When invoking `level3` with `ltrace`, again we must enter a password.
This time it seems there is a `strcmp` *before* the password entry.
If we enter a password, we see *another* `strcmp`, this time it is comparing the password I entered with the string "snlprintf".

```bash
$ ltrace ./level3
# __libc_start_main(0x80485fe, 1, 0xffffd7d4, 0x80486d0 <unfinished ...>
# strcmp("h0no33", "kakaka")                                                                                                                                                       = -1
# printf("Enter the password> ")                                                                                                                                                   = 20
# fgets(Enter the password> snlprintf
# "snlprintf\n", 256, 0xf7fccc20)
```

If you re-run the program and enter "snlprint" this time, you'll be informed that "You've got shell".
We can use `id` to verify our new permissions and then simply "go get" the password for level 4.

```bash
$ ./level3
Enter the password> snlprintf
[You\'ve got shell]!
$ id
uid=12003(leviathan3) gid=12003(leviathan3) euid=12004(leviathan4) groups=12004(leviathan4),12003(leviathan3)
$ cat /etc/leviathan_pass/leviathan4
vuH0coox6m
```

# Level 4

```bash
#login
ssh leviathan4@leviathan.labs.overthewire.org -p 2223 #password=vuH0coox6m
```

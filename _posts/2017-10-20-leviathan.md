---
layout: post
title: Leviathan [OverTheWire]
published: true
tags: [OverTheWire, hacking]
image:
  feature: overthewire.png
  teaser: overthewire.png
  credit: OverTheWire.org
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

Here, `egrep` allowed me to recursively (`-r`) search the user's home directory (`~`) using a regular expression;
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
As `ltrace` runs the `check` program, you’ll see that a `strcmp()` is invoked,
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
This time it seems there is a `strcmp` *before* the password entry; it appears to return -1 but then the program continues.
If we enter any password at the password prompt, we see *another* `strcmp`, this time it is comparing the password I entered with the string "snlprintf".

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

Cool...?

# Level 4

```bash
#login
ssh leviathan4@leviathan.labs.overthewire.org -p 2223 #password=vuH0coox6m
```

This level appears somewhat unremarkable upon logging in.
There doesn't appear to be anything that screams "look at me" but there is a `.trash` and `.cache` directory.
I used `egrep` to search for the usual suspects:

```bash
egrep -r 'level4|pass|leviathan' ~
Binary file /home/leviathan4/.trash/bin matches
```

Let's dig a little deeper into this `bin` file in `~/.trash/` where we found a match to our `egrep`.

```bash
$ cd .trash/
$ ls -al bin
-r-sr-x--- 1 leviathan5 leviathan4 7433 Oct 30 04:16 bin
$ ./bin
01010100 01101001 01110100 01101000 00110100 01100011 01101111 01101011 01100101 01101001 00001010
```

Odd. The `bin` program seems be displaying *something* though to the untrained eye it may not mean very much.
If you immediately recognize this output as binary encoded data, great! You're correct!
But what data could it be encoding?
A password? The name of some other file that contains a password? Some sort of hint?
Let us once again turn to our friend, `ltrace`.

```bash
$ ltrace ./bin
# __libc_start_main(0x80484cd, 1, 0xffffd7c4, 0x80485c0 <unfinished ...>
# fopen("/etc/leviathan_pass/leviathan5", "r")                                                                                                                                                                   = 0
# +++ exited (status 255) +++
```

From the `ltrace` ourput we can see that the `bin` program appears to be opening a file from which to read (`fopen` with the `r` flag):
 `/etc/leviathan_pass/leviathan5`.
Unsurprisingly, we don't have permission to read the file.

```bash
$ cat /etc/leviathan_pass/leviathan5
```

Recall that we logged in as user leviathan4, so in reality we *shouldn't* have access to leviathan5's files (without being given access).
We can verify why this makes sense by using `id` to check our real and effective user and group IDs, as well as examining the permissions of the file in question.

```bash
$ id
uid=12004(leviathan4) gid=12004(leviathan4) groups=12004(leviathan4)
$ ls -al /etc/leviathan_pass/leviathan5
-r-------- 1 leviathan5 leviathan5 11 Oct 30 04:15 /etc/leviathan_pass/leviathan5
```

Did you notice anything interesting about the `bin` file earlier?
Let's look at it again.

```bash
$ ls -al bin
-r-sr-x--- 1 leviathan5 leviathan4 7433 Oct 30 04:16 bin
```

What does all of this mean? Let's break it down and identify the important and interesting stuff.

Unix file permissions are represented in either *symbolic* or *octal* notation.
Depicted above is the permissions for `bin` in symbolic notation.
The first `-` speaks to the file type (in this case `-` indicates that `bin` is just a "normal file");
this is not relevant to our examination of permissions so suffice it to say that we can ignore this for now.

The first grouping `r-s` identifies the user's (owner's) permissions with respect to the file.
The `r` indicates that the file is readable,
    the `-` indicates that the file is not writable, and lastly,
    the `s` indicates that the file is executable (and has the "setuid" attribute set).
The setuid attribute allow users to run an executable with the permissions of the executable's owner or group, respectively.
You can read more about this at the [`setuid` wiki](https://en.wikipedia.org/wiki/Setuid).
The wiki specifically notes that the setuid attribute is
*"used to allow users on a computer system to run programs with temporarily elevated privileges in order to perform a specific task.
While the assumed user id or group id privileges provided are not always elevated, at a minimum they are specific."*

The next grouping `r-x` identifies the group's permissions with respect to the file.
Again,
    the `r` indicates that the file is readable,
    the `-` indicates that the file is not writable, and lastly,
    the `x` indicates that the file is executable.
The final grouping `---` identifies the permissions of "others" with respect to the file; in this case, no permissions are granted.

You'll also want to note that the file is owned by the user "leviathan5" and that "leviathan4" is the associated group for the file.

#### So what did we learn from this?

Well, we learned the the setuid attribute is set which will all users to run an executable with the permissions of the executable's owner (leviathan5).
We also learned that the file is associated with the group leviathan4 (a group to which we, as the leviathan4 user, belong),
    and that members of the file's associated group have permission to read and execute `bin`.
Thus, we (leviathn4) can execute `bin` which will assume the permissions of leviathan5 as it runs.

From this, we know that when `bin` reads the file `/etc/leviathan_pass/leviathan5`, it has permission to read the file.
If you were paying attention, you would have noted that our `ltrace` output did indeed indicate that the call to `fopen` succeeded with return value 0.
Thus, we have strong evidence pointing towards the fact that the output from `bin` may in fact be the contents of the leviathan5 password file, but encoded in binary format.

All that is left to do at this point is figure out how to convert the binary data to ASCII (the form we expect our password to be in).
There are surely many ways to do this.
I found a nice one-liner using perl (see the [StackExchange post](https://unix.stackexchange.com/a/98949)).
This solution is nice because it handles the existence of spaces in the binary data.

```bash
$ ./bin | perl -lape '$_=pack"(B8)*",@F'
Tith4cokei
```

And there we have it!
Did we need to know all of this?
Not really. You may have seen the output from `bin`, recognized that it was binary
    (heck, maybe you can read binary as if its normal english, in which case you were probably done in a matter of seconds!)
    converted it to ASCII (assuming it was the password),
    and Bob's your uncle.
But isn't it more fun to *really understand* what is going on? I think so.

This has been an interesting challenge because we didn't see a call to `setuid` in the executable itself.
Observing such a call in the `ltrace` output surely would have alerted us to the fact that the executable was running with elevated privileges
    and that the file read would surely succeed, and therefore `bin`'s output surely is related to the password.
Rather, the file permissions were set in such a way that, when the executable was run, it executed with elevated privileges.
And we got to use our knowledge of file permissions to figure all that out!

If you are curious (or rusty) and want to learn more, [here is a brief tutorial on Unix file permissions](http://www.lianamonique.com/notes/unixpermission.htm).

# Level 5

```bash
#login
ssh leviathan5@leviathan.labs.overthewire.org -p 2223 #password=Tith4cokei
```

Upon logging in we can see that there is a `leviathan5` binary right in the home directory.
Run it and see what it does.

```bash
$ ls
leviathan5
$ ./leviathan5
Cannot find /tmp/file.log
```

The binary seems to be looking for a file `/tmp/file.log` that doesn't exist.
Sure enough, we can verify this:

```bash
$ ls -al /tmp/file.log
ls: cannot access /tmp/file.log: No such file or directory
```

Let us turn to `ltrace` once more to try to learn a little more.

```bash
$ ltrace ./leviathan5
# __libc_start_main(0x80485ed, 1, 0xffffd7d4, 0x8048690 <unfinished ...>
# fopen("/tmp/file.log", "r")                                                                                                                                                      = 0
# puts("Cannot find /tmp/file.log"Cannot find /tmp/file.log
# )                                                                                                                                                = 26
# exit(-1 <no return ...>
# +++ exited (status 255) +++
```

Ok, so the executable opens a file for reading, but the file doesn't exist.
How could we use this to get to the next level?
Well, how about we try creating a symbolic link to the leviathan6 password file!
After creating such a link and re-running the `leviathan5` binary,
    we see that it reads the tmp file and renders the password for the next level!

```bash
$ ln -s /etc/leviathan_pass/leviathan6 /tmp/file.log
$ ./leviathan5
UgaoFee4li
```

NOTE: After creating the link to leviathan6's password file, run `leviathan5` *without* `ltrace`.
I'm not exactly sure why this is the case, but the linked file can't be opened when `leviathan5` is run by `ltrace`.
I'm sure there is some nuance with permissions at play here but I haven't dedicated enough cycles to thinking though this thoroughly just yet...
And I'd rather go play the next levels so I probably won't do so for now :D

<!-- TODO: Why does the read not succeed when leviathan5 is run by ltrace? -->

# Level 6

```bash
#login
ssh leviathan6@leviathan.labs.overthewire.org -p 2223 #password=UgaoFee4li
```

```bash
$ ls -al leviathan6
-r-sr-x--- 1 leviathan7 leviathan6 7492 Oct 30 04:16 leviathan6
```

```bash
$ ./leviathan6
usage: ./leviathan6 <4 digit code>
```

### Brute-force approach

A program that expects a 4-digit code just screams "brute force me"!
So we can try this approach.

As in one of the [Bandit challenges](https://traviswp.github.io/bandit.html#level-25),
    we can put together a concise brute-force pipeline.
Our pipeline will construct all possibilities of 4-digit codes using bash expansions.
For example, `{0..9}` expands to 0, 1, 2, ..., 9.
Thus, by chaining expansions together, we can easily construct all possible permutations of a 4-digit code where each digit takes on a value between 0-9.
All of this is piped to `xargs` taking at most one argument (one of the 4-digit code guesses) and using that as input to `leviathan6`.

If this is a little confusing,
    try running parts of the pipeline alone or experimenting with smaller 4-digt code sets (e.g., `echo 000{0..9}`) to see this in action.

```bash
echo {0..9}{0..9}{0..9}{0..9} | xargs -n 1 ./leviathan6
```

**WARNING:**
This maybe isn't the best approach... it turns out that `leviathan6` only outputs "Wrong" when our guess is indeed wrong.
When we succeed, `leviathan6` drops us into a shell with an effective UID of leviathan7 - there is no text output.
I caught onto this when I redirected the output from running `leviathan6` to a file.
I expected to get a file with 10,000 lines (there are 10,000 combinations that exist for a 4-digit code).
The file, however, was only 9,999 lines long!
Which told me that, on the one guess that succeeded, no output was rendered.

Verify this for yourself:

```bash
$ echo {0..9}{0..9}{0..9}{0..9} | xargs -n 1 ./leviathan6 >> out.text
$ wc -l out.txt
9999 out.txt
```

We can be more clever and craft our output by writing a little script that does something similar to our pipeline.
Here, I've created a script (`crack.sh`) that prints which 4-digit code it is testing and then invokes the `leviathan6` executable.
I also added a small sleep because (I think) the script tries to run *fast* so it forks new children before others have finished,
    which led to me hitting my fork limit on the bandit servers.
By sleeping after invoking `leviathan6`, it gives the child process a little time to complete.
While this makes the script run slower, we can still try all 10,000 guesses in a relatively short amount of time.
I'm sure there are other workarounds but this was quick and dirty and easy.


```bash
#!/bin/bash
for i in $(seq -f "%04g" 0000 9999)
do
    echo "Testing: $i"
    ./leviathan6 "$i"
    sleep [SOME SMALL AMOUNT OF TIME]
done
```

After our script finishes, we have a file with all of our guesses and the result.
The format of the file is:

```
Testing: 0000
Wrong
Testing: 0001
Wrong
Testing: 0002
Wrong
...
```

and so on and so forth.

Thus, if we pipe the output of our file to `paste` (which can merge corresponding lines),
    then we will get a single line that says "Testing: GUESS Wrong" on all lines except one:
    the line where there is no "Wrong" output.
In this case, we get a line that reads "Testing: GUESS Testing: NEXT-GUESS"
While this is kind of hacky,
    we can then just run an inverted `grep` (i.e., using the `-v` flag) to look for lines that do *not* contain the word "Wrong" on them to find the guess that was correct.
Sure enough:

```bash
$ cat test.txt  | paste -d ' ' - - | grep -v "Wrong"
Testing: 7123 Testing: 7124
```

Now we can try `7123` with confidence that this is the expected 4-digit code.

Next, I'll describe an alternative approach that exercises a bit more finesse.

### Binary inspection approach

An alternative approach is to go in and examine the executable using tools that can give us insight into how the code runs and what values are used in the execution of the program.

Let's start by running the `leviathan6` executable with `ltrace`.
Be sure to invoke with a 4-digit code guess to exercise a more interesting code path.

```bash
$ ltrace ./leviathan6 1234
# __libc_start_main(0x804850d, 2, 0xffffd7c4, 0x8048590 <unfinished ...>
# atoi(0xffffd8f9, 0xffffd7c4, 0xffffd7d0, 0xf7e5519d)                                                                                                                             = 1234
# puts("Wrong"Wrong
# )                                                                                                                                                                    = 6
# +++ exited (status 6) +++
```

We see things like `atoi` being called.
It must be the case that `atoi` is called to convert our guess to an integer value which is subsequently compared to the value of the expected 4-digit code.
Perhaps we can learn what this value is by examining the comparison that takes place as the program exectures.

For this, let's turn to `gdb` to get a closer look at what is happening under the hood.
We'll start by invoking `gdb` with the `leviathan6` executable.
(The `-q` flag simply suppresses the annoying banner information).
We can then use `disas main` to disassemble the main function in the executable and see what it is doing.
A high-level look shows us that various functions are called: `printf`, `exit`, `atoi`, `seteuid`, etc (note: these are the lines with the `call` instruction).

```bash
$ gdb -q leviathan6
Reading symbols from leviathan6...(no debugging symbols found)...done.
(gdb) disas main
Dump of assembler code for function main:
   0x0804850d <+0>:     push   %ebp
   0x0804850e <+1>:     mov    %esp,%ebp
   0x08048510 <+3>:     and    $0xfffffff0,%esp
   0x08048513 <+6>:     sub    $0x20,%esp
   0x08048516 <+9>:     movl   $0x1bd3,0x1c(%esp)
   0x0804851e <+17>:    cmpl   $0x2,0x8(%ebp)
   0x08048522 <+21>:    je     0x8048545 <main+56>
   0x08048524 <+23>:    mov    0xc(%ebp),%eax
   0x08048527 <+26>:    mov    (%eax),%eax
   0x08048529 <+28>:    mov    %eax,0x4(%esp)
   0x0804852d <+32>:    movl   $0x8048620,(%esp)
   0x08048534 <+39>:    call   0x8048390 <printf@plt>
   0x08048539 <+44>:    movl   $0xffffffff,(%esp)
   0x08048540 <+51>:    call   0x80483e0 <exit@plt>
   0x08048545 <+56>:    mov    0xc(%ebp),%eax
   0x08048548 <+59>:    add    $0x4,%eax
   0x0804854b <+62>:    mov    (%eax),%eax
   0x0804854d <+64>:    mov    %eax,(%esp)
   0x08048550 <+67>:    call   0x8048400 <atoi@plt>
   0x08048555 <+72>:    cmp    0x1c(%esp),%eax
   0x08048559 <+76>:    jne    0x8048575 <main+104>
   0x0804855b <+78>:    movl   $0x3ef,(%esp)
   0x08048562 <+85>:    call   0x80483a0 <seteuid@plt>
   0x08048567 <+90>:    movl   $0x804863a,(%esp)
   0x0804856e <+97>:    call   0x80483c0 <system@plt>
   0x08048573 <+102>:   jmp    0x8048581 <main+116>
   0x08048575 <+104>:   movl   $0x8048642,(%esp)
   0x0804857c <+111>:   call   0x80483b0 <puts@plt>
   0x08048581 <+116>:   leave
   0x08048582 <+117>:   ret
End of assembler dump.
```

We are most interested in code concerned with `atoi` and subsequent comparisons.
Sure enough, right after the line where `atoi` is called, there is a comparison (see the `cmp` instruction?).
At that point, the contents of the `%eax` register are compared with some value that is offset from the stack pointer.
We can examine all of this by setting a break point at the line where the comparison happens.
Note that to set such a break point we use the name of the function (`main`) and the specified offset (`+72`).

We can then run the program and it will hit our break point, allowing us to examine registers and stack contents.

```bash
(gdb) b *main+72
Breakpoint 1 at 0x8048555
(gdb) run 1212
Starting program: /home/leviathan6/leviathan6 1212

Breakpoint 1, 0x08048555 in main ()
```

Great, now onto our examination.
While we don't *need* all the information, I like to see *all* of the registers.
The comparison we identified above leads me to believe we are only interested in the `eax` and `esp` registers.
In `eax` we see the value we input to the program, `1212`.
In `esp` we see an address.

```bash
(gdb) info registers
eax            0x4bc    1212
ecx            0x0  0
edx            0xffffd8dc   -10020
ebx            0xf7fcc000   -134430720
esp            0xffffd6d0   0xffffd6d0
ebp            0xffffd6f8   0xffffd6f8
esi            0x0  0
edi            0x0  0
eip            0x8048555    0x8048555 <main+72>
eflags         0x286    [ PF SF IF ]
cs             0x23 35
ss             0x2b 43
ds             0x2b 43
es             0x2b 43
fs             0x0  0
gs             0x63 99
```

In the comparison we are inspecting, we are interested in some offset from this address`esp` - specifically, `$esp+0x1c` - not just `esp` itself.
This must be where the value lives which is compared to our guess.

We can directly address `esp` by using the address `0xffffd6d0` or use the variable `$esp`.
I'll use the latter here, but either way works.
If we examine the memory contents at that address we see:

```bash
(gdb) print *((int)$esp+0x1c)
$1 = 7123
```

All we've done here is identify the memory address we are interested in, cast it to an `int` (i.e., interpret the contents at this address as an integer), and dereference it.
As a result we see the value `7123`.

### Finishing the level

Regardless of how we get there (brute-force vs. binary inspection vs. something else), we've got a 4-digit code which we believe to be correct.
Let's try it...


```bash
$ ./leviathan6 7123
$ cat /etc/leviathan_pass/leviathan7
ahy7MaeBo9
```

Sure enough, we were dropped into a new shell.
Assuming that we have obtained elevated privileges (you can verify for yourself), we can read leviathan7's password file.
Done!

# Level 7

```bash
#login
ssh leviathan7@leviathan.labs.overthewire.org -p 2223 #password=ahy7MaeBo9
```

Hmmm. Level 7 doesn't appear to be much of a level at all.
I guess we have arrived?

In the home directory there is a file named `CONGRATULATIONS`.

```bash
$ cat CONGRATULATIONS
Well Done, you seem to have used a *nix system before, now try something more serious.
(Please dont post writeups, solutions or spoilers about the games on the web. Thank you!)
```

Ooops. I posted my solutions already.
Let's be honest though - I'm hardly the first.
The solutions are out there.
And to be honest, write-ups are useful - there are some things that we can't figure out or that we *kind of* figure out.
And at that point, it is helpful to learn from others and their experience.
That was my hope - that my write-ups would provide insights that you the reader might not have had initially.
I hope that there was *something* you found useful - perhaps you learned a new tool or a new trick or a new way of thinking about how to solve a problem.
If you have comments for me, feel free to send me a message ([my home page](https://traviswp.github.io/) makes various communication options apparent).

Onto more challenges!

# Wrapping up

If you've completed these challenges you've surely added some cruft to your `~/.known_hosts` file.
I looked around to see how others manage their `known_hosts` file and found the following script.
Simply copy-paste the following script into a file named `ssh_known_host_cleanup.sh` and make it executable (`chmod +x ssh_known_host_cleanup.sh`).

```bash
#!/bin/bash
#
# A simple shell script to clean (delete)  ~/.known_hosts file hostname entry.
# -------------------------------------------------------------------------
# Copyright (c) 2007 nixCraft project <http://cyberciti.biz/fb/>
# This script is licensed under GNU GPL version 2.0 or above
# -------------------------------------------------------------------------
# This script is part of nixCraft shell script collection (NSSC)
# Visit http://bash.cyberciti.biz/ for more information.
# -------------------------------------------------------------------------
#
# Examples:
# ./ssh_known_host_cleanup.sh www-03.nixcraft.net.in
# ./ssh_known_host_cleanup.sh [leviathan.labs.overthewire.org]:2223
#
host="$1"

[[ $# -eq 0 ]] && { echo "Usage: $0 host.name.com"; exit 1;}

ips=$(host "$host" | awk -F'address' '{ print $2}' | sed -e 's/^ //g')
ssh-keygen -R "$host"
for i in $ips
do
    ssh-keygen -R "$i"
done
```

I updated the script's comments but I don't think I had to touch anything else (citation information in the comments).
You can read the comments to see examples of how I use the script, or you can just enter:

```bash
./ssh_known_host_cleanup.sh [leviathan.labs.overthewire.org]:2223
```

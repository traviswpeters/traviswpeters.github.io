---
layout: page
title: Debugging with GDB and Valgrind
---

A note to readers:
> The following page is part of the notes composed for CS 50 at Dartmouth College.
> The first few sections were composed some years back and are updated as needed --- the initial text itself (I believe) was crafted by Professors Palmer, Zhou, Campbell, and Balkcom.
> This text was subsequently revised by myself and Professor David Kotz.
> As a Teaching Assistant for CS 50 in Spring 2016, I personally designed and wrote the interactive tutorial on using GDB and Valgrind,
>   as well as the accompanying in-class activity and recitation section activity.
> I've continued to maintain these notes as I've been asked to return to the class as a guest lecturer for this topic.
> **This specific revision of the notes is current as of January 2018.**
>
> -Travis

### Goals

 * learn how to use GDB to debug code.
 * learn how to use Valgrind to track down and fix memory-related issues.

For a look at a code performance profiling tool called `grpof` and information about working with "core" files,
    see the [lecture extra](extra/).

There are some great reference materials for GDB at the beginning of the section
    "The GNU Debugger (GDB)" below.
In these notes we will often refer to GDB as `gdb`, which is the spelling used at the commandline.

To review the code discussed in class today, see
    [password.c](password/password.c) and its [Makefile](password/Makefile),
    [names9.c](neglected-names/names9.c),
    and the familiar `readlinep` code
    ([readlinep.c](neglected-names/readlinep.c), [readlinep.h](neglected-names/readlinep.h))
    as well.

You can view today's [in-class activity](activity.html).

You can view the [recitation section activity](debug-section-exercise/).

You can view today's Terminal [script](script.txt).

## Introduction to debugging

> “Debugging is twice as hard as writing the code in the first place.
> Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.” - Brian Kernighan

As we have started to turn our attention towards writing larger, more complex C programs we have tried to stress the importance of debugging incorrect or suspicious behavior in programs as well as documenting in detail how those programs have been tested.
The goal in making debugging and testing a priority is building programs in such a way that we are confident that they are robust and correct.

Alas, despite our great intentions to compose quality software, bugs still find their way into our code.
Bugs are such an inevitability in fact that many people have tried to estimate the number of bugs per some number of lines of code (LoC).
Some people believe the underlying takeaway is that our code should be as concise/complex as needed so that we can have fewer lines of code.
In this class, however, we take the stance that everyone should write clear code and should avoid the use of overly complex code because this can result in code that is *extremely* difficult to debug when those inevitable bugs crop up.
The words of Brian Kernighan (above) ring loud and clear on this topic.

In this lecture we will take a look at a couple of popular tools that are used for debugging C programs.
In a later lecture we will focus more on various approaches to testing.

Feel free to skip these notes if you write perfect, bug free code ;-)

## Techniques for limiting those pesky bugs

> "Don't Panic" -- Hitchiker's Guide to the Galaxy

The trouble with bugs is that no two are the same.
Bugs can be simple: bad pointers and array subscript errors; while others are sometime difficult to debug: the systems might run for days and then fails because of a slow memory leak or numeric overflow problem.
Programmers aim to understand the nature of the bug they are trying to swat: *is it reproducible?*
(does it always fail under the same set of conditions), *does it always manifest itself in the same way?*, and so on.
These are clues that help track down those pesky bugs in complex systems.
To some degree being a good debugger of C code comes with experience.

By now you are used to "segfaults" and seeing files such as core dumps in your directory when you run your program and something goes wrong (unless your are writing/compiling/running programs on the CS machines---there are details near the end of this lecture about accessing and debugging core files on the CS machines).
You may have heard others mention tools like the the GNU debugger (`gdb`) and Valgrind (`valgrind`)---or even have some experience using these tools yourself---which can be an invaluable aid in solving problems.
Through a set of examples we will show how to debug problems in a systematic manner.
But first let's discuss why bugs occur and what techniques other than running `gdb` help.

The complexity of a program is related to the number of interacting components; for example, the crawler interacts with the external `libcurl` library.
There is a line of thought that says as a rule of thumb the number of bugs grows with the number of interactions.
Reducing the complexity and interactions enables us to focus in on the location of bugs in code.
Gordon Bell summed it up this way:

> "The cheapest, fastest, and most reliable components of a computer system are the ones that aren't there."
>  -- [Gordon Bell](http://research.microsoft.com/en-us/um/people/gbell/)

Gordon's point is that the importance of a simple design cannot be overemphasized.

Debugging problems ranges from easy, moderate, or even all the way through downright super hard.
Techniques that help reduce debugging time include:

-   **a good design and design methodology;**
-   **consistent style (e.g., use C program idioms as much as possible);**
-   **boundary condition tests;**
-   **assertions and sanity testing;**
-   **defensive programming;**
-   **designing for testing;**
-   **avoid files that have a large number of functions, and functions that have a large number of lines; Aim for functions that do one thing, and do it well!**
-   **limit global data whenever possible; and**
-   **leverage code checking tools (aka "static analysis" and "dynamic analysis" tools).**

While we've already discussed some of these topics in this course, we will discuss more of them in this lecture and in future lectures.

## Approaches to debugging

When tracking down pesky bugs we can think of the following steps to finding and correcting them---a sort of "bug lifecycle":

* **Testing:** Finding out what bugs exist.
We have already designed some simple tests for programs we've written in this class already.
In a future lecture we will look at more approaches to testing.
* **Stabilization:** Try and make the bugs reproducible (identify the conditions that cause a particular bug every time).
* **Localization:** Identify the function/line of the code responsible.
If it repeated anywhere, then *refactor* the code.
    * "Refactor" means clean it up, reorganize it, improve readability/testability, etc., all without changing the code's behavior.
    * Be sure to run unit tests before and after refactoring to ensure you "did no harm."
* **Correction:** Fix the code!
* **Verification:** Test the code fix and confirm it works.
Then imagine other boundary-case examples that are related to the one that caused this bug to occur and test those while you're here.

Even in light of the above mentioned steps to finding and correcting bugs,
    there are many ways that people approach debugging their programs when issues arise...

* They don't.
* They sift through warning/error messages; once all of the messages are gone, they assume their program is correct.
* They use `printf`-style debugging (i.e., use `printf` statements strategically placed throughout code to help with inspection of variables and control flow).
* They use specialized debugging tools/programs (e.g., plugins integrated into your favorite IDE, commandline tools like `gdb` and `valgrind`).

Hopefully it is clear that *not* debugging is a bad idea.
Eliminating all of the warnings and errors is a good idea
    (and indeed is required when submitting assignments in cs50 :)
    but without proper testing there is no guarantee that your program is correct.
In the following sections we will discuss some of the other approaches to debugging.

### Code Inspection

Many times people rush and "hack" the debug phase and sit at the terminal hoping to eventually track down that bug via trial and error.
Most people do this as their first resort.
You will find this approach can be successful but it can be very time consuming - put more plainly, it will take longer than other techniques.

***One of the most effective debug tools is you!*** Stop and read your code.
Pretend you are a computer and execute the code with a pen and paper.
As you read your code, keep some of the following tips in mind:

* Draw diagrams! Especially for data structures.
* Regarding for/while loops, and recursion, think about the base case, and the boundary conditions, and work inductively toward the general case.
Errors most often occur at the base case or at the boundary cases.

Code inspection is very useful.
Good programmers closely trace through their code in detail.
Look for boundary problems in code, many times bugs exist at the boundaries - of structures, arrays, code (e.g., for loops), and, most of all, data.
Many difficult bugs require more power than just hacking and hoping.
Once you have read your code and convinced yourself it works then to fix the remaining bugs
    you need to instrument your code and start the detective work.

Sometimes while debugging you will discover other, unrelated bugs that haven't yet manifested themselves.
FIX THEM!

Pragmatic Programmer Tip :
> **Don't live with broken windows**
>  Fix bad designs, wrong decisions, and poor code
>  when you see them.

Pragmatic Programmer Tip :
> **Fix the Problem, Not the Blame**
>  It doesn't really matter whether the bug is your fault or someone else's---it is still your problem,
>  and it still needs to be fixed.


## The `printf` approach to debugging

"All I need is `printf`, right?"

Up until now you have been using mostly `printf()` (or its variants) to help you debug your code.
That can only get you so far.
Many different types of errors or bugs can exist in software.
For example, you may have bug free code but the performance of the system is abysmal.
How do you find performance errors in your code - could it be the choice of data structure is too "slow,"
    the structure of your code is awful,
    or perhaps the algorithms are a bad match for the system hardware or a particular set of input data?
What happens if you code looks error free but you have memory leaks?
You'll get little help from `printf()` for these.

Worse, the underlying bug may even interfere with `printf()`'s limited contribution to your efforts.
For example, if you have a segfault that occurs after your `printf()` is executed but its string never gets displayed because the process segfaults---you might think that the bug occurs before your `printf`
    when really the bug happens much later (i.e., the `printf` buffer many not be flushed before the program crashes).
The takeaway here is that `printf` is not your friend in these examples, rather it's a red herring.
What happens if your system runs for hours and only under a certain set of system conditions the code fails.
Working your way through 1000s of `printf` statements may not help.
When a bug is buried deep in the execution of your software you need sophisticated tools to track those down.
You need more than `printf()` to attack these bugs.
This lecture talks about tools to help with performance issues, memory leaks and difficult bugs.

## The GNU Debugger (GDB)

To get started, let's look briefly at the `man` page for `gdb` - go ahead and type
```bash
man gdb
```
at the command line.
As always, the `man` page contains invaluable information.

There is also *a lot* of great information about `gdb` on the web: for a detailed article check out:
    [the GDB manual](http://ace.cs.ohiou.edu/morton/docs/gdb_manual/gdb.html).
When learning a new tool, such as `gdb`, it can be quite helpful to keep a a good `gdb`
    [quick reference card](http://users.ece.utexas.edu/~adnan/gdb-refcard.pdf) handy - everything
    you need to know in terms of command syntax is here.

Also, for those of you interested in using `emacs`,
    it should be no surprise that the `emacs` editor also supports `gdb` - see
    [An Introduction To Using GDB Under Emacs](http://tedlab.mit.edu/~dr/gdbintro.html).

Before we get started using `gdb`, ensure your `mygcc` alias has the `-ggdb` flag - our
    standard `.bashrc` file defines `mygcc` with this flag,
    which you can verify by using the `alias` bash command (or by inspecting the `.bashrc`) file.
```bash
$ alias mygcc
alias mygcc=`gcc -Wall -pedantic -std=c11 -ggdb`
```
This flag ensures that useful metadata is packaged with your executable at compile time
    which `gdb` needs to help you debug your programs.

> **NOTE:** For the curious student, it is also worth noting that you can use GDB to debug programs written not only in C but also in C++, FORTRAN, and Modula-2. So trust us, you'll get a lot of mileage out of learning how to use GDB.

Without further ado, let's actually start *using* `gdb`.

GDB is invoked with the shell command `gdb`;
    it then prints its own prompt and accepts its own wide range of commands.
Once started, it reads commands from the terminal until you tell it to exit with the GDB command `quit`.
You can get online help from `gdb` itself by using the command `help`.

```
$ gdb
GNU gdb (GDB) Fedora 7.10.1-31.fc23
Copyright (C) 2015 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
<http://www.gnu.org/software/gdb/documentation/>.
For help, type "help".
Type "apropos word" to search for commands related to "word".
(gdb)
```

Once you see the `(gdb)` line (the last line in the above snippet),
    you are now in the `gdb` command prompt.

You can run `gdb` with no arguments or options;
    but the most usual way to start GDB is with one argument,
    specifying an executable program as the argument:

```bash
$ gdb program
```

In this case, we are invoking `gdb` on an executable file named `program`.

**NOTE:** If you don't want to see the banner text that is printing when invoking `gdb`,
    use the `-q` flag which effectively tells `gdb` to start "quietly" - we'll use this option in the text below.

### GDB Demo

In the following examples we will use a lot of the basic `gdb` commands -
    `break`, `run`, `next`, `step`, `continue`, `display`, `print`, `printf`, `x` (examine memory),
    `backtrace` (`bt` for short),
    and `frame` ([checkout stack frames](http://sourceware.org/gdb/current/onlinedocs/gdb/Frames.html) - this is an important concept in C and very useful for debugging and poking around in your code and looking at variables).
These are most of the common commands.

Just like the shell commands you'll only need a subset of the the complete set of `gdb` commands to become a very effective debugger.
Again, the `printf` approach to debugging is for novices and not part of the hacker's parlance
    or the necessary tools in your toolkit: `gdb` is!

***I strongly recommend that you go through the sequence of steps below and use these debugging commands.
Don't worry, you can't break anything.***

Let's start by `cd`'ing to the directory where we have some program that we want to debug---for the purpose of this demo I will be using a new program called `password`.

```bash
$ cd ~/cs50-live/password
$ make
```

The program is simple: `password` simulates a program that prompts the user to enter their password.
If the user's "guess" matches the password,
    then the user is "authenticated" (i.e., they get the nice "success" message).
If the user fails to enter the correct password,
    they will be prompted again.
The user is only allowed 3 guesses before the program terminates.

I tried the program once where I entered the correct password
    (which is currently hardcoded into the program; don't do this in practice!)
    and successfully "authenticated."

```
$ ./password
password: cs50
success!
```

This is a good sanity check.

I also tried the program on some reasonable "guess" passwords and I wasn't able to authenticate.

```
$ ./password
password: password
incorrect. try again. (attempt 1)
password: dartmouth
incorrect. try again. (attempt 2)
password: passwd
incorrect. try again. (attempt 3)
you've exceeded the max. number of attempts. try again later.
```

The program seems to work as it should.
So... I'm good, right?!

Well, except for this weird thing I encountered.
I thought I'd test the program with a few more passwords that I thought of off the top of my head:

```
$ ./password
password:
incorrect. try again. (attempt 1)    #<<< a "blank" password
password: 1234
incorrect. try again. (attempt 2)    #<<< a silly number password, almost like a passcode
password: abcdefghijklmn
success!
```

WHAT?! Success? Really?
We know from the source code and one of our trials above that the password is actually "cs50" - how can this be?

OK, let's poke at this program a little more:

```
$ ./password
password: abcdefghijklmnopqrstuvwxyz
Segmentation fault (core dumped)
```

Uh oh.
The dreaded segfault.
OK, I clearly need to investigate more.
Clearly something funny happens when I start entering long passwords (that or this program really doesn't like the alphabet...).
Since the weird behavior I'm noticing seems to be related to reading/checking passwords that are entered,
    I'll start my investigation of the code there.

Let's try running our program in that cool debugging tool, `gdb`.
Usually when `gdb` starts up it prints out a bunch of information about its version and license,
    then drops into the `gdb` "shell."
We'll use the note from above, however, and use the `-q` flag to not show this start-up information.

```
$ gdb -q password
Reading symbols from password...done.
(gdb)
```

One of the powerful features that a debugger offers us is the ability to set "breakpoints" in our code; when we run our program and the debugger encounters a breakpoint that we previously set, the execution of the program stops at that point.
Let's set a few breakpoints:

```
(gdb) break main
Breakpoint 1 at 0x400805: file password.c, line 22.
(gdb) break check_password
Breakpoint 2 at 0x4008b4: file password.c, line 57.
(gdb) break 36
Breakpoint 3 at 0x40086a: file password.c, line 36.
(gdb) info break
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000000000400805 in main at password.c:22
2       breakpoint     keep y   0x00000000004008b4 in check_password at password.c:57
3       breakpoint     keep y   0x000000000040086a in main at password.c:36
```

Hopefully you caught that: notice that we can set breakpoints by identifying the name of a function (e.g., "main" and "check_password"),
    or by specifying a particular line in our source code (e.g., line 36).
There are other identifiers that can be used to enable breakpoints (e.g., by memory address) but we will leave you to explore those later.
When you are debugging programs with multiple files you can also set breakpoints in different files by specifying the file
    as well as the function name or line of code where you'd like to enable a breakpoint (e.g., `break password.c:check_password`).
Again, we will get familiar with the basics here and you can go explore some of the other cool `gdb` features later.

Anytime you want to see the breakpoints you've currently created, run `info break` (as shown above).
You can also delete all of your breakpoints (`delete`), delete breakpoints identified by their "Num" (`delete 3`),
    clear specific breakpoints (`clear [function]` or `clear [line]`),
    or even enable/disable breakpoints so that you can leave them in place,
    but control whether they cause your program to stop when the breakpoint is encountered.
(For example, try `disable 2` to disable the second breakpoint; running `info break` should now show the `Enb` (enabled) flag set to "n").

Let's disable all of our breakpoints except for the one we set at the `check_password` function:

```
(gdb) disable 1 3
(gdb) info break
Num     Type           Disp Enb Address            What
1       breakpoint     keep n   0x0000000000400805 in main at password.c:22
2       breakpoint     keep y   0x00000000004008b4 in check_password at password.c:57
3       breakpoint     keep n   0x000000000040086a in main at password.c:36
```

At this point we've started `gdb` and told it about some breakpoints we want to set,
    but we haven't actually started running our program.
Let's `run` our program now by using the `run` command:

```
(gdb) run
Starting program: /net/grad/traviswp/cs50-live/password/password

Breakpoint 2, check_password () at password.c:57
57	    int authenticated = 0;       // "flag" that determines if the user successfully authenticated.
```

Note that you can also execute the program in `gdb` with arguments: `run arg1 arg2 ...`
    which is useful if your program accepts arguments upon start-up.

Just as we hoped (expected),
    the debugger started our program running but "paused" the program as soon as it hit the breakpoint
    that we set at the `check_password` function.
Once the program has stopped we can "poke around" a bit.

To start, let's `step` one line of code at a time:

```
(gdb) step
60	    printf("password: ");
(gdb) step
__printf (format=0x400a9f "password: ") at printf.c:28
28	{
(gdb) step
32	  va_start (arg, format);
```

Oops! Stepping line by line is nice but `gdb`'s `step` command allowed us to "walk" right down into the icky details of `printf`!
This is  pretty cool that we can `step` into functions but `printf` does a lot of work that we aren't interested in right now.
If you find yourself deep down in some function that you accidentally stepped into,
    use the `finish` command to start the program running again until just after the function in the current stack frame returns.

```
(gdb) finish
Run till exit from #0  __printf (format=0x400a9f "password: ") at printf.c:32
check_password () at password.c:61
61	    if (fgets(guess, 50, stdin) == NULL)
Value returned is $1 = 10
```

This is a lot to parse but let's try.
Basically when you type `finish`, `gdb` will run all of the code that remains in the current function (in this case, `printf`)
    and will stop execution again once it returns from the function.
Before running `finish`, we were *inside* the `printf` stack frame, which was denoted as stack frame "#0".
Calling `finish` will "pop" the stack, removing the item at the top of the stack --- in this case, a strack from is removed from the callstack.
This hopefully makes sense of the "Run till exit from #0 ..." output.
After `finish`'ing,
    we are back inside the `check_password` function which is at the top of the call stack now.
(You can verify this by typing `bt` now --- the `bt` command is shorthand for `backtrace`; more on this later).
In fact, `gdb` is nice enough to print the line which we are stopped on (line 61 in this case).
You can also see the return value ("Value returned ...") which is the return value from calling the `printf` function.
Did you know that `printf` returned something?
We rarely (ever?) check the return value of `printf`... but it does indeed return something!
From the `man` page (`man 3 printf`):

> "These functions (printf and some of its variants) return the number of characters printed
(not including the trailing \`\0' used to end output to strings)"

This explains the last piece of the output from running `finish`:
    when `printf` returns it returns a value of 10 since it prints the string "password: ".
It sure does help to read `man` pages!

Now that we are back up in our `check_password` function we can proceed.
To avoid stepping *into* functions we can use the alternative `gdb` command called `next`
    which is similar to `step` in that it executes one line of code and then pauses at the next line of code,
    however `next` will step *over* functions so that we don't end up deep down in some code that isn't relevant to us
    (i.e., deep inside of the details of `printf`); let's try that now:

```
(gdb) next
password: password
65	    if (strlen(guess) == 0)
(gdb) next
71	    if (guess[strlen(guess)-1] != '\n') {
(gdb) next
78	        guess[strlen(guess)-1] = 0;
(gdb) next
82	    if (strcmp(PASSWORD, guess) == 0)
(gdb) next
85	    return authenticated;
```

When we were using `next` (above) we finally got the prompt to enter a password---I
    decided to try one of the most popular passwords out there: "password" :).

Before we go any further, let's look at some of the local variables.
We can use the `print` command to display the value of some expression (e.g., variable name).

```
(gdb) print authenticated
$2 = 0
(gdb) print guess
$3 = "password\000"
```

We can even evaluate C code!

```
(gdb) print strlen(guess)
$4 = 8
```

Or use C's "address of" operator to learn about where some of our variables live in memory.
Keep in mind that these variables live on the "stack" and are local variables that only exist within the `check_password` function.

```
(gdb) print &authenticated
$5 = (int *) 0x7fffffffdf8c
(gdb) print &guess
$6 = (char (*)[10]) 0x7fffffffdf80
```

Pretty cool, right?
Notice that `gdb` is nice enough to also give us information about the *type* of the thing that we are looking at!

Let's run `next` until we are done in `check_password`.
Once we return from `check_password` we are returned to `main` at the point in the code just after where we called `check_password`.
I kind of forget where we are in the code so I'm going to use the `list` command to dump out some of the source code around where I am currently stopped in the program's execution.
By default, `list` will show us 10 lines of code where our current line is "centered" in the output.

```
(gdb) next
86	}
(gdb) next
main (argc=1, argv=0x7fffffffe0a8) at password.c:38
38	        n_guesses++;
(gdb) list
33
34	    // get password and check if user authenticated
35	    int result;
36	    while (n_guesses < MAX_NUM_GUESSES) {
37	        result = check_password();
38	        n_guesses++;
39	        if (result)
40	            break;
41	        else
42	            printf("(%d) incorrect. try again. (attempt %d)\n", result, n_guesses);
```

Back to stepping and checking some variables...and trying another password...

```
(gdb) step
39	        if (result)
(gdb) step
42	            printf("(%d) incorrect. try again. (attempt %d)\n", result, n_guesses);
(gdb) step
__printf (format=0x400a28 "(%d) incorrect. try again. (attempt %d)\n") at printf.c:28
28	{
(gdb) finish
Run till exit from #0  __printf (format=0x400a28 "(%d) incorrect. try again. (attempt %d)\n") at printf.c:28
(0) incorrect. try again. (attempt 1)
main (argc=1, argv=0x7fffffffe0a8) at password.c:36
36	    while (n_guesses < MAX_NUM_GUESSES) {
Value returned is $7 = 38
(gdb) next
37	        result = check_password();
(gdb) next

Breakpoint 2, check_password () at password.c:57
57	    int authenticated = 0;       // "flag" that determines if the user successfully authenticated.
(gdb) next
60	    printf("password: ");
(gdb) next
61	    if (fgets(guess, 50, stdin) == NULL)
(gdb) next
password: password2
65	    if (strlen(guess) == 0)
(gdb) print guess
$8 = "password2\n"
(gdb) print authenticated
$9 = 0
```

OK, I'm getting tired of stepping.
Rather than stepping line by line, I want to start the program running again
    (at least until it hits the breakpoint again) so that I can speed up the process of
    getting back to the code where I can enter a password and verify the changes.
To do this I can simply use the `continue` command which will continue the execution of the program until it is stopped again for some reason.

```
(gdb) continue
Continuing.
(0) incorrect. try again. (attempt 2)

Breakpoint 2, check_password () at password.c:57
57	    int authenticated = 0;       // "flag" that determines if the user successfully authenticated.
(gdb) next
60	    printf("password: ");
(gdb)
61	    if (fgets(guess, 50, stdin) == NULL)
(gdb)
password: password1234
65	    if (strlen(guess) == 0)
(gdb) c
Continuing.
(0) incorrect. try again. (attempt 3)
you've exceeded the max. number of attempts. try again later.
[Inferior 1 (process 16748) exited with code 02]
```

It looks like we got booted from the program because we exceeded the maximum number of attempts that it will allow.

At this point we've seen some useful `gdb` commands and you are now equipped to do some debugging on your own.
Keep poking at the program and see if you can find the error that allows people to authenticate in cases
    where they really shouldn't be allowed to do so.
If you need a push in the right direction, check out this [hint](passwordhint.html).
If you *really* can't figure it out after trying to use `gdb`,
    you can also check out a [brief discussion for the solution](passwordsolution.html) to the bug---only do this
    if you've *really* given it the ol' college try though :)

**A couple of cool things to note about `gdb` at this point:**

* Everytime you enter a command at the `gdb` "shell" that is successful,
    the output value is stored in a variable denoted `$N` where `N` increments by 1 for each command that you run.
You can use those variables at a later point if you want (e.g., `print $3`).
* `gdb` supports auto-completion on function names and variable names! Go ahead and try it out!
* Also similar to the bash shell, the `gdb` shell allows you to arrow up/down to revisit past commands.
* Many of the `gdb` commands have abbreviated forms
    (e.g., `run`=>`r`, `continue`=>`c`, `next`=>`n`, `backtrace`=>`bt`);
    see the [gdb quick reference guide](http://users.ece.utexas.edu/~adnan/gdb-refcard.pdf) to see other commands that have abbreviated forms.
* You can actually re-run the previous command simply by hitting `<enter>`.

### Frequently used `gdb` commands

Below are some of the more common `gdb` commands that you will need.
See also this printable [gdb quick reference guide](http://users.ece.utexas.edu/~adnan/gdb-refcard.pdf).

<div class="travis-table" markdown="1">

| command                 | purpose                 |
| :---------------------- | :---------------------- |
| `run [arglist]`         |Start your program (with arglist, if specified). |
| `break [file:]function` |Set a breakpoint at function (in file). |
| `list [file:]function`  |Type  the  text  of  the  program  in  the  vicinity of where it is presently stopped. |
| `backtrace`             |Backtrace: display the program stack. |
| `frame [args]`          |The frame command allows you to move from one stack frame to another, and to print the stack frame you select. args may be either the address of the frame or the stack frame number. Without an argument, frame prints the current stack frame. |
| `print expr`            |Display the value of an expression. |
| `continue`              |Continue running your program (after stopping, e.g. at a breakpoint). |
| `next`                  |Execute next program line (after stopping); step over any function calls  in the line. |
| `step`                  |Execute next program line (after stopping); step into any function  calls  in the line.|
| `help [name]`           |Show information about GDB command name, or general information about using GDB. |
| `quit`                  |Exit from GDB.|

</div>

## Valgrind: a memory management profiling tool

The `valgrind` tool is excellent for finding a number of problems, specifically issues in programs that involve illegal memory access and memory leaks.
Be sure to read this excellent brief tutorial from Stanford's CS107 class: [Guide to Valgrind](https://web.stanford.edu/class/cs107/guide/valgrind.html) (some of the notes below are adapted from this guide).

Running a program under `valgrind` results in extensive checking of memory allocations and accesses and it provides a report with detailed information about the context and circumstances of each error.
The output report can be quite verbose and a little difficult to use to improve your program's usage of memory if you don't know what you are looking for; therefore one of our objectives here is to look at a couple of examples and start to get a handle on how to read and interpret `valgrind`'s output.

**=> The Goal of a Programmer:** A clean report from `valgrind` that indicates "no errors and no leaks."

As far as you are concerned when using `valgrind`, there are two general types of feedback you will get regarding your program's usage of memory.
We will look at these next.

### Memory errors

The really obvious and bad memory errors will crash your program outright
    (e.g., accessing memory that is outside of your program's allocated memory).
The not so obvious memory related errors may "get lucky" most of the time (i.e., touch valid memory),
    but every once in a while the luck runs out and your program, somewhat mysteriously, fails.
Running `valgrind` on your program can give you insightful information on both of these sorts of errors.

When an error is detected by `valgrind` you should see some output that includes some sort of error description,
    the offending source code (line), and a little bit of information about the actual memory and what may be going wrong.
There are a few different types of memory errors that you may see such as:

* `Invalid read/write of size X`
* `Use of uninitialized value` or `Conditional jump or move depends on unitialized value(s)`
* `Source and destination overlap in memcpy()`
* `Invalid free()`
* etc.

### Memory "leaks"

When you allocate memory (e.g., `malloc`) but fail to properly `free` that memory when it is no longer needed,
    this leads to what is known as a *memory leak*.

As we've seen in class, memory leaks in small, short-lived programs that exit fairly quickly don't cause any noticeable issues.
In larger projects that operate on lots of data and/or those that are intended to run for a long time (e.g., webservers),
    memory leaks can add up and cause your program to fail.

Valgrind allows you to check your programs (e.g., what we refer to as `prog` below) for memory leaks and
    to get the best feedback you'll want to specify some additional flags:

```bash
$ valgrind --leak-check=full --show-leak-kinds=all ./prog [ARGS]
```

For convenience, we've actually defined a nice `myvalgrind` alias in the cs50 `.bashrc` file for just this reason.

```bash
$ alias myvalgrind
alias myvalgrind='valgrind --leak-check=full --show-leak-kinds=all'
```

Thus, you can simply run:

```bash
$ myvalgrind ./prog [ARGS]
```

The easiest way to determine if there is some sort of memory leak is to check the alloc/free counts generated in the `valgrind` output.
Ideally, the counts should match.
If they don't you'll get a "LEAK SUMMARY" at the end of the report as well as a little bit of information from `valgrind`
    regarding each of the detected memory leaks (e.g., how many bytes were leaked, where in the code the allocation happened).

When profiling your program, `valgrind` will attempt to categorize any memory leaks into one of four categories:
    **(1) definitely lost:** memory that was allocated from the heap but not properly freed, and there is no longer a pointer to the data;
    **(2) indirectly lost:** memory allocated from the heap that was indirectly lost due to "losing" a pointer that provided
        access to other heap-allocated memory;
    **(3) possibly lost:** memory that was allocated from the heap but not properly freed---`valgrind` can't determine
        whether or not there is a pointer to the memory;
    **(4) still reachable:** memory that was allocated from the heap but not properly freed,
        but the program still retains a pointer to the memory in some way.
Regardless of the category, these are all considered memory leaks and should be fixed!

### Valgrind Demos

In class we looked at one of the more recent versions of the "names" program, `names9`.
Running `valgrind` by itself does a good job of identifying various types of *memory errors* (see above).
If we want, however, to also get information about *memory leaks* in our programs,
    we need to run `valgrind` with the flags mentioned above.
Here is a snippet of the output that we saw when running `valgrind` on the `names9`:

```
$ myvalgrind ./names
==18387== Memcheck, a memory error detector
==18387== Copyright (C) 2002-2015, and GNU GPL'd, by Julian Seward et al.
==18387== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info
==18387== Command: ./names
==18387==
joe
bill
travis
mary
4 names:
{mary, travis, bill, joe, }
==18387==
==18387== HEAP SUMMARY:
==18387==     in use at exit: 396 bytes in 9 blocks
==18387==   total heap usage: 12 allocs, 3 frees, 2,525 bytes allocated
==18387==
==18387== 64 bytes in 4 blocks are indirectly lost in loss record 1 of 3
==18387==    at 0x4C2BBAD: malloc (vg_replace_malloc.c:299)
==18387==    by 0x40091E: bagnode_new (in /net/class/cs50/demo/names)
==18387==    by 0x4008CE: bag_insert (in /net/class/cs50/demo/names)
==18387==    by 0x400833: main (in /net/class/cs50/demo/names)
==18387==
==18387== 324 bytes in 4 blocks are indirectly lost in loss record 2 of 3
==18387==    at 0x4C2DA60: calloc (vg_replace_malloc.c:711)
==18387==    by 0x400A70: freadlinep (in /net/class/cs50/demo/names)
==18387==    by 0x4007B8: readlinep (in /net/class/cs50/demo/names)
==18387==    by 0x400815: main (in /net/class/cs50/demo/names)
==18387==
==18387== 396 (8 direct, 388 indirect) bytes in 1 blocks are definitely lost in loss record 3 of 3
==18387==    at 0x4C2BBAD: malloc (vg_replace_malloc.c:299)
==18387==    by 0x400896: bag_new (in /net/class/cs50/demo/names)
==18387==    by 0x4007FB: main (in /net/class/cs50/demo/names)
==18387==
==18387== LEAK SUMMARY:
==18387==    definitely lost: 8 bytes in 1 blocks
==18387==    indirectly lost: 388 bytes in 8 blocks
==18387==      possibly lost: 0 bytes in 0 blocks
==18387==    still reachable: 0 bytes in 0 blocks
==18387==         suppressed: 0 bytes in 0 blocks
==18387==
==18387== For counts of detected and suppressed errors, rerun with: -v
==18387== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
```

There can be *a lot* of output but we know from all of our experience as debuggers at this point
    that we should begin fixing errors starting with the first one reported---this is the best place to start and,
    in many cases, will fix a lot of the subsequent messages as well.
The first bit of feedback that `valgrind` gave us says that "64 bytes in 4 blocks are indirectly lost...".
Which routines are identified as possible sources of memory leakage?
Which of these routines actually allocate memory that was apparently leaked?
How can this be fixed?

**Hint:** There exists a comment in the code that identifies where we were a bit "lazy."
What needs to be done for the code to be less lazy?

With the fix in place, let's re-run `valgrind`:

```
$ myvalgrind ./names
==19656== Memcheck, a memory error detector
==19656== Copyright (C) 2002-2015, and GNU GPL'd, by Julian Seward et al.
==19656== Using Valgrind-3.11.0 and LibVEX; rerun with -h for copyright info
==19656== Command: ./names
==19656==
joe
bill
travis
mary
4 names:
{mary, travis, bill, joe, }
==19656==
==19656== HEAP SUMMARY:
==19656==     in use at exit: 0 bytes in 0 blocks
==19656==   total heap usage: 12 allocs, 12 frees, 2,525 bytes allocated
==19656==
==19656== All heap blocks were freed -- no leaks are possible
==19656==
==19656== For counts of detected and suppressed errors, rerun with: -v
==19656== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```

Look at that! No more errors!

## Activity - try it!

At the end of the day `gdb` and `valgrind` are tools that you can choose to use or not
    (though your grader will likely use both to explore the correctness of your programs so you should too!).
Reading about great tools is one thing, but really learning how to use a tool comes from...
using a tool!
Below are some instructions to get you setup with a few programs that have some bugs---some obvious,
    and some not so obvious---and your goal is to find those bugs and squash 'em using `gdb` and/or `valgrind`.
Good luck!

In today's [activity](activity.html) we use `gdb` to explore and fix logic and memory bugs in code.
In your section meeting this week you'll use `gdb` and `valgrind` to practice more logic and memory debugging.

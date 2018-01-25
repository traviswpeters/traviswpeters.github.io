---
layout: page
title: CS50 Final Project - KRAG
---

Your group shall design and code a multi-team, multi-player game called *[KRAG](REQUIREMENTS.html#game)*, according to the [Requirements Spec](REQUIREMENTS.html).
The project code shall be written in C and shall run on the CS50 Unix servers and on the [Pebble](pebble.html) smartwatch.

* TOC
{:toc}

## Updates {#updates}

Some updates since the project was announced, most-recent first.

* Added a section about the requirement for [Test results](#test-results).
* Added tips about [testing](#testing).
* Added tip about [modularization](#modularize).
* Noted requirement to disable debugging outputs before submission.

## Timeline {#timeline}

 * **May 12**: Project and [Requirements Spec](#requirements-spec) announced (in class)
 * **May 19**: Design Spec [due](#design-spec) (in-person and in Gitlab)
 * **May 24**: Implementation Spec [due](#implementation-spec) (10pm in Gitlab)
 * **May 30**: Code and Documents [due](#submission) (10pm in Gitlab)
 * **May 31**: Client presentation (in-person)

There are ***no extensions*** on these deadlines.

We will clone your repo at each of the times specified above.

### Class attendance

Your group shall attend every class period -- the professor and Learning Fellows will be there to work with your group.


## Group work

In the Final Project documents, *group* refers a set of CS50 students assigned to work together, and *team* refers to a set of players who play the *[game](REQUIREMENTS.html#game)*.

Your assignment is to work with your existing [group](https://docs.google.com/spreadsheets/d/1tPVXaobRS7FAJveszfCk7lk0C_NrktrynLiMjBO8_YM/edit#gid=106970956) of three or four students.
(Groups of four are required to include additional functionality.)

Your group shall use Gitlab to manage its code and documents, and to submit them to us.
One member of your group should fork the [project-starter-kit](https://gitlab.cs.dartmouth.edu/CS50/project-starter-kit-17s) Gitlab project, [rename the project](imgs/project-name.png) with your group's nickname, [change the path](imgs/project-path.png), mark the project as *Private*, edit the project description to list group members, invite your group-mates to share the project as Master, and invite user `cs50-17s` as Master.
All group members should then clone the project to a local repository.

## Requirements spec {#requirements-spec}

Write three programs in C, as follows.

1. ***Field Agent***, a Pebble app that communicates with the Game Server and interacts with the player wearing the Pebble.

2. ***Guide Agent***, a Unix program that communicates with the Game Server and interacts with the player who acts as a guide.

3. ***Game Server***, a server that communicates with all players, from all teams, to record the game's progress and provide information to each of the players.

You may also find it helpful to write a bash script to launch a game, and bash scripts or other C programs for testing.

Specific requirements about each program are listed on the [REQUIREMENTS](REQUIREMENTS.html) page.

## Design spec {#design-spec}

[At a pre-arranged time](design-schedule.html), your group will present your design to us.
You have 10 minutes to present, and then we have 10 minutes for Q&A.
If you are late for your presentation, you have less time to present to us.
(Don't be late.)

In 10 minutes you have time to present an *overview* of your design decisions and how your group will divide the work; the document provides more detail.
Be prepared to answer questions and receive feedback.

***Bring two printed copies of your design with you to the meeting.***

Your design document (written in Markdown) shall

* describe the major design decisions,
* describe the design of your Game Server,
* describe the design of your Guide Agent,
* describe the design of your Field Agent, and
* describe the roles of each member of your group.

*For each of the three programs,* describe the

* User interface (including command-line parameters and stdin/stdout/graphical interface);
* Inputs and outputs;
* Functional decomposition into modules;
* Dataflow through modules;
* Major data structures;
* Pseudo code (plain English-like language) for logic/algorithmic flow;
* Testing plan, including unit tests, integration tests, system tests.

Recall the Lecture about Design; it has a section about [design specs]({{site.lectures}}/design/design.html#design-spec).
Do *not* repeat elements of the Requirements spec; instead, link to [that page](REQUIREMENTS.html).

### Submission - what, when, how {#submit-des}

**What:** Your Gitlab project shall include a file `docs/DESIGN.md`.

**When:** before you arrive at the Design review meeting.

**How:** commit `DESIGN.md` and any associated files, tag with `submit-des`, and push.

Your design may benefit from diagrams; read about [Markdown]({{site.resources}}/#markdown) to see how to embed inline images (png or jpg are best).

## Implementation spec {#implementation-spec}

You must submit an Implementation spec (written in Markdown): a summary of your plans for implementing the three applications, providing the prototype and brief description of each function, and describe the data structure(s) you plan to use.

Recall the Lecture about Design; it has a section about [Implementation specs]({{site.lectures}}/design/design.html#implementation-spec).
As examples, see the implementation specs provided as part of the TSE solutions.


### Submission - what, when, how {#submit-imp}

**What:** Your Gitlab project shall include a file `docs/IMPLEMENTATION.md`.

**When:** before the deadline specified in the [timeline](#timeline).

**How:** commit `IMPLEMENTATION.md` and any associated files, tag with `submit-imp`, and push.

Your implementation spec may benefit from diagrams; read about [Markdown]({{site.resources}}/#markdown) to see how to embed inline images (png or jpg are best).

## Test results {#test-results}

You must submit test results (written in Markdown): a summary of how you tested your code, describing your unit tests, integration tests, and system tests.
Describe your testing methodology and any tools or frameworks you built to help in your testing.
Refer to any test files you use for testing, and include them in your repo.

As examples, see the `TESTING.md` provided as part of the TSE solutions.

### Submission - what, when, how

**What:** Your Gitlab project shall include a file `docs/TESTING.md`.

**When:** with your final submission, below.

**How:** commit `TESTING.md` and any associated files.


## Final submission {#submission}

Everything -- all code and documentation -- must be submitted by the deadline.
***Do not leave everything to the final minutes before the deadline;***
you are far more likely to make a mistake, and have no time to correct it.
Plan to submit everything several hours before the deadline.

### Submission - how, when, what {#submit-all}

**How:** commit all necessary files, tag with `submit-all`, and push.

**When:** before the deadline specified in the [timeline](#timeline).

We will grade the version of the code tagged `submit-all` at the time of the deadline; if no such tag appears until later you will ***lose 10% per hour after the deadline***.
Read that carefully: 10% *per hour*, not per day.
No extensions will be permitted.

**What:** Your Gitlab project shall include all necessary source and documentation files.

 * Your code should be organized in the directory structure provided, with sensible filenames.

 * There should be a Makefile for each program or library, and a top-level Makefile to build the whole project.
We must be able to `make all` and `make clean` from the top-level directory.
(In the Field Agent directory, the Makefile might run a script that uses `uname` to determine whether it is running on Linux or MacOS (Darwin); on Linux it should just exit with zero status and on MacOS it should call `pebble build` or `pebble clean` as appropriate.)

 * The Game Server and Guide Agent must compile (with no warnings) on the CS50 Unix servers with the usual CFLAGS.
They must run without segfaults.
They must not have memory leaks as determined with `valgrind`.
They must not output any debugging information to stdout (turn off debug outputs before submitting).

 * The Pebble code must compile (with no warnings) on a Sudikoff Lab Mac with `pebble build`.

 * There shall be a `README.md` file in each subdirectory (explaining the purpose of that subdirectory and its contents), and a `README.md` file in the top directory (naming all group members and summarizing the purpose of each subdirectory).

 * There shall be a `docs/` subdirectory, with (at least)
	* a file `README.md`, as noted above.
	* a file `DESIGN.md`, optionally updated from the version you submitted earlier.
	* a file `IMPLEMENTATION.md `, which *must* be updated from the version you submitted earlier and *shall* identify and describe all modules (not just your three programs) as written.
	* a file `TESTING.md` indicating how you tested your solution.
This file may refer to other files, such as test scripts, test inputs, or test outputs (including screenshots).
	* any images or files needed to render the above documents.
	* any other documentation you find it useful to include.

 * The Gitlab project (and any freshly cloned copy) shall be 'clean'.
That is, it should not contain any 'derived files' (those built by `make` and removed by `make clean`) or any 'scratch files' (including editor backup and autosave files).

You may prepare your client presentation materials after the deadline, up to the moment you meet your clients the next day.

## Client presentation {#presentation}

[At a pre-arranged time on May 31](demo-schedule.html), your group shall present your solution to us.
You have 10 minutes to present, and then we have 10 minutes for Q&A.
If you are late for your presentation, you have less time to present to us.
(Don't be late.)

You shall present

 * A demonstration of your solution.
 * A summary of your implementation decisions.
 * Any limitations of your current implementation.

All group members should have a speaking role in this oral presentation.
You are encouraged to use other media (e.g., textual outline, hand-drawn diagrams, or Powerpoint slides); you must bring **two printed copies** for us to peruse during the presentation.

## Grading

Your final project will be graded out of 100 points, with points assigned to categories as follows:

 * 15 points: Design spec
 * 15 points: Implementation spec
 * 15 points: Code style and quality
 * 15 points: Client presentation
 * 40 points: Functionality
 * -10 points: any segfault *(there will be no opportunity to fix and resubmit)*
 * -10 points *per hour*: if the `submit-all` tag appears late

***See the [grading rubric](rubric.html).***

Furthermore, immediately after the project you will each complete a confidential online survey in which you comment on your contribution to the project, and the contributions from members of your group; the Professor uses the information in that survey to set 5% of your overall course grade (recall the [grading policy]({{site.logistics}}/#grading)).

## Tips

Here are some tips and tricks you may find useful.
We may add to this list as the project evolves.

### Modularize your code {#modularize}

This game is a big software package.
There are three components -- three programs -- but there is too much code, and too many opportunities for sharing code, for a solution to have only three `.c` files and still have good style.
Think carefully about how to break your program into meaningful, manageable modules.
This approach will make your code easier to read -- and easier to code in a group.

### Module for parsing

We *strongly recommend* writing some sort of 'parser' module to handle all the nitty-gritty details of parsing and validating messages.
You definitely want to keep this code separate from your game logic, and pushing it out into a separate module means you could share this code across two or three components.
If you do not follow this recommendation you will likely lose points on Coding Style.

### Module for handling sockets

Sockets are great, but socket code is pretty ugly.
We *strongly recommend* that you write some sort of 'message' module, perhaps useful in both the Game Server and Guide Agent, that abstracts away the mechanism used for receiving and sending messages.
This approach separates all the ugliness of socket handling from the game logic.
It also makes it much easier to support logging because there is one place to log every inbound and outbound message.
It eases debugging because it provides a clear point at which you might set a `gdb` breakpoint relevant to all inbound and outbound messages.
It also provides opportunities for testing, e.g., to read messages from a file instead of from a socket, or write messages to a file instead of to a socket, enabling you to run automated tests against your game server or guide agent.
If you do not follow this recommendation you will likely lose points on Coding Style.

### Command-line options

You are welcome to add *optional* parameters to the command line, as long as they are *optional* and the program runs properly when using only the arguments listed in the Requirements Spec.

### Time

In several places you need to know the time, or track elapsed time.
On the Pebble, see the Pebble documentation.
On Linux, you'll need to use the `time()` system function (see `man 2 time`).
For example,

```c
#include <time.h>

time_t start = time();
//... do other things, time passes...
time_t now = time();
time_t elapsed_seconds = now - start;
```

If you want to print a time value, look at the functions in `man ctime`.

### Random numbers

To generate random numbers, use the `random()` and `srandom()` functions available in `<stdlib.h>`.
See the [fuzzquery.c]({{site.examples}}/fuzzquery.c) for example usage.

However, for a reason we don't totally understand, we needed to use the (more relaxed) `gnu11` standard instead of the `c11` standard to compile the code when using these functions.

```make
# Need to use gnu11 instead of c11 standard, to access random/srandom
CFLAGS = -Wall -pedantic -std=gnu11 -ggdb $(FLAGS) -I$C -I$L
```

### Converting Latitude and Longitude to Meters {#distance}

If you want to take the Euclidean distance between to lat/long pairs you should first convert them to meters.
To do this, we will assume that the Earth is a sphere with a perimeter of 40075km.
Given this perimeter, the length in meters of 1° of latitude = always 111320.
The length in meters of 1° of longitude = 40075km * cos(latitude/360 * 2pi) / 360.
Google places Dartmouth college at 43.7044° N, 72.2887° W.
If we use Dartmouth's latitude in our longitude equation we get that 1° of longitude =  40075000 * cos(43.7044 / 360 * 2pi) / 360 = 80474.

Thus, when you want to convert lat/long pairs to meters to calculate euclidean distance you can use the values

* 1° of latitude = 111320 meters
* 1° of longitude = 80474 meters

### Data structures

You are welcome to use the `libcs50` data structures in your project, either your own implementation or our implementation; copy the files from our TSE starter kit to your project repo.
If you do so, copy the entire `libcs50` directory as-is, and use it as-is.

If you need other data structures, write them as modules inside the relevant component subdirectory, or in a `common` subdirectory.

### Function tables

Many programs encounter the following situation: there are a range of 'commands' or 'cases' supported, each selected by a command name, keyword, code number, or the likes.
You've written a different function to handle each command or case.
You now need some code that will *dispatch* (call) the relevant function according the command you encounter.
*Function tables* are a concept designed for just this kind of situation (and others).
Let's look at an example.

```c
/**************** functions ****************/
static void fn_get(char *rest_of_line);
static void fn_put(char *rest_of_line);
static void fn_hello(char *rest_of_line);
static void fn_goodbye(char *rest_of_line);

/**************** function dispatch table ****************/
static const struct {
  const char *command;
  void (*func)(char *rest_of_line);
} dispatch[] = {
  { "GET", fn_get },
  { "PUT", fn_put },
  { "HELLO", fn_hello },
  { "GOODBYE", fn_goodbye },
  { NULL, NULL }
};
```

Here we see four functions, each presumably handling one of the four commands GET, PUT, HELLO, GOODBYE.
Then we declare and initialize an array of structs, each of which has the name of the command and a pointer to the function that handles the command.

Later, when you have somehow extracted a string `command` and a string `rest_of_line`, you can now easily loop over the function table to select and call the corresponding function:

```c
// dispatch the appropriate function
int fn;
for (fn = 0; dispatch[fn].command != NULL; fn++) {
  if (strcmp(command, dispatch[fn].command) == 0) {
  	(*dispatch[fn].func)(rest_of_line);
  	break;
  }
}
if (dispatch[fn].command == NULL)
  printf("Unknown command: '%s'\n", command);
```

Of course, *the parameters to the functions can be anything,* as can the return values, as long as **every function has an identical prototype.**

See the [full example]({{site.examples}}/function-table) for more details.

> If you choose to take this approach, you may not want to structure your code in the same way as in the above example.
> For example (hint hint), you may want to parse the Messages into tokens, then pass around arrays of tokens rather than strings like "rest of line".

### GUI with ncurses {#ncurses}

Implementing a graphical user interface (GUI) typically requires a significant learning curve, because the libraries for graphical interface (at least in C on Unix) are complex.
It is relatively easy to make a *visual* display, if not truly graphical, on a plain-text terminal (even over ssh!).

In CS50, we use the [ncurses library](https://en.wikipedia.org/wiki/Ncurses) library; see the [tutorials](https://en.wikipedia.org/wiki/Ncurses#Programming_introductions).
The ncurses library is pre-installed on the CS50 Linux servers and on MacOS; see `man ncurses`.
If it's missing, you can install it on your Mac with `brew install ncurses`.

Here's a tiny little [curses example]({{site.examples}}/curse.c).
Here's an even cooler example, [Conway's Game of Life]({{site.examples}}/life.c).

### Testing {#testing}

**test build**:
Commit and push all your changes.
Clone a fresh copy of your project repo in a totally separate directory - ensuring the directory is unreadable by other users -
and then `make all`.
Ensure it builds without error or warnings.
(Pebble build should automatically be skipped on Linux hosts.)
Then, `make clean` to clean up.
Then, `git status` to ensure that no new files appear as untracked or missing, as a means of checking whether your `make clean` rule is consistent with your `.gitignore` file and with the set of files you've committed to the repo.
(If there are inconsistencies you may need to add something to `.gitignore` or remove something from your repo or adjust your Makefile.)

**test comms**:
Your three programs communicate via UDP datagrams.
They will receive UDP datagrams from anyone who sends a datagram to their port.
Take advantage of this behavior to construct test programs that can send properly-formatted datagrams to your programs, allowing you test their response to different protocol messages; you could even script these tests with bash or python scripts.

**unit tests**:
Write unit tests for the helper modules - before integrating those modules into one of the larger programs.
Leverage the [unit-testing framework]({{site.lectures}}/unittest/).

### Git coordination {#grablocks}

Git allows many people to share a directory tree - but each person has their own copy (a 'clone') of those files.
Each person makes their own edits, commits to their own repo, and then 'pushes' changes back to the shared repository (on Gitlab, in our case).
When someone else has already pushed some changes, you need to 'pull' those changes and 'merge' them into your own repo.
Most of the time, this goes smoothly -- git automatically merges changes.
But if two people change the same file, 'conflicts' occur, and those must be resolved (sometimes painfully).

It's best to find a way to avoid such conflicts.
If you're all sitting in the same room, you can communicate verbally.
If you're all in some chat session, you can communicate textually.
But when you're working somewhat asynchronously, these methods don't cut it.

Here's a trick we often use: create a Google Sheet listing all the source files, and share it with everyone on the group.
Column A lists the file names.
Column B indicates the name of a programmer editing that file.
The next step requires discipline: *before work, check the sheet*.
Find the file you want to edit; if there is no name in Column B, enter your name.
Then do `git pull` to make sure you have the latest version, make your edits, `git commit`, `git push`, and finally, remove your name.

To make it easy to find the right sheet, at least on MacOS,
we often create a little file called `grablocks` that contains one line:

```
open https://docs.google.com/spreadsheets/d/1_5KmEfOHxWAKGmkyYUtWd6aVgPtGsFUVK-7VAHxSoKQ/edit?usp=sharing
```
then `chmod +x grablocks` and `git add grablocks; git ci grablocks; git push` to make sure it's useful to everyone.

Anyway, this is one trick.
It requires discipline to use the sheet before and after an edit session.
You may find it works for your group.
Or you may find a better way.

---
layout: page
title: Tips and hints
---

### Module for handling sockets

Sockets are great, but socket code is pretty ugly.  I highly recommend that you write some sort of 'message' module, perhaps useful in both the Game Server and Guide Agent, that would abstract away the mechanism used for receiving and sending messages.  This separates all the ugliness of socket handling from the game logic.  It also makes it much easier to support 'raw'-mode logging because there is one place to log every inbound and outbound message.  It eases debugging because it provides a clear point at which you might set a gdb breakpoint relevant to all inbound and outbound message.  It also provides opportunities for testing, e.g., to read messages from a file instead of from a socket, or write messages to a file instead of to a socket, enabling you to run automated tests against your game server or guide agent.

### Module for parsing

I highly recommend writing some sort of 'parser' module to handle all the nitty-gritty details of parsing (e.g., with the `strtok()` library function) and validating messages.  You definitely want to keep this code separate from your game logic, and pushing it out into a separate module means you might be able to share this code across two or three components.

### Command-line options

You are welcome to add *optional* parameters to the command line, as long as they are *optional* and the program runs in some default way using the specified arguments in the specified order.

If you want to add a lot of command-line options, using `-switch` format, you might like to explore the `getopt()` library function.

### Time

In several places you need to know the time, or keep track of elapsed time.  On the Pebble side, see the Pebble documentation.  On the Unix side, you'll need to use the `time()` system function (see `man 2 time`).  In short, 

```c
#include <time.h>

time_t start = time();
//... do other things, time passes...
time_t now = time();
time_t elapsed_seconds = now - start;
```

If you want to print a time value (e.g., it might be nice to print the date & time at the start of each logfile line), look at the functions in `man ctime`.

### Random numbers

To generate random numbers, use the `random()` and `srandom()` functions available in `<stdlib.h>`.  See my [fuzzquery.c]({{site.examples}}/fuzzquery.c) for example usage.

However, for a reason I don't totally understand, I needed to change to the (more relaxed) `gnu11` standard instead of the `c11` standard to compile my code when using these functions.

```make
# Need to use gnu11 instead of c11 standard, to access random/srandom
CFLAGS = -Wall -pedantic -std=gnu11 -ggdb $(FLAGS) -I$C -I$L
```

### Function tables

Many programs encounter the following situation: There are a range of 'commands' or 'cases' supported, each selected by a command name, keyword, code number, or the likes.  You've written a different function to handle each command or case.  You now need some code that will *dispatch* (call) the relevant function according the command you encounter. If the choice is selected by a simple type (like an integer type) then you could write a big `switch` statement, wherein each `case` statement calls the relevent function. But this can be pretty lengthy.  And what to do, if the choice is indicated by a string?

*Function tables* are a concept designed for just this kind of situation (and others).  Let's look at an example.

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

Here we see four functions, each presumably handling one of the four commands GET, PUT, HELLO, GOODBYE. Then we declare and initialize an array of structs, each of which has the name of the command and a pointer to the function that handles the command.

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

Of course, **the parameters to the functions can be anything, as can the return values, as long as every function has an identical prototype.**

See the [full example]({{site.examples}}/function-table) for more details.

> If you choose to take this approach, you may not want to structure your code in the same way as in the above example.  For example, you may want to parse the Messages into tokens, then pass around arrays of tokens rather than strings like "rest of line". 

### Git coordination

Git allows many people to share a directory tree - but each person has their own copy (a 'clone') of those files.  Each person makes their own edits, commits to their own repo, and then 'pushes' changes back to the shared repository (on Gitlab, in our case).  But, as you've found, when someone else has already pushed some changes, you need to 'pull' those changes and 'merge' them into your own repo.  Most of the time, this goes smoothly - git automatically merges changes.  But two people change the same file, 'conflicts' occur, and those must be resolved (sometimes painfully). 

You need to find a way to avoid such conflicts.  If you're all sitting in the same room, you can communicate verbally.  If you're all in some chat session, you can communicate textually.  But when you're working somewhat asynchronously, these methods don't cut it.  

Here's a trick we often use:  create a Google Sheet listing all the source files, and share it with everyone on the team.  (Check out this example for my TSE.)  The next step requires discipline: before work, check the sheet.  Find the file you want to edit; if there is no name, enter your name.  Then do `git pull` to make sure you have the latest version, make your edits, `git commit`, `git push`, and finally, remove your name.

To make it easy to find the right sheet, at least on MacOS, I often create a little file called `grablocks` that contains one line:

```
open https://docs.google.com/spreadsheets/d/1_5KmEfOHxWAKGmkyYUtWd6aVgPtGsFUVK-7VAHxSoKQ/edit?usp=sharing
```

then `chmod +x grablocks` and `git add grablocks; git ci grablocks; git push` to make sure it's useful to everyone.

Anyway, this is one trick.  It requires discipline to use the sheet before and after an edit session.  You may find it works for your group.  Or you may find a better way.

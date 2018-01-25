---
layout: page
title: Extra - More gdb and profiling performance with gprof
---

In this "Extra" we cover some additional information about GDB as well as a code profiling tool, `gprof`.

### Using gdb to debug "core" files

Something you will likely encounter in your programming endeavors is the notorious "core dump."
A core dump is really nothing more than a record of the working memory of a program at a specific point in time;
    usually this point in time is when a program does something bad and the computer doesn't know how to handle the issue.
The computer simply raises its hands and says
    "I'm done. I killed the program and dumped a bunch of information in a file for you to review if you want."
In cs50 a common notice is the "segfault" or "segmentation fault" which refers to accessing invalid memory.

It just so happens that `gdb` can take core dump files as input.
Generally speaking, you can start `gdb` with no arguments, or with the name of an executable as an argument.
You can also start `gdb` with both an executable program *and* a core file specified:

```bash
$ gdb program core
```

**Important:** Linux has recently changed the way core dumps are produced.
Traditionally, when your program crashed with a 'segmentation fault' or certain other errors, Unix would "dump core".
That is, it wrote a snapshot copy of the process's memory into a file called `core` in the current working directory.
These files are *huge*.
Programmers (or users) often don't notice them, and the file system can become littered with droppings.
*Huge* droppings.
So Linux now dumps core files in a central location, where they can be managed, and cleaned up.
To find your core files, type

```bash
$ coredumpctl list
```

And to use one of those core files with gdb, say, the one associated with dead process 20421,

```bash
$ coredumpctl gdb 20421
```

For more information, read the department's wiki [page about core dumps](https://wiki.cs.dartmouth.edu/faq/doku.php/users_faq:coredump).

In this class it is usually sufficient to debug the program directly and you really shouldn't
    need to concern yourself with debugging `core` files directly.
There are advantages to debugging a `core` file, however,
    since it generally captures state such as the values of the processor registers at the time of the core dump,
    information about the processor,
    flags that are set in your OS (i.e., OS configurations), and so forth.

### The `gprof` Tool

***NOTE: In these notes there are many references to the "crawler." This program will be coded by you in a future assignment.***

The `gprof` tool is used to profile the runtime performance of code.
Many times you might be confident that the code is bug free because there are no *functional* problems.
However, the code could be worthless if it does not meet its performance requirements.
The `gprof` tool is an execution profiling tool that is useful when tracking down performance problems.

**Warning.** `gprof` doesn't always work well on MacOS.
Log on to a machine in the lab to try it out.

Anecdotal evidence.
Many time programmers focus on getting the code to work functionally and then think about speed up.
This is not always the most productive approach to design or systems development.
Best to design for speed if needed (e.g., use a hash table instead of searching a long double linked list).

> **An Anecdote from Professor Andrew Campbell:**
> I recall once working as a consultant on improving the performance of a radio router.
The performance of the system coded in Ada was appalling and someone's head was about to roll.
I spend probably two weeks just studying the code of a very large system - difficult to keep that all in your head.
Profiling the code highlighted the cost of a system that had been desiged and coded with an excessive number of tasks and rendezvous.
The cost of interprocess communications was high.
What did I do? It was not nice.
Turned the system into one large task and replaced all interprocess communications (IPC) (which represented system calls) with my library that implemented the IPC API.
I changed a couple 100 lines of code in a system of 20,000 lines of code.
The improvement was massive.
Packets could be forwarded from one radio input to the output radio in under 100 msec which was down from 1 second!
I was king for the day, or week.
I made my changes, tested them locally, desk checked the code closely - and, it ran first time!
The guy who designed the system wanted me to fail - I could feel it.
But when that router ran first time, well, that is a moment I will always remember.
My reward? I got to design the next system.
The problem was essentially a performance bug.
The changes were simple once the problem was identified.
I took a very radical approach that ran against OO design.
But that is what was needed.
A router that forwarded packets at 1 second intervals was not going to fly with the customer.

To run the `gprof` tool, first use the `-pg` switch in the compiler flags:

```makefile
# Filename: Makefile
# Description: The make file is to build up the crawler.

CC=gcc
CFLAGS=-Wall -pg -pedantic -std=c11
SOURCES=./list.h ./list.c ./crawler.c ../util/hash.c ../util/html.c
```

Once you have done a build with `-pg` then run the application.

```bash
$ pwd
/net/nusers/campbell/cs50/l16/lab4/src/crawler

$ ./crawler www.cs.dartmouth.edu ../../data/ 2
```

Now you are ready to run the `gprof` tool:

```bash
$ gprof crawler gmon.out > profile
```

An excerpt from the output of the profile is below.
You can learn a lot about where your program is spending time by studying this output.
There is a reasonable amount of documentation included in the report which will help the interested person navigate the report's output, and there's also lots more in the `man` pages.

```bash
    Flat profile:

    Each sample counts as 0.01 seconds.
      %   cumulative   self              self     total
     time   seconds   seconds    calls  us/call  us/call  name
     35.75      0.05     0.05      203   246.54   246.54  removeWhiteSpace
     14.30      0.07     0.02    43714     0.46     0.46  hash1
     14.30      0.09     0.02    22186     0.90     3.16  GetNextURL
      7.15      0.10     0.01    21533     0.46     0.46  NormalizeURL
      7.15      0.11     0.01     1351     7.41     7.94  DAdd
      7.15      0.12     0.01     1351     7.41     7.41  getAddressFromTheLinksToBeVisited
      7.15      0.13     0.01      203    49.31   394.47  extractURLs
      7.15      0.14     0.01      203    49.31   237.36  updateListLinkToBeVisited
      0.00      0.14     0.00    43714     0.00     0.46  make_hash
      0.00      0.14     0.00    21147     0.00     0.91  GetDataWithKey
      0.00      0.14     0.00    19795     0.00     1.45  addElement
      0.00      0.14     0.00     1351     0.00     1.38  setURLasVisited
      0.00      0.14     0.00      208     0.00     0.00  getPage
      0.00      0.14     0.00      203     0.00     0.00  ReadFileToMemoryOrDie
      0.00      0.14     0.00      203     0.00     0.00  file_length
      0.00      0.14     0.00        1     0.00     0.00  CleanDictionary
      0.00      0.14     0.00        1     0.00     0.00  InitDictionary
      0.00      0.14     0.00        1     0.00     0.00  IsDirectory
      0.00      0.14     0.00        1     0.00     0.00  cleanup
      0.00      0.14     0.00        1     0.00     0.00  initList

     %         the percentage of the total running time of the
    time       program used by this function.

    cumulative a running sum of the number of seconds accounted
     seconds   for by this function and those listed above it.

     self      the number of seconds accounted for by this
    seconds    function alone.  This is the major sort for this
               listing.

    calls      the number of times this function was invoked, if
               this function is profiled, else blank.

     self      the average number of milliseconds spent in this
    ms/call    function per call, if this function is profiled,
               else blank.

     total     the average number of milliseconds spent in this
    ms/call    function and its descendents per call, if this
               function is profiled, else blank.

    name       the name of the function.  This is the minor sort
               for this listing. The index shows the location of
               the function in the gprof listing. If the index is
               in parenthesis it shows where it would appear in
               the gprof listing if it were to be printed.
    ^L
                         Call graph (explanation follows)


    granularity: each sample hit covers 2 byte(s) for 7.14% of 0.14 seconds

    index % time    self  children    called     name

    [1]    100.0    0.00    0.14                 main [1]
                    0.01    0.07     203/203         extractURLs [2]
                    0.01    0.04     203/203         updateListLinkToBeVisited [5]
                    0.01    0.00    1351/1351        getAddressFromTheLinksToBeVisited [12]
                    0.00    0.00    1351/1351        setURLasVisited [13]
                    0.00    0.00     208/208         getPage [14]
                    0.00    0.00       1/1           IsDirectory [19]
                    0.00    0.00       1/1           initList [21]
                    0.00    0.00       1/1           cleanup [20]
    -----------------------------------------------
                    0.01    0.07     203/203         main [1]
    [2]     57.1    0.01    0.07     203         extractURLs [2]
                    0.02    0.05   22186/22186       GetNextURL [3]
    -----------------------------------------------
    -----------------------------------------------
                                    1676             GetNextURL [3]
                    0.02    0.05   22186/22186       extractURLs [2]
    [3]     50.0    0.02    0.05   22186+1676    GetNextURL [3]
                    0.05    0.00     203/203         removeWhiteSpace [4]
                                    1676             GetNextURL [3]
    -----------------------------------------------
                    0.05    0.00     203/203         GetNextURL [3]
    [4]     35.7    0.05    0.00     203         removeWhiteSpace [4]
    -----------------------------------------------
                    0.01    0.04     203/203         main [1]
    [5]     34.4    0.01    0.04     203         updateListLinkToBeVisited [5]
                    0.00    0.03   19794/19795       addElement [6]
                    0.01    0.00   20182/21533       NormalizeURL [11]
    -----------------------------------------------
                    0.00    0.00       1/19795       setURLasVisited [13]
                    0.00    0.03   19794/19795       updateListLinkToBeVisited [5]
    [6]     20.5    0.00    0.03   19795         addElement [6]
                    0.00    0.02   19795/21147       GetDataWithKey [9]
                    0.01    0.00    1351/1351        DAdd [10]
    -----------------------------------------------
                    0.02    0.00   43714/43714       make_hash [8]
    [7]     14.3    0.02    0.00   43714         hash1 [7]
    -----------------------------------------------

    ... 152 lines omitted
```

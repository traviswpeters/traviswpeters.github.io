---
layout: page
title: Section meeting - week 4
---

This page is written for the Section leader,
    but shared later with students so they can refer back to the activity conducted in Section meeting.

## Goal:
To provide an opportunity for students to get more familiar with using `gdb` and `valgrind` to find and fix logic and memory-related bugs.

## Activity:

Use `valgrind` to confirm the memory leaks we saw in `names9`
    (if you need a reminder, see the [lecture notes](../index.html) for debugging with `gdb` and `valgrind`).
Use `gdb` to investigate the code as you need.
Fix the memory leaks in `names9`.
Use `valgrind` to check to see if you've addressed all of the leaks.
Repeat until you get a clean memory report from `valgrind`.

Grab the `names9` (and dependencies) code:

```
cd ~/cs50
cp ~cs50/examples/names9.c names.c;
cp ~cs50/examples/readlinep.[ch] .
mygcc names.c readlinep.c -o names
```

(If you are reading these notes and you don't have access to the `~cs50` directory,
    or if the cs50 website is not up,
    you can also get the source files here:
    [names9.c](../neglected-names/names9.c),
    [readlinep.c](../neglected-names/readlinep.c),
    [readlinep.h](../neglected-names/readlinep.h).)

***NOTE: While students should be able to track down where the issue is pretty easily,
    if anyone gets stuck you can point them to the comment in main() that alludes to the "lazy" handling of memory clean-up.***

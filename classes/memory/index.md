---
layout: page
title: Three kinds of memory
---

A note to readers:
> The following page is part of the notes composed for CS 50 at Dartmouth College.
> The text was initially crafted by Professors Palmer, Zhou, Campbell, and Balkcom;
> it was subsequently revised by myself and Professor David Kotz.
> As a Teaching Assistant for CS 50 in Spring 2016,
> I gave a guest lecture about the different types of memory where *data* can be stored.
> Note that we did not emphasize memory segments where the executable *code* ("text") itself is stored.
>
> **This specific revision of the notes is current as of April 2016.**
>
> -Travis

To truly understand C, and in particular, the use of pointers, you need to understand how C programs use memory.
These same concepts underly nearly all procedural languages, though some languages cover up the details.

### Goals

1. to recognize that all data is stored in memory,
    that memory is a linear sequence of bytes, and that every byte has a numeric *address*.
2. to understand that C stores all data in one of *three areas of memory*, each managed differently.
3. to understand how these memory concepts relate to concepts about *name scope*

## Three regions of (data) memory

Every bit of information the computer needs must be stored somewhere in memory - whether instructions or data.
The computer's memory is a sequence of bytes, each byte with its own numeric *address*.
If the computer has one megabyte of memory, these 2^20 bytes will be numbered from 0 to 2^20-1,
    that is, from 0 to 1,048,575.
Or, since we're computer scientists, we work in hexadecimal rather than decimal;
    the bytes are numbered from 00000 to FFFFF.
In practice, we tend to write hexadecimal numbers in C notation: 0x00000 to 0xFFFFF.

When you run your program, it becomes a *process* within Unix.
(To see a list of all your processes, type `ps` at the bash commandline.
To see *all* the processes running on the system, try `ps ax`.)
Your program's executable code is copied into memory so the processor can read the instructions and execute them.
In this course, we won't talk more about that region of memory (sometimes called the *code segment* or *text segment*).

Let's focus on data, which live in the other three segments.

C stores all of the data your program manipulates in three distinct regions of memory.
There's nothing special about each region - they're all somewhere in that linear sequence of bytes - but
    C manages each differently. Let's look at each in turn.

### Global memory (aka static)

The simplest region is called 'global' (or 'static') storage, and it's where global variables live.
If you define a constant or variable outside of any function, it has

  * *global scope* - meaning that it is visible to all code in any function within the current file, and
  * *static storage* - meaning that C allocates space for it (and initializes the contents) before the program begins executing; its address will never change throughout the execution of the program (hence the name 'static').

For example,

```c
const float pi=3.1415926535;
const char usage[] = "Usage: dog [-n] [-m mapfile] [-] [filename]...\n";
int error_count = 0;

int main()
{
...
}
```

The above declares three global variables, two of which are constants and one of which is variable.
All are visible to functions defined below their declaration.
Global variables are always declared at the top of a C file,
    after `#include` directives and before any function definitions.

Global variables can be handy, and sometimes necessary, but it is good style to avoid use of global variables.
(Global constants are generally ok.)
Modular programs keep their data close - passing the data (or pointers to data) among functions.

There are two kinds of 'global' in C: global within a C file, and global across all C files in the program.
The former are reasonable, if used carefully, but the latter are more dangerous.
We'll discuss the differences later, if we have time.

### The Stack (for local variables)

All of the example code we've seen so far makes extensive use of local variables;
    these variables are defined within a function and have

  * *local scope* - meaning that the variable is visible within the function only, and
  *  *stack storage* - meaning that C allocates space for the variable within the stack frame for this particular instance of this function call.

**Note:** Local variables include the function's parameters.

Think about how a stack works.
When the program starts, C allocates a chunk of bytes on the stack to hold all the variables defined in `main`.
This chunk is called a 'stack frame'.
*It does not initialize these bytes* - the program must initialize variables,
    either in the variable definition or in the code to follow.
Later, when `main` calls another function, say, `readLine`, it allocates another chunk of bytes on the stack
    (you could say, it *pushes another frame on the stack*) to hold the variables defined by `readLine`.
When `readline` calls `fgets`, it pushes another stack frame on the stack,
    a chunk of bytes to hold the variables defined within `fgets`.
When `fgets` returns, it *pops the frame off the stack*.
When `readLine` returns, it pops that frame off the stack.
The local variables defined in `readLine` are not just syntactically inaccessible to `main` (out of scope),
    their memory is no longer allocated.
Indeed, when `main` calls another function, say, `printf`, a stack frame is pushed on to the stack for `printf`,
    re-using the same memory that had been allocated to `readLine` and `fgets`).

(We'll draw some pictures of stack frames in class.)

### The Heap (dynamically allocated memory)

The third kind of data memory is called the "heap".
It is a large region of memory managed by `malloc()`.
Each call to `malloc()` selects a chunk of bytes from the heap region, and returns a pointer to that chunk.
It keeps careful records of which chunks have been allocated, and which are free.
It is the programmer's responsibility to, eventually,
    return unused chunks by calling `free(p)` where `p` is a pointer earlier returned by `malloc`.
If the programmer forgets to call `free`,
    that chunk can never be reused, and eventually `malloc` will run out of free chunks to be allocated.
(This situation is called a 'memory leak.')
It is also the programmer's responsibility not to call `free` multiple times for the same pointer;
    doing so may corrupt the records kept by the memory-allocation library, and will likely lead to program crashes.

There are four related functions you should understand:

* `p = malloc(n)` - allocates `n` bytes of heap memory
* `p = calloc(count, size)` allocates `count*size` bytes of heap memory
* `p = realloc(p, n)` - where `p` is a pointer to heap memory - expands (or shrinks) its allocation to `n` bytes.
* `free(p)` - where `p` is a pointer to heap memory - releases that portion of heap memory for future use.

Check out this [animated explanation of pointers](https://www.youtube.com/watch?v=5VnDaHBi8dM).
Fun!

### On exit

When the process exits, all its memory is released - the four segments (code, global, stack, and heap) disappear.

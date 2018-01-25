---
layout: page
title: Extra - password bug solution details
---

In the password example we entered the wrong password but still managed to
    "authenticate" as if the program was given the correct password.

This outcome makes sense if you think about it.
Our `guess` buffer was created to only hold 10 `char`'s and we were a little careless
    with our `fgets` statement (i.e., we didn't correctly limit the amount of text it would read in).
Also, we had (unfortunately) created our `authenticated` flag just *after* our `guess` buffer.
When the user of the program enters a guess that is greater than the length of the buffer
    that is intended to hold the guess,
    `fgets` happily keeps reading in characters and writing them to where it presumes a valid buffer lives.
So, despite a bad guess from the user,
    it is still possible to craft an input such that the memory that holds the `authenticated`
    value gets changed (overwritten) to some non-zero value,
    effectively tricking the program into thinking that the user entered the correct password as their guess.

We will leave it to you as an exercise to address the issue with our call to `fgets` and
    any other things that you can find/fix in order to make the password program work correctly.

This is a fairly trivial example of a *buffer overflow* that results in undesirable behavior.
Imagine, however, that our buffer overflow affected the return address on the stack and,
    upon returning from some function,
    our code returned to some malicious code (thinking it was the original caller).
Then our machine would be executing code that we never intended for it to run!
This would be bad news!

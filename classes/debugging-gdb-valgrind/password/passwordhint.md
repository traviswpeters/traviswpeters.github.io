---
layout: page
title: Extra - password bug hint
---

Let's take a look at a case where a blatantly bad password is entered, yet the user still succeeds in authenticating:

```
$ gdb password
...
(gdb) break check_password
Breakpoint 1 at 0x4008b4: file password.c, line 57.
(gdb) run
Starting program: /net/grad/traviswp/cs50-live/password/password

Breakpoint 1, check_password () at password.c:57
57	    int authenticated = 0;       // "flag" that determines if the user successfully authenticated.
(gdb) info locals
guess = "\001\000\000\000\000\000\000\000\315\t"
authenticated = 0
(gdb) next
60	    printf("password: ");
(gdb) next
61	    if (fgets(guess, 50, stdin) == NULL)
(gdb) next
password: abcdefghijklmn        //<<<<<<<<<<<<<< look at this password I entered!
65	    if (strlen(guess) == 0)
(gdb) info locals               //<<<<<<<<<<<<<< and look at how that impacted the local variables!
guess = "abcdefghij"
authenticated = 683629          //<<<<<<<<<<<<<< WHOA! WHAT JUST HAPPENED?!
(gdb) next
71	    if (guess[strlen(guess)-1] != '\n') {
(gdb) next
78	        guess[strlen(guess)-1] = 0;
(gdb) continue
Continuing.
success!                        //<<<<<<<<<<<<<<<<<<< Awesome! We are in! But weird... we didn't enter the correct password...
[Inferior 1 (process 17643) exited normally]
```

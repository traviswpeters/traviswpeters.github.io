---
layout: page
title: Activity - Debugging
---

Grab my classroom demo code [password.c](./password/password.c)
    and its
    [Makefile](./password/Makefile) --- or just build the program by hand:

```bash
mygcc password.c -o password
```

**Work in pairs** using `gdb` to track down the bug that allows a successful authentication
    when certain passwords are entered.
You don't have to fix it (though I challenge you to do it!)
    but you should be able to explain exactly what the problem is and how one *might* go about fixing it.

You should be able to use `gdb` to show where the bug is located.

---

***Don't look at these unless you are absolutely stuck and have spoken with others!***

Here is my **[hint.](password/passwordhint.html)**

Here is the **[solution.](password/passwordsolution.html)**

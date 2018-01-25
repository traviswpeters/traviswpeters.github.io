---
layout: page
title: Activity - pointers
---

Review the example [stringcopy.c]({{site.examples}}/stringcopy.c), excerpted below; it is buggy (and triggers a *segmentation fault* when run on my Mac!).

* Explain the pointer notation used in the parameters.
* Explain the pointer notation used in the conditional.
* Explain what happens inside the loop.
* Why is there an assignment after the loop?
* Where is the bug in `main()`?
* What might go wrong inside `stringcopy`?

```c
int main()
{
  char *src = "Computer Science 50";
  char *dest; 

  // copy src to dest and print them out
  stringcopy(src, dest);
  printf("src  = '%s'\n", src);
  printf("dest = '%s'\n", dest);
  return 0;
}

/* stringcopy - copy string from source sp to destination dp */
void stringcopy(char *sp, char *dp)
{
  while (*sp != '\0') {
    *dp++ = *sp++;
  }
  *dp = '\0';
}
```

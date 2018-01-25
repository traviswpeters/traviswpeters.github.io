/* 
 * names9.c - read in a list of names from stdin
 *  (derived from names5.c, to use a 'bag' to store names)
 *
 * usage: names < infile
 * stdin: list of names, one per line
 * stdout: list of names, one per line
 * 
 * David Kotz, April 2016, 2017
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "readlinep.h"

/* the items in a bag */
typedef struct bagnode {
  void *item;
  struct bagnode *next;
} bagnode_t;

bagnode_t *bagnode_new(void *item);

/* the bag as a whole */
typedef struct bag {
  bagnode_t *head;
} bag_t;

bag_t * bag_new(void);
bool bag_insert(bag_t *bag, void *item);
void *bag_extract(bag_t *bag);
void bag_print(bag_t *bag, void (*printfunc)(void *item));
void printname(void* item) { char *name=item;  printf("%s", name); }

/* ********************************************************* */
int main()
{
  int n = 0;			       // number of names read
  char *name;

  bag_t *bag = bag_new();
  if (bag == NULL)
    exit(1);

  // read the list of names - any number of names!
  while (!feof(stdin)) {
    name = readlinep();
    if (name != NULL) {
      if (bag_insert(bag, name)) {
	n++; // only increment if no error
      }
    }
  }
  
  printf("%d names:\n", n);
  // print the list of names
  //  while ( (name = bag_extract(bag)) != NULL)
  //    printf("%s\n", name);

  bag_print(bag, printname);
  putchar('\n');

  // here we are lazy and do not free the bag. 

  return 0;
}

/* *************************************************
 * bag_new: create a new bag.
 * Return a pointer if success, NULL if failure.
 */
bag_t * 
bag_new(void)
{
  bag_t *bag = malloc(sizeof(bag_t));

  if (bag != NULL) {
    bag->head = NULL;
  }
  return bag;
}


/* *************************************************
 * bag_insert: insert the given name into the bag.
 * Return true if success, false if failure.
 */
bool bag_insert(bag_t *bag, void *item) 
{
  bagnode_t *node = bagnode_new(item);

  if (bag == NULL || node == NULL) {
    return false;
  } else {
    // insert the new node at head of the list
    node->next = bag->head;
    bag->head = node;
  }
  return true;
}


/* *************************************************
 * bagnode_new: create a new node to store the given name.
 * Returns pointer to new node, if successful, else returns NULL.  
 * The pointer 'name' is assumed to be malloc storage, and is not copied.
 * Caller is responsibe for later deleting 'name'.
 */
bagnode_t *bagnode_new(void *item) 
{
  // allocate memory for the new node
  bagnode_t *node = malloc(sizeof(bagnode_t));
  
  if (node == NULL) {
    return NULL;
  } else {
    // initialize node contents
    node->next = NULL;
    node->item = item;
  }

  return node;
}

/* *************************************************
 * bag_extract: extract an item (any item) from the bag.
 * Return NULL if bag is empty or if some failure.
 */
void *bag_extract(bag_t *bag) 
{
  if (bag == NULL) {
    return NULL;
  } else if (bag->head == NULL) {
    return NULL;
  } else {
    // pull off the node at head of the list
    bagnode_t *node = bag->head;
    void *item = bag->head->item;
    bag->head = node->next;
    free(node);
    return item;
  }
}


/* *************************************************
 * bag_print: print a bag, calling the func on each item.
 */
void bag_print(bag_t *bag, void (*printfunc)(void *item)) 
{
  if (bag == NULL) {
    return;
  } else {
    printf("{");
    for (bagnode_t *node = bag->head; node != NULL; node = node->next) {
      if (printfunc != NULL)
	(*printfunc)(node->item);
      printf(", ");
    }
    printf("}");
  }
}


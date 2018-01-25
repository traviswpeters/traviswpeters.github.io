CC = gcc
CFLAGS = -Wall -pedantic -std=c11 -ggdb  
PROG = names9
OBJS = names9.o readlinep.o
LIBS =

$(PROG): $(OBJS)
	$(CC) $(CFLAGS) $^ $(LIBS) -o $@

clean:
	rm -f *~
	rm -f *.o *.i *.s *.bc
	rm -f core
	rm -f $(PROG)

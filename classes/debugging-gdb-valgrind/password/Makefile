CC = gcc
CFLAGS = -Wall -pedantic -std=c11 -ggdb -save-temps 
PROG = password
OBJS = password.o
LIBS =

$(PROG): $(OBJS)
	$(CC) $(CFLAGS) $^ $(LIBS) -o $@

clean:
	rm -f *~
	rm -f *.o *.i *.s *.bc
	rm -f core
	rm -f $(PROG)
